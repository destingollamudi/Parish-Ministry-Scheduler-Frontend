import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';

export interface Minister {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  ministries: string[];
  familyGroup?: string;
  isActive: boolean;
  joinDate: Date;
  lastLogin?: Date;
  availability?: {
    unavailableDates: Date[];
    preferredDays: string[];
    maxAssignmentsPerMonth?: number;
  };
}

export interface Ministry {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  requirements?: string[];
}

export interface FamilyGroup {
  id: string;
  name: string;
  members: string[]; // Minister IDs
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MinistersService {
  private _ministers = signal<Minister[]>([]);
  private _ministries = signal<Ministry[]>([]);
  private _familyGroups = signal<FamilyGroup[]>([]);
  private _isLoading = signal<boolean>(false);

  // Readonly signals
  public readonly ministers = this._ministers.asReadonly();
  public readonly ministries = this._ministries.asReadonly();
  public readonly familyGroups = this._familyGroups.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Initialize ministries
    const mockMinistries: Ministry[] = [
      {
        id: '1',
        name: 'Altar Server',
        description: 'Assist during Mass with altar duties',
        icon: 'church',
        color: '#1e88e5',
        isActive: true,
        requirements: ['Must be at least 10 years old', 'Training required']
      },
      {
        id: '2',
        name: 'Music',
        description: 'Lead music during Mass',
        icon: 'music_note',
        color: '#43a047',
        isActive: true,
        requirements: ['Musical ability', 'Practice commitment']
      },
      {
        id: '3',
        name: 'Usher',
        description: 'Welcome parishioners and assist with seating',
        icon: 'door_front',
        color: '#fb8c00',
        isActive: true,
        requirements: ['Friendly demeanor', 'Physical ability to stand']
      },
      {
        id: '4',
        name: 'EMHC',
        description: 'Extraordinary Minister of Holy Communion',
        icon: 'local_drink',
        color: '#8e24aa',
        isActive: true,
        requirements: ['Catholic in good standing', 'Special training required']
      }
    ];

    // Initialize family groups
    const mockFamilyGroups: FamilyGroup[] = [
      {
        id: '1',
        name: 'Smith Family',
        members: ['1', '2'], // John and Jane Smith
        description: 'Family group for scheduling together'
      },
      {
        id: '2',
        name: 'Johnson Family',
        members: ['3', '4'], // Mary and Bob Johnson
        description: 'Family group for scheduling together'
      }
    ];

    // Initialize ministers
    const mockMinisters: Minister[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        ministries: ['Altar Server', 'EMHC'],
        familyGroup: 'Smith Family',
        isActive: true,
        joinDate: new Date('2023-01-15'),
        lastLogin: new Date(),
        availability: {
          unavailableDates: [
            new Date('2024-12-25'),
            new Date('2024-12-31')
          ],
          preferredDays: ['Sunday', 'Saturday'],
          maxAssignmentsPerMonth: 4
        }
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        phone: '(555) 123-4568',
        ministries: ['Music', 'Usher'],
        familyGroup: 'Smith Family',
        isActive: true,
        joinDate: new Date('2023-01-15'),
        lastLogin: new Date(),
        availability: {
          unavailableDates: [
            new Date('2024-12-25'),
            new Date('2024-12-31')
          ],
          preferredDays: ['Sunday'],
          maxAssignmentsPerMonth: 3
        }
      },
      {
        id: '3',
        firstName: 'Mary',
        lastName: 'Johnson',
        email: 'mary.johnson@email.com',
        phone: '(555) 234-5678',
        ministries: ['Music', 'Usher'],
        isActive: true,
        joinDate: new Date('2023-03-10'),
        lastLogin: new Date(),
        availability: {
          unavailableDates: [
            new Date('2024-11-15'),
            new Date('2024-11-16')
          ],
          preferredDays: ['Sunday', 'Wednesday'],
          maxAssignmentsPerMonth: 5
        }
      },
      {
        id: '4',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@email.com',
        phone: '(555) 234-5679',
        ministries: ['Altar Server', 'EMHC'],
        familyGroup: 'Johnson Family',
        isActive: true,
        joinDate: new Date('2023-03-10'),
        lastLogin: new Date(),
        availability: {
          unavailableDates: [],
          preferredDays: ['Sunday', 'Saturday'],
          maxAssignmentsPerMonth: 6
        }
      },
      {
        id: '5',
        firstName: 'Mike',
        lastName: 'Davis',
        email: 'mike.davis@email.com',
        phone: '(555) 345-6789',
        ministries: ['Altar Server', 'Usher'],
        isActive: true,
        joinDate: new Date('2023-05-20'),
        lastLogin: new Date(),
        availability: {
          unavailableDates: [
            new Date('2024-10-25'),
            new Date('2024-10-26')
          ],
          preferredDays: ['Sunday'],
          maxAssignmentsPerMonth: 4
        }
      },
      {
        id: '6',
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.wilson@email.com',
        phone: '(555) 456-7890',
        ministries: ['Music', 'EMHC'],
        isActive: true,
        joinDate: new Date('2023-07-12'),
        lastLogin: new Date(),
        availability: {
          unavailableDates: [],
          preferredDays: ['Sunday', 'Saturday'],
          maxAssignmentsPerMonth: 5
        }
      },
      {
        id: '7',
        firstName: 'David',
        lastName: 'Lee',
        email: 'david.lee@email.com',
        phone: '(555) 567-8901',
        ministries: ['Altar Server'],
        isActive: true,
        joinDate: new Date('2023-09-05'),
        lastLogin: new Date(),
        availability: {
          unavailableDates: [
            new Date('2024-11-20'),
            new Date('2024-11-21')
          ],
          preferredDays: ['Sunday'],
          maxAssignmentsPerMonth: 3
        }
      },
      {
        id: '8',
        firstName: 'Lisa',
        lastName: 'Garcia',
        email: 'lisa.garcia@email.com',
        phone: '(555) 678-9012',
        ministries: ['Music'],
        isActive: true,
        joinDate: new Date('2023-11-18'),
        lastLogin: new Date(),
        availability: {
          unavailableDates: [],
          preferredDays: ['Sunday', 'Wednesday'],
          maxAssignmentsPerMonth: 4
        }
      }
    ];

    this._ministries.set(mockMinistries);
    this._familyGroups.set(mockFamilyGroups);
    this._ministers.set(mockMinisters);
  }

  // Minister CRUD operations
  getAllMinisters(): Observable<Minister[]> {
    this._isLoading.set(true);
    return of(this._ministers()).pipe(
      delay(500),
      tap(() => this._isLoading.set(false))
    );
  }

  getMinisterById(id: string): Observable<Minister | undefined> {
    this._isLoading.set(true);
    const minister = this._ministers().find(m => m.id === id);
    return of(minister).pipe(
      delay(300),
      tap(() => this._isLoading.set(false))
    );
  }

  createMinister(minister: Omit<Minister, 'id' | 'joinDate'>): Observable<Minister> {
    this._isLoading.set(true);
    const newMinister: Minister = {
      ...minister,
      id: Date.now().toString(),
      joinDate: new Date()
    };
    
    this._ministers.update(ministers => [...ministers, newMinister]);
    this._isLoading.set(false);
    
    return of(newMinister).pipe(delay(500));
  }

  updateMinister(id: string, updates: Partial<Minister>): Observable<Minister> {
    this._isLoading.set(true);
    this._ministers.update(ministers => 
      ministers.map(m => m.id === id ? { ...m, ...updates } : m)
    );
    this._isLoading.set(false);
    
    const updatedMinister = this._ministers().find(m => m.id === id);
    return of(updatedMinister!).pipe(delay(500));
  }

  deleteMinister(id: string): Observable<boolean> {
    this._isLoading.set(true);
    this._ministers.update(ministers => ministers.filter(m => m.id !== id));
    this._isLoading.set(false);
    
    return of(true).pipe(delay(500));
  }

  // Ministry operations
  getAllMinistries(): Observable<Ministry[]> {
    return of(this._ministries()).pipe(delay(300));
  }

  getMinistryById(id: string): Observable<Ministry | undefined> {
    const ministry = this._ministries().find(m => m.id === id);
    return of(ministry).pipe(delay(200));
  }

  createMinistry(ministry: Omit<Ministry, 'id'>): Observable<Ministry> {
    const newMinistry: Ministry = {
      ...ministry,
      id: Date.now().toString()
    };
    
    this._ministries.update(ministries => [...ministries, newMinistry]);
    return of(newMinistry).pipe(delay(500));
  }

  updateMinistry(id: string, updates: Partial<Ministry>): Observable<Ministry> {
    this._ministries.update(ministries => 
      ministries.map(m => m.id === id ? { ...m, ...updates } : m)
    );
    
    const updatedMinistry = this._ministries().find(m => m.id === id);
    return of(updatedMinistry!).pipe(delay(500));
  }

  deleteMinistry(id: string): Observable<boolean> {
    this._ministries.update(ministries => ministries.filter(m => m.id !== id));
    return of(true).pipe(delay(500));
  }

  // Family group operations
  getAllFamilyGroups(): Observable<FamilyGroup[]> {
    return of(this._familyGroups()).pipe(delay(300));
  }

  createFamilyGroup(group: Omit<FamilyGroup, 'id'>): Observable<FamilyGroup> {
    const newGroup: FamilyGroup = {
      ...group,
      id: Date.now().toString()
    };
    
    this._familyGroups.update(groups => [...groups, newGroup]);
    return of(newGroup).pipe(delay(500));
  }

  updateFamilyGroup(id: string, updates: Partial<FamilyGroup>): Observable<FamilyGroup> {
    this._familyGroups.update(groups => 
      groups.map(g => g.id === id ? { ...g, ...updates } : g)
    );
    
    const updatedGroup = this._familyGroups().find(g => g.id === id);
    return of(updatedGroup!).pipe(delay(500));
  }

  deleteFamilyGroup(id: string): Observable<boolean> {
    this._familyGroups.update(groups => groups.filter(g => g.id !== id));
    return of(true).pipe(delay(500));
  }

  // Search and filtering
  searchMinisters(query: string): Observable<Minister[]> {
    const filtered = this._ministers().filter(minister => 
      minister.firstName.toLowerCase().includes(query.toLowerCase()) ||
      minister.lastName.toLowerCase().includes(query.toLowerCase()) ||
      minister.email.toLowerCase().includes(query.toLowerCase()) ||
      minister.ministries.some(ministry => 
        ministry.toLowerCase().includes(query.toLowerCase())
      )
    );
    return of(filtered).pipe(delay(300));
  }

  getMinistersByMinistry(ministryId: string): Observable<Minister[]> {
    const filtered = this._ministers().filter(minister => 
      minister.ministries.includes(ministryId)
    );
    return of(filtered).pipe(delay(300));
  }

  getActiveMinisters(): Observable<Minister[]> {
    const active = this._ministers().filter(minister => minister.isActive);
    return of(active).pipe(delay(300));
  }
}
