import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Product } from '../../../interface/product';
import { data } from '../../../data/data';

interface FilterValues {
  query: string;
  category: string;
  activated: string;
  minPrice: string | number;
  maxPrice: string | number;
}

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

  categories: string[] = [];
  filtersForm!: FormGroup;

  isLoading = false;
  showAdvancedFilters = false;
  categoryDropdownOpen = false;
  filtersModalOpen = false;
  isDarkMode = true;

  pageSize = 20;
  currentPage = 0;
  hasMorePages = true;
  private loadingMore = false;
  private destroy$ = new Subject<void>();
  private appliedFilters: FilterValues = { query: '', category: '', activated: '', minPrice: '', maxPrice: '' };

  skeletonRows = Array.from({ length: 20 });

  @ViewChild('tableBody') tableBodyRef?: ElementRef<HTMLTableSectionElement>;
  @ViewChild('categoryDropdown') categoryDropdownRef?: ElementRef<HTMLDivElement>;

  constructor(private fb: FormBuilder, @Inject(PLATFORM_ID) private platformId: Object) {
    this.filtersForm = this.fb.group({
      query: [''],
      category: [''],
      activated: [''],
      minPrice: [''],
      maxPrice: ['']
    });

    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('theme');
      if (saved === 'light') {
        this.isDarkMode = false;
      }
    }
  }

  ngOnInit(): void {
    this.setupAutoSearch();
    this.isLoading = true;
    this.getAllProducts();
  }

  ngAfterViewInit(): void {
    const tbody = this.tableBodyRef?.nativeElement;
    if (tbody) {
      tbody.addEventListener('scroll', () => this.onTableBodyScroll());
    }
  }

  ngOnDestroy(): void {
    const tbody = this.tableBodyRef?.nativeElement;
    if (tbody) {
      tbody.removeEventListener('scroll', () => this.onTableBodyScroll());
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupAutoSearch(): void {
    this.filtersForm.get('query')!.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.appliedFilters.query = this.filtersForm.get('query')!.value;
        this.executeFiltering();
      });
  }

  private executeFiltering(): void {
    const { query, category, activated, minPrice, maxPrice } = this.appliedFilters;
    const qNorm = (query ?? '').toString().trim().toLowerCase();
    const min = minPrice !== null && minPrice !== '' ? Number(minPrice) : null;
    const max = maxPrice !== null && maxPrice !== '' ? Number(maxPrice) : null;

    this.products = this.allProducts.filter((p: any) => {
      const matchText = !qNorm || p.code.toLowerCase().includes(qNorm) || p.name.toLowerCase().includes(qNorm);
      const matchCat = !category || p.category === category;
      const matchStatus = !activated || (activated === 'yes' && p.active) || (activated === 'no' && !p.active);
      const matchMin = min === null || p.finalPrice >= min;
      const matchMax = max === null || p.finalPrice <= max;
      return matchText && matchCat && matchStatus && matchMin && matchMax;
    });

    this.resetPagination();
    const tbody = this.tableBodyRef?.nativeElement;
    if (tbody) {
      tbody.scrollTop = 0;
    }
  }

  hasAppliedAdvancedFilters(): boolean {
    const { category, activated, minPrice, maxPrice } = this.appliedFilters;
    return !!(category || activated || minPrice || maxPrice);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (this.categoryDropdownOpen && this.categoryDropdownRef && !this.categoryDropdownRef.nativeElement.contains(target)) {
      this.categoryDropdownOpen = false;
    }
  }

  onTableBodyScroll(): void {
    const tbody = this.tableBodyRef?.nativeElement;
    if (!tbody) return;

    const threshold = 50;
    const nearBottom = (tbody.scrollHeight - tbody.scrollTop - tbody.clientHeight) <= threshold;

    if (nearBottom && this.hasMorePages && !this.isLoading && !this.loadingMore) {
      this.appendNextPage();
    }
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  toggleCategoryDropdown(): void {
    this.categoryDropdownOpen = !this.categoryDropdownOpen;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (isPlatformBrowser(this.platformId)) {
      if (this.isDarkMode) {
        document.documentElement.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
      }
    }
  }

  toggleFiltersModal(): void {
    this.filtersModalOpen = !this.filtersModalOpen;
  }

  closeFiltersModal(): void {
    this.filtersModalOpen = false;
  }

  applyFiltersAndClose(): void {
    this.applyFilters();
    this.filtersModalOpen = false;
  }

  selectCategory(category: string): void {
    this.filtersForm.patchValue({ category });
    this.categoryDropdownOpen = false;
  }

  getSelectedCategoryLabel(): string {
    const val = this.filtersForm.get('category')?.value;
    return val || 'Todas las categorías';
  }

  hasActiveFilters(): boolean {
    const { category, activated, minPrice, maxPrice } = this.filtersForm.value;
    return !!(category || activated || minPrice || maxPrice);
  }

  hasAnyFilterOrSearch(): boolean {
    const { query, category, activated, minPrice, maxPrice } = this.filtersForm.value;
    return !!(query || category || activated || minPrice || maxPrice);
  }

  resetFilters(): void {
    this.filtersForm.reset({
      query: this.appliedFilters.query,
      category: '',
      activated: '',
      minPrice: '',
      maxPrice: ''
    });
    this.appliedFilters.category = '';
    this.appliedFilters.activated = '';
    this.appliedFilters.minPrice = '';
    this.appliedFilters.maxPrice = '';
    this.executeFiltering();
    this.filtersModalOpen = false;
  }

  applyFilters(): void {
    const current = this.filtersForm.value;
    this.appliedFilters.category = current.category;
    this.appliedFilters.activated = current.activated;
    this.appliedFilters.minPrice = current.minPrice;
    this.appliedFilters.maxPrice = current.maxPrice;
    this.executeFiltering();
  }

  private getAllProducts(): void {
    this.isLoading = true;
    setTimeout(() => {
      try {
        const seed = data as Product[];
        this.allProducts = seed;
        this.products = [...seed];
        this.categories = Array.from(new Set(seed.map((p: any) => p.category))).sort();
        this.resetPagination();
      } catch (error) {
        console.error(error);
      } finally {
      }
    }, 1000);
  }

  private resetPagination(): void {
    this.visibleProducts = [];
    this.currentPage = 0;
    this.hasMorePages = this.products.length > 0;
    this.appendNextPage();
  }

  private appendNextPage(): void {
    if (this.loadingMore || !this.hasMorePages) return;
    this.isLoading = true;
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
