import { Routes } from '@angular/router';
import { ProductsComponent } from './features/products/products.component';
import { FavoritesComponent } from './features/favorites/favorites.component';
import { CartsComponent } from './features/carts/carts.component';
import { AuthFormComponent } from './features/auth/auth-form/auth-form.component';

export const routes: Routes = [
    {path:'', component: ProductsComponent},
    {path:'favorite', component: FavoritesComponent },
    {path:'carts', component: CartsComponent },
    {path:'auth', component: AuthFormComponent },
    
];
