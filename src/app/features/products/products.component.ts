// src/app/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product';
import { ProductComponent } from '../../shared/components/product/product.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductComponent ], 
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  productsCards!: Product[];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
   
    this.productsService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.productsCards = products;
      },
      error: (err) => {
        console.error('Error in fetching products:', err);
      },
    });
  }
}