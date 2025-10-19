import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'minister';
  ministries?: string[];
  isActive: boolean;
  lastLogin?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'parish_scheduler_token';
  private readonly USER_KEY = 'parish_scheduler_user';

  // Signals for reactive state management
  private _user = signal<User | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Computed signals
  public readonly user = this._user.asReadonly();
  public readonly isAuthenticated = computed(() => this._user() !== null);
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly isAdmin = computed(() => this._user()?.role === 'admin');
  public readonly isMinister = computed(() => this._user()?.role === 'minister');

  // BehaviorSubject for legacy compatibility
  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  public readonly authState$ = this.authStateSubject.asObservable();

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_KEY);

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this._user.set(user);
        this.updateAuthState();
      } catch (error) {
        this.clearAuth();
      }
    }
  }

  private updateAuthState(): void {
    this.authStateSubject.next({
      user: this._user(),
      isAuthenticated: this.isAuthenticated(),
      isLoading: this._isLoading(),
      error: this._error()
    });
  }

  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._user.set(null);
    this._error.set(null);
    this.updateAuthState();
  }

  /**
   * Login with email and password
   */
  login(credentials: LoginCredentials): Observable<User> {
    this._isLoading.set(true);
    this._error.set(null);
    this.updateAuthState();

    // Simulate API call with mock data
    return this.mockLogin(credentials).pipe(
      tap(user => {
        const token = this.generateMockToken(user);
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        
        this._user.set(user);
        this._isLoading.set(false);
        this.updateAuthState();
      }),
      catchError(error => {
        this._error.set(error.message);
        this._isLoading.set(false);
        this.updateAuthState();
        return throwError(() => error);
      })
    );
  }

  /**
   * OAuth login (Google, Microsoft, etc.)
   */
  oauthLogin(provider: 'google' | 'microsoft' | 'facebook'): Observable<User> {
    this._isLoading.set(true);
    this._error.set(null);
    this.updateAuthState();

    // Simulate OAuth flow
    return this.mockOAuthLogin(provider).pipe(
      tap(user => {
        const token = this.generateMockToken(user);
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        
        this._user.set(user);
        this._isLoading.set(false);
        this.updateAuthState();
      }),
      catchError(error => {
        this._error.set(error.message);
        this._isLoading.set(false);
        this.updateAuthState();
        return throwError(() => error);
      })
    );
  }

  /**
   * Register new minister
   */
  register(userData: Partial<User> & { password: string }): Observable<User> {
    this._isLoading.set(true);
    this._error.set(null);
    this.updateAuthState();

    return this.mockRegister(userData).pipe(
      tap(user => {
        const token = this.generateMockToken(user);
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        
        this._user.set(user);
        this._isLoading.set(false);
        this.updateAuthState();
      }),
      catchError(error => {
        this._error.set(error.message);
        this._isLoading.set(false);
        this.updateAuthState();
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearAuth();
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<string> {
    const currentToken = localStorage.getItem(this.TOKEN_KEY);
    if (!currentToken) {
      return throwError(() => new Error('No token to refresh'));
    }

    // Simulate token refresh
    return of(this.generateMockToken(this._user()!));
  }

  /**
   * Check if user has specific ministry
   */
  hasMinistry(ministry: string): boolean {
    const user = this._user();
    return user?.ministries?.includes(ministry) ?? false;
  }

  /**
   * Check if user has any of the specified ministries
   */
  hasAnyMinistry(ministries: string[]): boolean {
    const user = this._user();
    return ministries.some(ministry => user?.ministries?.includes(ministry)) ?? false;
  }

  // Mock implementations for development
  private mockLogin(credentials: LoginCredentials): Observable<User> {
    return new Observable(observer => {
      setTimeout(() => {
        // Mock users for testing
        const mockUsers: User[] = [
          {
            id: '1',
            email: 'admin@parish.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            isActive: true,
            lastLogin: new Date()
          },
          {
            id: '2',
            email: 'john.smith@email.com',
            firstName: 'John',
            lastName: 'Smith',
            role: 'minister',
            ministries: ['Altar Server', 'EMHC'],
            isActive: true,
            lastLogin: new Date()
          },
          {
            id: '3',
            email: 'mary.johnson@email.com',
            firstName: 'Mary',
            lastName: 'Johnson',
            role: 'minister',
            ministries: ['Music', 'Usher'],
            isActive: true,
            lastLogin: new Date()
          }
        ];

        const user = mockUsers.find(u => u.email === credentials.email);
        
        if (user && credentials.password === 'password') {
          observer.next(user);
          observer.complete();
        } else {
          observer.error(new Error('Invalid email or password'));
        }
      }, 1000); // Simulate network delay
    });
  }

  private mockOAuthLogin(provider: string): Observable<User> {
    return new Observable(observer => {
      setTimeout(() => {
        const user: User = {
          id: 'oauth-user',
          email: `user@${provider}.com`,
          firstName: 'OAuth',
          lastName: 'User',
          role: 'minister',
          ministries: ['Altar Server'],
          isActive: true,
          lastLogin: new Date()
        };
        observer.next(user);
        observer.complete();
      }, 1500);
    });
  }

  private mockRegister(userData: any): Observable<User> {
    return new Observable(observer => {
      setTimeout(() => {
        const user: User = {
          id: Date.now().toString(),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: 'minister',
          ministries: userData.ministries || [],
          isActive: true,
          lastLogin: new Date()
        };
        observer.next(user);
        observer.complete();
      }, 1000);
    });
  }

  private generateMockToken(user: User): string {
    // In a real app, this would be a JWT token from the server
    return btoa(JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }));
  }
}
