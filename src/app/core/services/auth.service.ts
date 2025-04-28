// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  email: string;
  name?: {
    firstname: string;
    lastname: string;
  };
  phone?: string;
  address?: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
}

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();
  
  private API_URL = 'https://fakestoreapi.com';

  constructor(private http: HttpClient) {
    // Check if we have a user in localStorage on init
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string, password: string): Observable<User> { 
    this.isLoadingSubject.next(true);

    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          // Store the token
          localStorage.setItem('token', response.token);
        }),
        // After login, fetch user data
        // Note: Fake Store API doesn't actually have a get user by username endpoint
        // so we're simulating it by getting all users and filtering
        switchMap(() => this.fetchUserByUsername(username)),
        catchError(error => {
          this.isLoadingSubject.next(false);
          return throwError(() => new Error('Invalid credentials'));
        })
      );
  }

  private fetchUserByUsername(username: string): Observable<User> {
    // In a real app, you'd fetch the specific user by ID or username
    // For FakeStore API, we'll get all users and filter
    return this.http.get<User[]>(`${this.API_URL}/users`)
      .pipe(
        map(users => {
          const user = users.find(u => u.username === username);
          if (!user) {
            throw new Error('User not found');
          }
          
          // Save user to localStorage and update BehaviorSubject
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.isLoadingSubject.next(false);
          
          return user;
        }),
        catchError(error => {
          this.isLoadingSubject.next(false);
          return throwError(() => new Error('Failed to fetch user data'));
        })
      );
  }

  register(userData: Partial<User>): Observable<User> {
    this.isLoadingSubject.next(true);
    
    return this.http.post<User>(`${this.API_URL}/users`, userData)
      .pipe(
        tap(newUser => {
          // In a real app, you might want to auto-login after registration
          // For now, we'll just store the user data
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          this.currentUserSubject.next(newUser);
          this.isLoadingSubject.next(false);
        }),
        catchError(error => {
          this.isLoadingSubject.next(false);
          return throwError(() => new Error('Registration failed'));
        })
      );
  }

  logout(): void {
    // Clear user from localStorage and the BehaviorSubject
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}