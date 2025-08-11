import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Product } from '../../../interface/product';
import { products as seed } from '../../../data/data';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  allProducts: Product[] = seed;
  products: Product[] = [...seed];

  categories: string[] = [];
  filtersForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // categorías únicas ordenadas
    this.categories = Array.from(new Set(this.allProducts.map(p => p.category))).sort();

    this.filtersForm = this.fb.group({
      q: [''],
      category: [''],
      offer: [''],         // '', 'yes', 'no'
      minPrice: [''],
      maxPrice: ['']
    });

    // filtra en vivo
    this.filtersForm.valueChanges.pipe(debounceTime(150)).subscribe(() => this.applyFilters());
  }

  resetFilters(): void {
    this.filtersForm.reset({
      q: '',
      category: '',
      offer: '',
      minPrice: '',
      maxPrice: ''
    });
  }

  applyFilters(): void {
    const { q, category, offer, minPrice, maxPrice } = this.filtersForm.value;

    const qNorm = (q ?? '').toString().trim().toLowerCase();
    const min = minPrice !== null && minPrice !== '' ? Number(minPrice) : null;
    const max = maxPrice !== null && maxPrice !== '' ? Number(maxPrice) : null;

    this.products = this.allProducts.filter(p => {
      // texto: code o name
      const matchText =
        !qNorm ||
        p.code.toLowerCase().includes(qNorm) ||
        p.name.toLowerCase().includes(qNorm);

      // categoría
      const matchCat = !category || p.category === category;

      // oferta
      const matchOffer =
        !offer ||
        (offer === 'yes' && p.inOffer) ||
        (offer === 'no' && !p.inOffer);

      // precio
      const matchMin = min === null || p.price >= min;
      const matchMax = max === null || p.price <= max;

      return matchText && matchCat && matchOffer && matchMin && matchMax;
    });
  }

  trackByCode(_i: number, item: Product): string {
    return item.code;
  }
}
