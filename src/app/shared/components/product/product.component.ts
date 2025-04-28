import { Component, Input } from '@angular/core';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
 @Input() product!: Product;


}
