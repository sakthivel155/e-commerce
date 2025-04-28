// src/app/products/products.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product';
import { ProductComponent } from '../../shared/components/product/product.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  productsCards: Product[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  noProductsFound: boolean = false;
  private subscription = new Subscription();

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    // Subscribe to filtered products
    this.subscription.add(
      this.productsService.filteredProducts$.subscribe(products => {
        this.productsCards = products;
        // Set noProductsFound flag if the array is empty
        this.noProductsFound = products.length === 0;
      })
    );

    // Subscribe to search term
    this.subscription.add(
      this.productsService.searchTerm$.subscribe(term => {
        this.searchTerm = term;
      })
    );
    
    // Subscribe to loading state
    this.subscription.add(
      this.productsService.loading$.subscribe(isLoading => {
        this.loading = isLoading;
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions when component is destroyed
    this.subscription.unsubscribe();
  }

  // Method to clear search and show all products
  clearSearch(): void {
    this.productsService.setSearchTerm('');
  }
}