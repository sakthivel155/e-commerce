// src/app/core/services/products.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'https://fakestoreapi.com/products';

  
  // BehaviorSubject to store and emit the current filtered products
  private filteredProductsSubject = new BehaviorSubject<Product[]>([]);
  filteredProducts$ = this.filteredProductsSubject.asObservable();
  
  // BehaviorSubject to store and emit the current search term
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();
  
  // BehaviorSubject to track loading state
  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();
  
  // Cache all products to avoid repeated API calls
  private allProductsCache: Product[] | null = null;


  
  constructor(private http: HttpClient) {
    // Initialize products on service creation
    this.loadAllProducts();
  }

   // Method to force refresh the products (useful for refreshing data)
   refreshProducts(): void {
    this.allProductsCache = null;
    this.loadAllProducts();
  }

  // Load all products initially
  private loadAllProducts(): void {
    this.loadingSubject.next(true);
    
    // Use cached products if available
    if (this.allProductsCache) {
      this.applyFilter(this.searchTermSubject.getValue());
      this.loadingSubject.next(false);
      return;
    }

    this.getProducts().subscribe({
      next: (products) => {
        this.allProductsCache = products;
        this.applyFilter(this.searchTermSubject.getValue());
        this.loadingSubject.next(false);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loadingSubject.next(false);
      }
    });
  }

  // Fetch all products from the API (or return cached version)
  getProducts(): Observable<Product[]> {
    // Return cached products if available
    if (this.allProductsCache) {
      return of(this.allProductsCache);
    }
    
    // Otherwise fetch from API and cache the result
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap(products => {
        this.allProductsCache = products;
      })
    );
  }

  // Update the search term and filter products accordingly
  setSearchTerm(searchTerm: string): void {
    this.searchTermSubject.next(searchTerm);
    this.applyFilter(searchTerm);
  }
   // Filter products using the cached products (no HTTP request)
   private applyFilter(searchTerm: string): void {
    if (!this.allProductsCache) {
      return;
    }
    
    if (!searchTerm) {
      this.filteredProductsSubject.next(this.allProductsCache);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = this.allProductsCache.filter(product =>
        product.title.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term))
      );
      this.filteredProductsSubject.next(filtered);
    }
  }

  // Get the current search term value
  getSearchTerm(): string {
    return this.searchTermSubject.getValue();
  }
 

}