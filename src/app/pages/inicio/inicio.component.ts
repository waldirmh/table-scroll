import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ViewChild, ElementRef
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { Product } from '../../../interface/product';
import { data } from '../../../data/data';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit, AfterViewInit, OnDestroy {
  products: Product[] = [];        // filtrados
  allProducts: Product[] = [];     // fuente
  visibleProducts: Product[] = []; // los que se pintan (paginados)

  // Filtros
  categories: string[] = [];
  filtersForm!: FormGroup;

  // UI / carga
  isLoading = false;

  // Scroll infinito
  pageSize = 20;
  currentPage = 0;         // 0-based
  hasMorePages = true;
  private loadingMore = false;

  skeletonRows = Array.from({ length: 20 });

  @ViewChild('tableScroll') tableScrollRef?: ElementRef<HTMLDivElement>;

  constructor(private fb: FormBuilder) {
    this.filtersForm = this.fb.group({
      query: [''],
      category: [''],
      activated: [''],
      minPrice: [''],
      maxPrice: ['']
    });
  }

  ngOnInit(): void {
    this.filtersForm.valueChanges.pipe(debounceTime(400)).subscribe(() => {
      this.applyFilters();
    });

    this.isLoading = true;
    this.getAllProducts();
  }

  ngAfterViewInit(): void { }
  ngOnDestroy(): void { }

  resetFilters(): void {
    this.filtersForm.reset({
      query: '',
      category: '',
      activated: '',
      minPrice: '',
      maxPrice: ''
    });
  }

  applyFilters(): void {
    const { query, category, activated, minPrice, maxPrice } = this.filtersForm.value;
    const qNorm = (query ?? '').toString().trim().toLowerCase();
    const min = minPrice !== null && minPrice !== '' ? Number(minPrice) : null;
    const max = maxPrice !== null && maxPrice !== '' ? Number(maxPrice) : null;

    this.products = this.allProducts.filter((p: any) => {
      const matchText = !qNorm || p.code.toLowerCase().includes(qNorm) || p.name.toLowerCase().includes(qNorm);
      const matchCat = !category || p.category === category;
      const matchOffer = !activated || (activated === 'yes' && p.active) || (activated === 'no' && !p.active);
      const matchMin = min === null || p.finalPrice >= min;
      const matchMax = max === null || p.finalPrice <= max;
      return matchText && matchCat && matchOffer && matchMin && matchMax;
    });
    // reset paginación y primera página
    this.resetPagination();
    // llevar scroll al tope del contenedor
    if (this.tableScrollRef?.nativeElement) {
      this.tableScrollRef.nativeElement.scrollTop = 0;
    }
  }

  onTableScroll(e: Event) {
    const el = e.target as HTMLElement | null;
    if (!el) return;
    const threshold = 50;
    const nearBottom = (el.scrollHeight - el.scrollTop - el.clientHeight) <= threshold;

    if (nearBottom && this.hasMorePages && !this.isLoading && !this.loadingMore) {
      this.appendNextPage();
    }
  }

  // private getAllProducts(): void {
  //   this.isLoading = true;
  //   setTimeout(() => {
  //     try {
  //       const seed = data as Product[];
  //       this.allProducts = seed;
  //       this.products = [...seed];
  //       this.categories = Array.from(new Set(seed.map((p: any) => p.category))).sort();
  //       // arrancar con primera página
  //       this.resetPagination();
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       this.isLoading = false;
  //     }
  //   }, 1000);
  // }
  private getAllProducts(): void {
    this.isLoading = true;
    setTimeout(() => {
      try {
        const seed = data as Product[];
        this.allProducts = seed;
        this.products = [...seed];
        this.categories = Array.from(new Set(seed.map((p: any) => p.category))).sort();
        // primera página
        this.resetPagination();
      } catch (error) {
        console.error(error);
      } finally {
      }
    }, 1000);
  }


  /** Reinicia paginación y carga la primera página */
  private resetPagination(): void {
    this.visibleProducts = [];
    this.currentPage = 0;
    this.hasMorePages = this.products.length > 0;
    this.appendNextPage();
  }

  /** Agrega la siguiente página (20 items) a visibleProducts */
  private appendNextPage(): void {
    if (this.loadingMore || !this.hasMorePages) return;
    this.isLoading = true;
    // Simula latencia de API (4s)
    setTimeout(() => {
      const start = this.currentPage * this.pageSize;
      const end = start + this.pageSize;
      const next = this.products.slice(start, end);
      this.visibleProducts = this.visibleProducts.concat(next);
      this.currentPage++;
      this.hasMorePages = this.visibleProducts.length < this.products.length;
      this.isLoading = false;
    }, 1000);
  }


}
