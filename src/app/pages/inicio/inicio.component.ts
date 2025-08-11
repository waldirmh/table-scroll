import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ViewChild, ElementRef, Inject, HostListener
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
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
  products: Product[] = [];
  allProducts: Product[] = [];
  visibleProducts: Product[] = [];

  // Filtros
  categories: string[] = [];
  filtersForm!: FormGroup;

  // UI / carga
  isLoading = false;

  skeletonRows = Array.from({ length: 20 });
  constructor(private fb: FormBuilder, @Inject(PLATFORM_ID) _platformId: Object) {
    this.filtersForm = this.fb.group({
      query: [''],
      category: [''],
      offer: [''],
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


  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
  }

  resetFilters(): void {
    this.filtersForm.reset({
      query: '',
      category: '',
      offer: '',
      minPrice: '',
      maxPrice: ''
    });
  }

  applyFilters(): void {
    const { query, category, offer, minPrice, maxPrice } = this.filtersForm.value;
    const qNorm = (query ?? '').toString().trim().toLowerCase();
    const min = minPrice !== null && minPrice !== '' ? Number(minPrice) : null;
    const max = maxPrice !== null && maxPrice !== '' ? Number(maxPrice) : null;

    this.products = this.allProducts.filter(p => {
      const matchText = !qNorm || p.code.toLowerCase().includes(qNorm) || p.name.toLowerCase().includes(qNorm);
      const matchCat = !category || p.category === category;
      const matchOffer = !offer || (offer === 'yes' && p.inOffer) || (offer === 'no' && !p.inOffer);
      const matchMin = min === null || p.price >= min;
      const matchMax = max === null || p.price <= max;
      return matchText && matchCat && matchOffer && matchMin && matchMax;
    });
  }


  private getAllProducts(): void {
    this.isLoading = true;
    setTimeout(() => {
      try {
        const seed = data as Product[];
        this.allProducts = seed;
        this.products = [...seed];
        this.categories = Array.from(new Set(seed.map(p => p.category))).sort();
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    }, 1000);
  }




}
