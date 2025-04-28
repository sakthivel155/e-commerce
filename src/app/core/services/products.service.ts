// src/app/core/services/products.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'https://fakestoreapi.com/products';

  private http = inject(HttpClient); 

  getProducts() :Observable<Product[]>{
    return this.http.get<Product[]>(this.apiUrl);
  }
}