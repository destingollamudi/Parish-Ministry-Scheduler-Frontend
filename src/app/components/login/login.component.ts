import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <mat-icon class="login-icon">church</mat-icon>
          <h1>Parish Ministry Scheduler</h1>
          <p class="login-subtitle">Sign in to manage your ministry schedule</p>
        </div>

        <mat-tab-group class="login-tabs">
          <!-- Login Tab -->
          <mat-tab label="Sign In">
            <div class="tab-content">
              <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="login-form">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" formControlName="email" placeholder="your.email@example.com">
                  <mat-icon matPrefix>email</mat-icon>
                  <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                    Email is required
                  </mat-error>
                  <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                    Please enter a valid email
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Password</mat-label>
                  <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password">
                  <mat-icon matPrefix>lock</mat-icon>
                  <button mat-icon-button matSuffix type="button" (click)="togglePasswordVisibility()">
                    <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                  <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                    Password is required
                  </mat-error>
                </mat-form-field>

                <div class="form-actions">
                  <button mat-raised-button color="primary" type="submit" 
                          [disabled]="loginForm.invalid || isLoading()" 
                          class="login-button">
                    <mat-icon *ngIf="isLoading()">hourglass_empty</mat-icon>
                    <mat-icon *ngIf="!isLoading()">login</mat-icon>
                    {{ isLoading() ? 'Signing In...' : 'Sign In' }}
                  </button>
                </div>

                <div class="demo-credentials">
                  <mat-divider></mat-divider>
                  <p class="demo-title">Demo Credentials:</p>
                  <div class="demo-accounts">
                    <div class="demo-account">
                      <strong>Admin:</strong> admin@parish.com / password
                    </div>
                    <div class="demo-account">
                      <strong>Minister:</strong> john.smith@email.com / password
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </mat-tab>

          <!-- Register Tab -->
          <mat-tab label="Sign Up">
            <div class="tab-content">
              <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="register-form">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>First Name</mat-label>
                    <input matInput formControlName="firstName" placeholder="John">
                    <mat-icon matPrefix>person</mat-icon>
                    <mat-error *ngIf="registerForm.get('firstName')?.hasError('required')">
                      First name is required
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Last Name</mat-label>
                    <input matInput formControlName="lastName" placeholder="Smith">
                    <mat-icon matPrefix>person</mat-icon>
                    <mat-error *ngIf="registerForm.get('lastName')?.hasError('required')">
                      Last name is required
                    </mat-error>
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" formControlName="email" placeholder="your.email@example.com">
                  <mat-icon matPrefix>email</mat-icon>
                  <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                    Email is required
                  </mat-error>
                  <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                    Please enter a valid email
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Password</mat-label>
                  <input matInput [type]="hideRegisterPassword() ? 'password' : 'text'" formControlName="password">
                  <mat-icon matPrefix>lock</mat-icon>
                  <button mat-icon-button matSuffix type="button" (click)="toggleRegisterPasswordVisibility()">
                    <mat-icon>{{ hideRegisterPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                  <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                    Password is required
                  </mat-error>
                  <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                    Password must be at least 6 characters
                  </mat-error>
                </mat-form-field>

                <div class="form-actions">
                  <button mat-raised-button color="primary" type="submit" 
                          [disabled]="registerForm.invalid || isLoading()" 
                          class="register-button">
                    <mat-icon *ngIf="isLoading()">hourglass_empty</mat-icon>
                    <mat-icon *ngIf="!isLoading()">person_add</mat-icon>
                    {{ isLoading() ? 'Creating Account...' : 'Create Account' }}
                  </button>
                </div>
              </form>
            </div>
          </mat-tab>
        </mat-tab-group>

        <!-- OAuth Section -->
        <div class="oauth-section">
          <mat-divider></mat-divider>
          <p class="oauth-title">Or sign in with</p>
          <div class="oauth-buttons">
            <button mat-stroked-button (click)="onOAuthLogin('google')" class="oauth-button">
              <mat-icon>login</mat-icon>
              Google
            </button>
            <button mat-stroked-button (click)="onOAuthLogin('microsoft')" class="oauth-button">
              <mat-icon>business</mat-icon>
              Microsoft
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: linear-gradient(135deg, var(--mat-sys-primary) 0%, var(--mat-sys-tertiary) 100%);
    }

    .login-card {
      background: var(--mat-sys-surface);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      width: 100%;
      max-width: 500px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-icon {
      font-size: 3rem;
      color: var(--mat-sys-primary);
      margin-bottom: 1rem;
    }

    .login-header h1 {
      color: var(--mat-sys-on-surface);
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 500;
    }

    .login-subtitle {
      color: var(--mat-sys-on-surface-variant);
      margin: 0;
      font-size: 1rem;
    }

    .login-tabs {
      margin-bottom: 1rem;
    }

    .tab-content {
      padding: 1rem 0;
    }

    .login-form, .register-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-field {
      width: 100%;
    }

    .form-actions {
      margin-top: 1rem;
    }

    .login-button, .register-button {
      width: 100%;
      height: 48px;
      font-size: 1rem;
    }

    .demo-credentials {
      margin-top: 2rem;
    }

    .demo-title {
      font-weight: 500;
      color: var(--mat-sys-on-surface);
      margin: 1rem 0 0.5rem 0;
    }

    .demo-accounts {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .demo-account {
      font-size: 0.9rem;
      color: var(--mat-sys-on-surface-variant);
      padding: 0.5rem;
      background: var(--mat-sys-surface-container-low);
      border-radius: 8px;
    }

    .oauth-section {
      margin-top: 2rem;
    }

    .oauth-title {
      text-align: center;
      color: var(--mat-sys-on-surface-variant);
      margin: 1rem 0;
    }

    .oauth-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .oauth-button {
      flex: 1;
      height: 48px;
    }

    @media (max-width: 768px) {
      .login-card {
        padding: 1.5rem;
        margin: 1rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .oauth-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  
  private _hidePassword = signal(true);
  private _hideRegisterPassword = signal(true);
  private _isLoading = signal(false);

  hidePassword = this._hidePassword.asReadonly();
  hideRegisterPassword = this._hideRegisterPassword.asReadonly();
  isLoading = this._isLoading.asReadonly();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility(): void {
    this._hidePassword.set(!this._hidePassword());
  }

  toggleRegisterPasswordVisibility(): void {
    this._hideRegisterPassword.set(!this._hideRegisterPassword());
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this._isLoading.set(true);
      const credentials: LoginCredentials = this.loginForm.value;
      
      this.authService.login(credentials).subscribe({
        next: (user) => {
          this._isLoading.set(false);
          this.snackBar.open(`Welcome back, ${user.firstName}!`, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this._isLoading.set(false);
          this.snackBar.open(error.message, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this._isLoading.set(true);
      const userData = this.registerForm.value;
      
      this.authService.register(userData).subscribe({
        next: (user) => {
          this._isLoading.set(false);
          this.snackBar.open(`Welcome, ${user.firstName}! Your account has been created.`, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this._isLoading.set(false);
          this.snackBar.open(error.message, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  onOAuthLogin(provider: 'google' | 'microsoft'): void {
    this._isLoading.set(true);
    
    this.authService.oauthLogin(provider).subscribe({
      next: (user) => {
        this._isLoading.set(false);
        this.snackBar.open(`Welcome, ${user.firstName}!`, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this._isLoading.set(false);
        this.snackBar.open(error.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }
}
