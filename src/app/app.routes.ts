import { Routes } from '@angular/router';
import { ProductsComponent } from './features/products/products.component';
import { FavoritesComponent } from './features/favorites/favorites.component';
import { CartsComponent } from './features/carts/carts.component';
import { SigninComponent } from './features/auth/signin/signin.component';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
    {path:'', component: ProductsComponent},
    {path:'favorite', component: FavoritesComponent },
    {path:'carts', component: CartsComponent },
    {path:'signin', component: SigninComponent },
    {path:'login', component: LoginComponent },
    
];
