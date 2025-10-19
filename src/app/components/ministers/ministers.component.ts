import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-ministers',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule
  ],
  template: `
    <div class="container">
      <div class="ministers-header">
        <h1>Ministry Management</h1>
        <p class="subtitle">Manage ministers and their ministry assignments</p>
      </div>

      <mat-tab-group class="ministers-tabs">
        <mat-tab label="All Ministers">
          <div class="tab-content">
            <div class="ministers-controls">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>Search ministers</mat-label>
                <input matInput placeholder="Name, email, or ministry">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
              <button mat-raised-button color="primary" class="add-button">
                <mat-icon>person_add</mat-icon>
                Add Minister
              </button>
            </div>

            <div class="ministers-table">
              <table mat-table [dataSource]="ministers" class="ministers-table-content">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let minister">
                    <div class="minister-info">
                      <div class="minister-name">{{ minister.name }}</div>
                      <div class="minister-email">{{ minister.email }}</div>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="ministries">
                  <th mat-header-cell *matHeaderCellDef>Ministries</th>
                  <td mat-cell *matCellDef="let minister">
                    <mat-chip-set>
                      <mat-chip *ngFor="let ministry of minister.ministries" class="ministry-chip">
                        {{ ministry }}
                      </mat-chip>
                    </mat-chip-set>
                  </td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let minister">
                    <mat-chip [class]="'status-' + minister.status">
                      {{ minister.status }}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let minister">
                    <button mat-icon-button>
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button>
                      <mat-icon>visibility</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Ministry Groups">
          <div class="tab-content">
            <div class="ministry-groups">
              <h2>Ministry Assignments</h2>
              <div class="ministry-cards">
                <mat-card *ngFor="let ministry of ministries" class="ministry-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>{{ ministry.icon }}</mat-icon>
                      {{ ministry.name }}
                    </mat-card-title>
                    <mat-card-subtitle>{{ ministry.count }} ministers</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="ministry-members">
                      <div class="member-item" *ngFor="let member of ministry.members">
                        <div class="member-info">
                          <div class="member-name">{{ member.name }}</div>
                          <div class="member-email">{{ member.email }}</div>
                        </div>
                        <button mat-icon-button>
                          <mat-icon>more_vert</mat-icon>
                        </button>
                      </div>
                    </div>
                    <div class="ministry-actions">
                      <button mat-stroked-button>
                        <mat-icon>add</mat-icon>
                        Add Member
                      </button>
                      <button mat-stroked-button>
                        <mat-icon>edit</mat-icon>
                        Edit Ministry
                      </button>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Family Groups">
          <div class="tab-content">
            <div class="family-groups">
              <h2>Family Groupings</h2>
              <p class="description">Group ministers together to ensure they are scheduled for the same services</p>
              
              <div class="family-cards">
                <mat-card *ngFor="let family of families" class="family-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>family_restroom</mat-icon>
                      {{ family.name }}
                    </mat-card-title>
                    <mat-card-subtitle>{{ family.members.length }} members</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="family-members">
                      <mat-chip-set>
                        <mat-chip *ngFor="let member of family.members" class="family-member-chip">
                          {{ member.name }}
                        </mat-chip>
                      </mat-chip-set>
                    </div>
                    <div class="family-actions">
                      <button mat-stroked-button>
                        <mat-icon>edit</mat-icon>
                        Edit Group
                      </button>
                      <button mat-stroked-button color="warn">
                        <mat-icon>delete</mat-icon>
                        Remove Group
                      </button>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>

              <button mat-raised-button color="primary" class="add-family-btn">
                <mat-icon>group_add</mat-icon>
                Create Family Group
              </button>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .ministers-header {
      text-align: center;
      margin-bottom: 2rem;
      padding: 1rem 0;
    }

    .ministers-header h1 {
      color: var(--mat-sys-primary);
      margin-bottom: 0.5rem;
      font-size: 2rem;
      font-weight: 500;
    }

    .subtitle {
      color: var(--mat-sys-on-surface-variant);
      font-size: 1.1rem;
    }

    .ministers-tabs {
      margin-top: 1rem;
    }

    .tab-content {
      padding: 1rem 0;
    }

    .ministers-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .search-field {
      flex: 1;
      max-width: 400px;
    }

    .add-button {
      white-space: nowrap;
    }

    .ministers-table {
      background: var(--mat-sys-surface);
      border-radius: 8px;
      overflow: hidden;
    }

    .ministers-table-content {
      width: 100%;
    }

    .minister-info {
      display: flex;
      flex-direction: column;
    }

    .minister-name {
      font-weight: 500;
      color: var(--mat-sys-on-surface);
    }

    .minister-email {
      font-size: 0.9rem;
      color: var(--mat-sys-on-surface-variant);
    }

    .ministry-chip {
      margin: 0.125rem;
    }

    .status-active {
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }

    .status-inactive {
      background: var(--mat-sys-surface-variant);
      color: var(--mat-sys-on-surface-variant);
    }

    .ministry-groups h2 {
      margin-bottom: 1rem;
      color: var(--mat-sys-on-surface);
    }

    .ministry-cards {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    .ministry-card {
      margin-bottom: 1rem;
    }

    .ministry-members {
      margin-bottom: 1rem;
    }

    .member-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }

    .member-item:last-child {
      border-bottom: none;
    }

    .member-name {
      font-weight: 500;
      color: var(--mat-sys-on-surface);
    }

    .member-email {
      font-size: 0.9rem;
      color: var(--mat-sys-on-surface-variant);
    }

    .ministry-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .family-groups h2 {
      margin-bottom: 0.5rem;
      color: var(--mat-sys-on-surface);
    }

    .description {
      color: var(--mat-sys-on-surface-variant);
      margin-bottom: 1.5rem;
    }

    .family-cards {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      margin-bottom: 2rem;
    }

    .family-card {
      margin-bottom: 1rem;
    }

    .family-members {
      margin-bottom: 1rem;
    }

    .family-member-chip {
      margin: 0.125rem;
    }

    .family-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .add-family-btn {
      width: 100%;
      max-width: 300px;
    }

    @media (max-width: 768px) {
      .ministers-controls {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field {
        max-width: none;
      }

      .ministry-cards, .family-cards {
        grid-template-columns: 1fr;
      }

      .ministry-actions, .family-actions {
        flex-direction: column;
      }
    }
  `]
})
export class MinistersComponent {
  displayedColumns: string[] = ['name', 'ministries', 'status', 'actions'];

  ministers = [
    {
      name: 'John Smith',
      email: 'john.smith@email.com',
      ministries: ['Altar Server', 'EMHC'],
      status: 'active'
    },
    {
      name: 'Mary Johnson',
      email: 'mary.johnson@email.com',
      ministries: ['Music', 'Usher'],
      status: 'active'
    },
    {
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      ministries: ['Altar Server', 'Usher'],
      status: 'active'
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      ministries: ['Music', 'EMHC'],
      status: 'active'
    },
    {
      name: 'Robert Brown',
      email: 'robert.brown@email.com',
      ministries: ['Usher'],
      status: 'inactive'
    }
  ];

  ministries = [
    {
      name: 'Altar Server',
      icon: 'church',
      count: 8,
      members: [
        { name: 'John Smith', email: 'john.smith@email.com' },
        { name: 'Mike Davis', email: 'mike.davis@email.com' },
        { name: 'David Lee', email: 'david.lee@email.com' }
      ]
    },
    {
      name: 'Music',
      icon: 'music_note',
      count: 6,
      members: [
        { name: 'Mary Johnson', email: 'mary.johnson@email.com' },
        { name: 'Sarah Wilson', email: 'sarah.wilson@email.com' },
        { name: 'Lisa Garcia', email: 'lisa.garcia@email.com' }
      ]
    },
    {
      name: 'Usher',
      icon: 'door_front',
      count: 10,
      members: [
        { name: 'Mary Johnson', email: 'mary.johnson@email.com' },
        { name: 'Mike Davis', email: 'mike.davis@email.com' },
        { name: 'Robert Brown', email: 'robert.brown@email.com' }
      ]
    },
    {
      name: 'EMHC',
      icon: 'local_drink',
      count: 7,
      members: [
        { name: 'John Smith', email: 'john.smith@email.com' },
        { name: 'Sarah Wilson', email: 'sarah.wilson@email.com' },
        { name: 'Tom Anderson', email: 'tom.anderson@email.com' }
      ]
    }
  ];

  families = [
    {
      name: 'Smith Family',
      members: [
        { name: 'John Smith' },
        { name: 'Jane Smith' },
        { name: 'Junior Smith' }
      ]
    },
    {
      name: 'Johnson Family',
      members: [
        { name: 'Mary Johnson' },
        { name: 'Bob Johnson' }
      ]
    }
  ];
}
