import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('parish-ministry-scheduler');
  
  private authService = inject(AuthService);
  private router = inject(Router);
  
  // Expose auth state to template
  isAuthenticated = this.authService.isAuthenticated;
  
  // Make logout method public for template access
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
