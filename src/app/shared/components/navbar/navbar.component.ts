// src/app/shared/components/navbar/navbar.component.ts
import { Component, effect, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../core/services/products.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, RouterLink, FormsModule, CommonModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  searchInput = signal<string>('');
  isUserMenuOpen = signal<boolean>(false);
  
  constructor(
    private productsService: ProductsService,
    public authService: AuthService
  ) {
    // Initialize search input with current search term from service
    this.searchInput.set(this.productsService.getSearchTerm());
    
    // Create an effect to monitor searchInput changes
    effect(() => {
      const currentValue = this.searchInput();
      // Pass the current value to the service to filter products
      this.productsService.setSearchTerm(currentValue);
    });
  }

  onSubmit($event: Event) {
    $event.preventDefault();
    // The effect will handle passing the search term to the service
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update(value => !value);
  }

  logout() {
    this.authService.logout();
    this.isUserMenuOpen.set(false);
  }

  // Returns user's full name or username if name is not available
  getUserDisplayName() {
    const user = this.authService.getCurrentUser();
    if (!user) return '';
    
    if (user.name?.firstname && user.name?.lastname) {
      return `${user.name.firstname} ${user.name.lastname}`;
    }
    
    return user.username;
  }
}