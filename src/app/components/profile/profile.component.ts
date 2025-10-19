import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="container">
      <div class="profile-header">
        <h1>My Profile</h1>
        <p class="subtitle">Manage your personal information and availability</p>
      </div>

      <mat-tab-group class="profile-tabs">
        <mat-tab label="Personal Info">
          <div class="tab-content">
            <mat-card class="profile-card">
              <mat-card-header>
                <mat-card-title>Personal Information</mat-card-title>
                <mat-card-subtitle>Update your contact details</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <form class="profile-form">
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="form-field">
                      <mat-label>First Name</mat-label>
                      <input matInput value="John">
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="form-field">
                      <mat-label>Last Name</mat-label>
                      <input matInput value="Smith">
                    </mat-form-field>
                  </div>
                  
                  <mat-form-field appearance="outline" class="form-field full-width">
                    <mat-label>Email</mat-label>
                    <input matInput type="email" value="john.smith@email.com">
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="form-field full-width">
                    <mat-label>Phone</mat-label>
                    <input matInput type="tel" value="(555) 123-4567">
                  </mat-form-field>
                  
                  <div class="form-actions">
                    <button mat-raised-button color="primary">Save Changes</button>
                    <button mat-stroked-button>Cancel</button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="My Ministries">
          <div class="tab-content">
            <mat-card class="ministries-card">
              <mat-card-header>
                <mat-card-title>My Ministry Assignments</mat-card-title>
                <mat-card-subtitle>Ministries you are qualified to serve in</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="ministries-list">
                  <div class="ministry-item" *ngFor="let ministry of myMinistries">
                    <div class="ministry-info">
                      <mat-icon class="ministry-icon">{{ ministry.icon }}</mat-icon>
                      <div class="ministry-details">
                        <h3>{{ ministry.name }}</h3>
                        <p>{{ ministry.description }}</p>
                      </div>
                    </div>
                    <mat-chip class="ministry-status">
                      {{ ministry.status }}
                    </mat-chip>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Availability">
          <div class="tab-content">
            <mat-card class="availability-card">
              <mat-card-header>
                <mat-card-title>My Availability</mat-card-title>
                <mat-card-subtitle>Mark dates when you cannot serve</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="availability-section">
                  <h3>Add Unavailable Dates</h3>
                  <div class="date-picker-section">
                    <mat-form-field appearance="outline" class="date-field">
                      <mat-label>Select Date</mat-label>
                      <input matInput [matDatepicker]="picker">
                      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                      <mat-datepicker #picker></mat-datepicker>
                    </mat-form-field>
                    <button mat-raised-button color="primary" class="add-date-btn">
                      <mat-icon>add</mat-icon>
                      Add Date
                    </button>
                  </div>
                </div>

                <div class="unavailable-dates">
                  <h3>Unavailable Dates</h3>
                  <div class="dates-list">
                    <div class="date-item" *ngFor="let date of unavailableDates">
                      <div class="date-info">
                        <mat-icon>event_busy</mat-icon>
                        <span>{{ date.date }}</span>
                        <span class="date-reason">{{ date.reason }}</span>
                      </div>
                      <button mat-icon-button color="warn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="My Schedule">
          <div class="tab-content">
            <mat-card class="schedule-card">
              <mat-card-header>
                <mat-card-title>My Upcoming Assignments</mat-card-title>
                <mat-card-subtitle>Your scheduled ministry assignments</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="assignments-list">
                  <div class="assignment-item" *ngFor="let assignment of myAssignments">
                    <div class="assignment-info">
                      <div class="assignment-date">
                        <mat-icon>event</mat-icon>
                        {{ assignment.date }}
                      </div>
                      <div class="assignment-details">
                        <h3>{{ assignment.service }}</h3>
                        <p>{{ assignment.ministry }} at {{ assignment.time }}</p>
                      </div>
                    </div>
                    <div class="assignment-actions">
                      <button mat-stroked-button *ngIf="assignment.canSwap">
                        <mat-icon>swap_horiz</mat-icon>
                        Request Swap
                      </button>
                      <button mat-stroked-button>
                        <mat-icon>visibility</mat-icon>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .profile-header {
      text-align: center;
      margin-bottom: 2rem;
      padding: 1rem 0;
    }

    .profile-header h1 {
      color: var(--mat-sys-primary);
      margin-bottom: 0.5rem;
      font-size: 2rem;
      font-weight: 500;
    }

    .subtitle {
      color: var(--mat-sys-on-surface-variant);
      font-size: 1.1rem;
    }

    .profile-tabs {
      margin-top: 1rem;
    }

    .tab-content {
      padding: 1rem 0;
    }

    .profile-card, .ministries-card, .availability-card, .schedule-card {
      margin-bottom: 1rem;
    }

    .profile-form {
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

    .full-width {
      grid-column: span 2;
    }

    .form-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .ministries-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .ministry-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: var(--mat-sys-surface-container-low);
      border-radius: 8px;
    }

    .ministry-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .ministry-icon {
      font-size: 2rem;
      color: var(--mat-sys-primary);
    }

    .ministry-details h3 {
      margin: 0;
      color: var(--mat-sys-on-surface);
    }

    .ministry-details p {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.9rem;
    }

    .ministry-status {
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }

    .availability-section {
      margin-bottom: 2rem;
    }

    .availability-section h3 {
      margin-bottom: 1rem;
      color: var(--mat-sys-on-surface);
    }

    .date-picker-section {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
    }

    .date-field {
      flex: 1;
    }

    .add-date-btn {
      white-space: nowrap;
    }

    .unavailable-dates h3 {
      margin-bottom: 1rem;
      color: var(--mat-sys-on-surface);
    }

    .dates-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .date-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: var(--mat-sys-surface-container-low);
      border-radius: 8px;
    }

    .date-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .date-info mat-icon {
      color: var(--mat-sys-error);
    }

    .date-reason {
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.9rem;
    }

    .assignments-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .assignment-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: var(--mat-sys-surface-container-low);
      border-radius: 8px;
    }

    .assignment-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .assignment-date {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--mat-sys-primary);
      font-weight: 500;
    }

    .assignment-details h3 {
      margin: 0;
      color: var(--mat-sys-on-surface);
    }

    .assignment-details p {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.9rem;
    }

    .assignment-actions {
      display: flex;
      gap: 0.5rem;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .full-width {
        grid-column: span 1;
      }

      .date-picker-section {
        flex-direction: column;
        align-items: stretch;
      }

      .assignment-item, .ministry-item {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .assignment-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ProfileComponent {
  myMinistries = [
    {
      name: 'Altar Server',
      icon: 'church',
      description: 'Assist during Mass with altar duties',
      status: 'Active'
    },
    {
      name: 'EMHC',
      icon: 'local_drink',
      description: 'Extraordinary Minister of Holy Communion',
      status: 'Active'
    }
  ];

  unavailableDates = [
    {
      date: 'October 25, 2024',
      reason: 'Out of town'
    },
    {
      date: 'November 1, 2024',
      reason: 'Family event'
    },
    {
      date: 'November 15, 2024',
      reason: 'Medical appointment'
    }
  ];

  myAssignments = [
    {
      date: 'Sunday, Oct 27',
      service: 'Sunday Mass',
      ministry: 'Altar Server',
      time: '9:00 AM',
      canSwap: true
    },
    {
      date: 'Saturday, Nov 2',
      service: 'Vigil Mass',
      ministry: 'EMHC',
      time: '5:00 PM',
      canSwap: true
    },
    {
      date: 'Sunday, Nov 10',
      service: 'Sunday Mass',
      ministry: 'Altar Server',
      time: '11:00 AM',
      canSwap: false
    }
  ];
}
