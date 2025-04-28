import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class AuthFormComponent implements OnInit {
  isLogin = true;
  authForm!: FormGroup ;
  error = '';
  loading = false;
  registeredUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }
  private initForm(): void {
    this.authForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', this.isLogin ? [] : [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  handleSubmit(): void {
    if (this.authForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.authForm.controls).forEach(key => {
        const control = this.authForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = '';
    this.registeredUserId = null;

    const { username, email, password } = this.authForm.value;

    if (this.isLogin) {
      this.authService.login(username, password)
        .pipe(
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: (user) => {
            // Success! Navigate to home page or dashboard
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.error = err.message || 'Login failed. Please check your credentials.';
          }
        });
    } else {
      // Registration logic
      const userData = {
        username,
        email,
        password,
        // Adding required fields for Fake Store API
        name: {
          firstname: 'John', // Example default values
          lastname: 'Doe',
        },
        phone: '123-456-7890',
        address: {
          city: 'Anytown',
          street: '123 Main St',
          number: 1,
          zipcode: '12345',
          geolocation: {
            lat: '0',
            long: '0',
          },
        },
      };

      this.authService.register(userData)
        .pipe(
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: (user) => {
            this.registeredUserId = user.id;
            // Success message and reset form
            this.authForm.reset();
            setTimeout(() => {
              this.isLogin = true;
              this.initForm();
            }, 3000); // Switch to login after 3 seconds
          },
          error: (err) => {
            this.error = err.message || 'Registration failed. Please try again.';
          }
        });
    }
  }

  toggleForm(): void {
    this.isLogin = !this.isLogin;
    this.authForm.reset();
    this.initForm(); // Reinitialize form to update validators
    this.error = '';
    this.registeredUserId = null;
  }
}
