import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule
  ],
  template: `
    <div class="container">
      <div class="schedule-header">
        <h1>Schedule Management</h1>
        <p class="subtitle">View and manage ministry schedules</p>
      </div>

      <mat-tab-group class="schedule-tabs">
        <mat-tab label="Current Week">
          <div class="tab-content">
            <div class="week-overview">
              <h2>This Week's Schedule</h2>
              <div class="week-grid">
                <div class="day-card" *ngFor="let day of weekDays">
                  <mat-card>
                    <mat-card-header>
                      <mat-card-title>{{ day.name }}</mat-card-title>
                      <mat-card-subtitle>{{ day.date }}</mat-card-subtitle>
                    </mat-card-header>
                    <mat-card-content>
                      <div class="services" *ngFor="let service of day.services">
                        <div class="service-item">
                          <div class="service-time">{{ service.time }}</div>
                          <div class="service-details">
                            <div class="service-name">{{ service.name }}</div>
                            <div class="ministries">
                              <mat-chip-set>
                                <mat-chip *ngFor="let ministry of service.ministries" class="ministry-chip">
                                  {{ ministry.name }}
                                </mat-chip>
                              </mat-chip-set>
                            </div>
                          </div>
                        </div>
                      </div>
                    </mat-card-content>
                  </mat-card>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Calendar View">
          <div class="tab-content">
            <div class="calendar-placeholder">
              <mat-icon class="calendar-icon">calendar_month</mat-icon>
              <h3>Calendar View</h3>
              <p>Interactive calendar will be implemented here</p>
              <button mat-raised-button color="primary">
                <mat-icon>add</mat-icon>
                Generate New Schedule
              </button>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Sub Requests">
          <div class="tab-content">
            <div class="sub-requests">
              <h2>Pending Sub Requests</h2>
              <div class="request-list">
                <mat-card *ngFor="let request of subRequests" class="request-card">
                  <mat-card-content>
                    <div class="request-header">
                      <div class="request-info">
                        <h3>{{ request.ministry }}</h3>
                        <p>{{ request.date }} at {{ request.time }}</p>
                      </div>
                      <mat-chip [class]="'status-' + request.status">
                        {{ request.status }}
                      </mat-chip>
                    </div>
                    <div class="request-details">
                      <p><strong>Requested by:</strong> {{ request.requestedBy }}</p>
                      <p><strong>Reason:</strong> {{ request.reason }}</p>
                    </div>
                    <div class="request-actions">
                      <button mat-stroked-button>
                        <mat-icon>visibility</mat-icon>
                        View Details
                      </button>
                      <button mat-raised-button color="primary">
                        <mat-icon>check</mat-icon>
                        Accept
                      </button>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .schedule-header {
      text-align: center;
      margin-bottom: 2rem;
      padding: 1rem 0;
    }

    .schedule-header h1 {
      color: var(--mat-sys-primary);
      margin-bottom: 0.5rem;
      font-size: 2rem;
      font-weight: 500;
    }

    .subtitle {
      color: var(--mat-sys-on-surface-variant);
      font-size: 1.1rem;
    }

    .schedule-tabs {
      margin-top: 1rem;
    }

    .tab-content {
      padding: 1rem 0;
    }

    .week-overview h2 {
      margin-bottom: 1rem;
      color: var(--mat-sys-on-surface);
    }

    .week-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    .day-card {
      margin-bottom: 1rem;
    }

    .service-item {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.75rem;
      padding: 0.75rem;
      background: var(--mat-sys-surface-container-low);
      border-radius: 8px;
    }

    .service-time {
      font-weight: 600;
      color: var(--mat-sys-primary);
      min-width: 60px;
    }

    .service-details {
      flex: 1;
    }

    .service-name {
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .ministries {
      margin-top: 0.5rem;
    }

    .ministry-chip {
      margin: 0.125rem;
    }

    .calendar-placeholder {
      text-align: center;
      padding: 3rem 1rem;
    }

    .calendar-icon {
      font-size: 4rem;
      color: var(--mat-sys-primary);
      margin-bottom: 1rem;
    }

    .sub-requests h2 {
      margin-bottom: 1rem;
      color: var(--mat-sys-on-surface);
    }

    .request-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .request-card {
      margin-bottom: 1rem;
    }

    .request-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .request-info h3 {
      margin: 0;
      color: var(--mat-sys-on-surface);
    }

    .request-info p {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
    }

    .status-pending {
      background: var(--mat-sys-tertiary-container);
      color: var(--mat-sys-on-tertiary-container);
    }

    .status-accepted {
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }

    .request-details {
      margin-bottom: 1rem;
    }

    .request-details p {
      margin: 0.25rem 0;
      color: var(--mat-sys-on-surface-variant);
    }

    .request-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .week-grid {
        grid-template-columns: 1fr;
      }
      
      .request-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ScheduleComponent {
  weekDays = [
    {
      name: 'Sunday',
      date: 'Oct 20',
      services: [
        {
          time: '9:00 AM',
          name: 'Sunday Mass',
          ministries: [
            { name: 'Altar Server' },
            { name: 'Music' },
            { name: 'Usher' },
            { name: 'EMHC' }
          ]
        },
        {
          time: '11:00 AM',
          name: 'Sunday Mass',
          ministries: [
            { name: 'Altar Server' },
            { name: 'Music' },
            { name: 'Usher' },
            { name: 'EMHC' }
          ]
        }
      ]
    },
    {
      name: 'Monday',
      date: 'Oct 21',
      services: []
    },
    {
      name: 'Tuesday',
      date: 'Oct 22',
      services: []
    },
    {
      name: 'Wednesday',
      date: 'Oct 23',
      services: [
        {
          time: '7:00 PM',
          name: 'Evening Mass',
          ministries: [
            { name: 'Altar Server' },
            { name: 'Music' },
            { name: 'Usher' }
          ]
        }
      ]
    },
    {
      name: 'Thursday',
      date: 'Oct 24',
      services: []
    },
    {
      name: 'Friday',
      date: 'Oct 25',
      services: []
    },
    {
      name: 'Saturday',
      date: 'Oct 26',
      services: [
        {
          time: '5:00 PM',
          name: 'Vigil Mass',
          ministries: [
            { name: 'Altar Server' },
            { name: 'Music' },
            { name: 'Usher' },
            { name: 'EMHC' }
          ]
        }
      ]
    }
  ];

  subRequests = [
    {
      ministry: 'Altar Server',
      date: 'Sunday, Oct 27',
      time: '9:00 AM',
      requestedBy: 'John Smith',
      reason: 'Family emergency',
      status: 'pending'
    },
    {
      ministry: 'Music',
      date: 'Wednesday, Oct 30',
      time: '7:00 PM',
      requestedBy: 'Sarah Johnson',
      reason: 'Out of town',
      status: 'pending'
    },
    {
      ministry: 'EMHC',
      date: 'Saturday, Nov 2',
      time: '5:00 PM',
      requestedBy: 'Mike Davis',
      reason: 'Sick',
      status: 'accepted'
    }
  ];
}
