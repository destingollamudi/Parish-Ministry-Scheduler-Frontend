import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="container">
      <div class="dashboard-header">
        <h1>Parish Ministry Scheduler</h1>
        <p class="subtitle">Welcome to your ministry scheduling dashboard</p>
      </div>

      <div class="dashboard-grid">
        <!-- Quick Stats Cards -->
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">people</mat-icon>
              <div class="stat-info">
                <h3>24</h3>
                <p>Active Ministers</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">schedule</mat-icon>
              <div class="stat-info">
                <h3>12</h3>
                <p>This Week's Services</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">swap_horiz</mat-icon>
              <div class="stat-info">
                <h3>3</h3>
                <p>Pending Swaps</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">check_circle</mat-icon>
              <div class="stat-info">
                <h3>95%</h3>
                <p>Schedule Complete</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Quick Actions -->
        <mat-card class="action-card">
          <mat-card-header>
            <mat-card-title>Quick Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="action-buttons">
              <button mat-raised-button color="primary" class="action-btn">
                <mat-icon>add</mat-icon>
                Generate Schedule
              </button>
              <button mat-stroked-button class="action-btn">
                <mat-icon>people</mat-icon>
                Manage Ministers
              </button>
              <button mat-stroked-button class="action-btn">
                <mat-icon>schedule</mat-icon>
                View Schedule
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Recent Activity -->
        <mat-card class="activity-card">
          <mat-card-header>
            <mat-card-title>Recent Activity</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-list">
              <div class="activity-item">
                <mat-icon class="activity-icon">person_add</mat-icon>
                <div class="activity-content">
                  <p><strong>John Smith</strong> joined as Altar Server</p>
                  <span class="activity-time">2 hours ago</span>
                </div>
              </div>
              <div class="activity-item">
                <mat-icon class="activity-icon">swap_horiz</mat-icon>
                <div class="activity-content">
                  <p><strong>Mary Johnson</strong> requested a swap for Sunday 9 AM</p>
                  <span class="activity-time">4 hours ago</span>
                </div>
              </div>
              <div class="activity-item">
                <mat-icon class="activity-icon">schedule</mat-icon>
                <div class="activity-content">
                  <p>November schedule published</p>
                  <span class="activity-time">1 day ago</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Ministry Status -->
        <mat-card class="ministry-card">
          <mat-card-header>
            <mat-card-title>Ministry Status</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="ministry-chips">
              <mat-chip-set>
                <mat-chip class="ministry-chip">
                  <mat-icon>church</mat-icon>
                  Altar Server
                </mat-chip>
                <mat-chip class="ministry-chip">
                  <mat-icon>music_note</mat-icon>
                  Music
                </mat-chip>
                <mat-chip class="ministry-chip">
                  <mat-icon>door_front</mat-icon>
                  Usher
                </mat-chip>
                <mat-chip class="ministry-chip">
                  <mat-icon>local_drink</mat-icon>
                  EMHC
                </mat-chip>
              </mat-chip-set>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-header {
      text-align: center;
      margin-bottom: 2rem;
      padding: 1rem 0;
    }

    .dashboard-header h1 {
      color: var(--mat-sys-primary);
      margin-bottom: 0.5rem;
      font-size: 2rem;
      font-weight: 500;
    }

    .subtitle {
      color: var(--mat-sys-on-surface-variant);
      font-size: 1.1rem;
    }

    .dashboard-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    .stat-card {
      background: var(--mat-sys-surface-container);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      font-size: 2.5rem;
      color: var(--mat-sys-primary);
    }

    .stat-info h3 {
      font-size: 2rem;
      font-weight: 600;
      margin: 0;
      color: var(--mat-sys-on-surface);
    }

    .stat-info p {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.9rem;
    }

    .action-card, .activity-card, .ministry-card {
      grid-column: span 2;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .action-btn {
      justify-content: flex-start;
      padding: 0.75rem 1rem;
      height: auto;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .activity-icon {
      color: var(--mat-sys-primary);
      margin-top: 0.25rem;
    }

    .activity-content p {
      margin: 0;
      color: var(--mat-sys-on-surface);
    }

    .activity-time {
      font-size: 0.8rem;
      color: var(--mat-sys-on-surface-variant);
    }

    .ministry-chips {
      margin-top: 1rem;
    }

    .ministry-chip {
      margin: 0.25rem;
    }

    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
      
      .action-card, .activity-card, .ministry-card {
        grid-column: span 1;
      }
      
      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class DashboardComponent {}
