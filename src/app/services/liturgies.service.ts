import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';

export interface LiturgyTemplate {
  id: string;
  name: string;
  dayOfWeek: string;
  time: string;
  description?: string;
  isActive: boolean;
  ministryRequirements: {
    ministryId: string;
    ministryName: string;
    requiredCount: number;
  }[];
  specialInstructions?: string;
}

export interface LiturgyInstance {
  id: string;
  templateId: string;
  date: Date;
  time: string;
  name: string;
  isSpecial: boolean;
  isCancelled: boolean;
  specialInstructions?: string;
  assignedMinisters: {
    ministryId: string;
    ministerId: string;
    ministerName: string;
  }[];
  status: 'draft' | 'published' | 'completed';
  createdDate: Date;
  publishedDate?: Date;
}

export interface LiturgySchedule {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'published' | 'archived';
  liturgies: LiturgyInstance[];
  createdDate: Date;
  publishedDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LiturgiesService {
  private _templates = signal<LiturgyTemplate[]>([]);
  private _instances = signal<LiturgyInstance[]>([]);
  private _schedules = signal<LiturgySchedule[]>([]);
  private _isLoading = signal<boolean>(false);

  // Readonly signals
  public readonly templates = this._templates.asReadonly();
  public readonly instances = this._instances.asReadonly();
  public readonly schedules = this._schedules.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Initialize liturgy templates
    const mockTemplates: LiturgyTemplate[] = [
      {
        id: '1',
        name: 'Sunday 9:00 AM Mass',
        dayOfWeek: 'Sunday',
        time: '09:00',
        description: 'Main Sunday morning Mass',
        isActive: true,
        ministryRequirements: [
          { ministryId: '1', ministryName: 'Altar Server', requiredCount: 2 },
          { ministryId: '2', ministryName: 'Music', requiredCount: 3 },
          { ministryId: '3', ministryName: 'Usher', requiredCount: 4 },
          { ministryId: '4', ministryName: 'EMHC', requiredCount: 2 }
        ],
        specialInstructions: 'Arrive 30 minutes early for setup'
      },
      {
        id: '2',
        name: 'Sunday 11:00 AM Mass',
        dayOfWeek: 'Sunday',
        time: '11:00',
        description: 'Late morning Sunday Mass',
        isActive: true,
        ministryRequirements: [
          { ministryId: '1', ministryName: 'Altar Server', requiredCount: 2 },
          { ministryId: '2', ministryName: 'Music', requiredCount: 3 },
          { ministryId: '3', ministryName: 'Usher', requiredCount: 4 },
          { ministryId: '4', ministryName: 'EMHC', requiredCount: 2 }
        ]
      },
      {
        id: '3',
        name: 'Saturday 5:00 PM Vigil Mass',
        dayOfWeek: 'Saturday',
        time: '17:00',
        description: 'Saturday evening Vigil Mass',
        isActive: true,
        ministryRequirements: [
          { ministryId: '1', ministryName: 'Altar Server', requiredCount: 2 },
          { ministryId: '2', ministryName: 'Music', requiredCount: 2 },
          { ministryId: '3', ministryName: 'Usher', requiredCount: 3 },
          { ministryId: '4', ministryName: 'EMHC', requiredCount: 2 }
        ]
      },
      {
        id: '4',
        name: 'Wednesday 7:00 PM Mass',
        dayOfWeek: 'Wednesday',
        time: '19:00',
        description: 'Weekday evening Mass',
        isActive: true,
        ministryRequirements: [
          { ministryId: '1', ministryName: 'Altar Server', requiredCount: 1 },
          { ministryId: '2', ministryName: 'Music', requiredCount: 1 },
          { ministryId: '3', ministryName: 'Usher', requiredCount: 2 }
        ]
      }
    ];

    // Initialize liturgy instances for current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const mockInstances: LiturgyInstance[] = this.generateMonthlyInstances(mockTemplates, currentMonth, currentYear);

    // Initialize schedules
    const mockSchedules: LiturgySchedule[] = [
      {
        id: '1',
        name: `November ${currentYear} Schedule`,
        startDate: new Date(currentYear, currentMonth, 1),
        endDate: new Date(currentYear, currentMonth + 1, 0),
        status: 'published',
        liturgies: mockInstances,
        createdDate: new Date(currentYear, currentMonth - 1, 25),
        publishedDate: new Date(currentYear, currentMonth - 1, 28)
      }
    ];

    this._templates.set(mockTemplates);
    this._instances.set(mockInstances);
    this._schedules.set(mockSchedules);
  }

  private generateMonthlyInstances(templates: LiturgyTemplate[], month: number, year: number): LiturgyInstance[] {
    const instances: LiturgyInstance[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

      // Find templates for this day of week
      const dayTemplates = templates.filter(template => 
        template.dayOfWeek === dayOfWeek && template.isActive
      );

      dayTemplates.forEach(template => {
        const instance: LiturgyInstance = {
          id: `${template.id}-${year}-${month + 1}-${day}`,
          templateId: template.id,
          date: new Date(date),
          time: template.time,
          name: template.name,
          isSpecial: this.isSpecialDate(date),
          isCancelled: false,
          specialInstructions: template.specialInstructions,
          assignedMinisters: [],
          status: 'published',
          createdDate: new Date(),
          publishedDate: new Date()
        };

        instances.push(instance);
      });
    }

    return instances;
  }

  private isSpecialDate(date: Date): boolean {
    // Check for special dates like Christmas, Easter, etc.
    const month = date.getMonth();
    const day = date.getDate();
    
    // Christmas
    if (month === 11 && day === 25) return true;
    // New Year's Day
    if (month === 0 && day === 1) return true;
    // Easter (simplified - would need proper calculation)
    if (month === 3 && day === 21) return true;
    
    return false;
  }

  // Template operations
  getAllTemplates(): Observable<LiturgyTemplate[]> {
    this._isLoading.set(true);
    return of(this._templates()).pipe(
      delay(500),
      tap(() => this._isLoading.set(false))
    );
  }

  getTemplateById(id: string): Observable<LiturgyTemplate | undefined> {
    const template = this._templates().find(t => t.id === id);
    return of(template).pipe(delay(300));
  }

  createTemplate(template: Omit<LiturgyTemplate, 'id'>): Observable<LiturgyTemplate> {
    this._isLoading.set(true);
    const newTemplate: LiturgyTemplate = {
      ...template,
      id: Date.now().toString()
    };
    
    this._templates.update(templates => [...templates, newTemplate]);
    this._isLoading.set(false);
    
    return of(newTemplate).pipe(delay(500));
  }

  updateTemplate(id: string, updates: Partial<LiturgyTemplate>): Observable<LiturgyTemplate> {
    this._isLoading.set(true);
    this._templates.update(templates => 
      templates.map(t => t.id === id ? { ...t, ...updates } : t)
    );
    this._isLoading.set(false);
    
    const updatedTemplate = this._templates().find(t => t.id === id);
    return of(updatedTemplate!).pipe(delay(500));
  }

  deleteTemplate(id: string): Observable<boolean> {
    this._isLoading.set(true);
    this._templates.update(templates => templates.filter(t => t.id !== id));
    this._isLoading.set(false);
    
    return of(true).pipe(delay(500));
  }

  // Instance operations
  getInstancesByDateRange(startDate: Date, endDate: Date): Observable<LiturgyInstance[]> {
    const filtered = this._instances().filter(instance => 
      instance.date >= startDate && instance.date <= endDate
    );
    return of(filtered).pipe(delay(300));
  }

  getInstancesByDate(date: Date): Observable<LiturgyInstance[]> {
    const filtered = this._instances().filter(instance => 
      instance.date.toDateString() === date.toDateString()
    );
    return of(filtered).pipe(delay(300));
  }

  getInstanceById(id: string): Observable<LiturgyInstance | undefined> {
    const instance = this._instances().find(i => i.id === id);
    return of(instance).pipe(delay(200));
  }

  updateInstance(id: string, updates: Partial<LiturgyInstance>): Observable<LiturgyInstance> {
    this._instances.update(instances => 
      instances.map(i => i.id === id ? { ...i, ...updates } : i)
    );
    
    const updatedInstance = this._instances().find(i => i.id === id);
    return of(updatedInstance!).pipe(delay(500));
  }

  cancelInstance(id: string): Observable<boolean> {
    this._instances.update(instances => 
      instances.map(i => i.id === id ? { ...i, isCancelled: true } : i)
    );
    return of(true).pipe(delay(500));
  }

  // Schedule operations
  getAllSchedules(): Observable<LiturgySchedule[]> {
    return of(this._schedules()).pipe(delay(300));
  }

  getScheduleById(id: string): Observable<LiturgySchedule | undefined> {
    const schedule = this._schedules().find(s => s.id === id);
    return of(schedule).pipe(delay(300));
  }

  getCurrentSchedule(): Observable<LiturgySchedule | undefined> {
    const currentDate = new Date();
    const currentSchedule = this._schedules().find(schedule => 
      schedule.startDate <= currentDate && schedule.endDate >= currentDate
    );
    return of(currentSchedule).pipe(delay(300));
  }

  createSchedule(schedule: Omit<LiturgySchedule, 'id' | 'createdDate'>): Observable<LiturgySchedule> {
    const newSchedule: LiturgySchedule = {
      ...schedule,
      id: Date.now().toString(),
      createdDate: new Date()
    };
    
    this._schedules.update(schedules => [...schedules, newSchedule]);
    return of(newSchedule).pipe(delay(500));
  }

  publishSchedule(id: string): Observable<LiturgySchedule> {
    this._schedules.update(schedules => 
      schedules.map(s => s.id === id ? { 
        ...s, 
        status: 'published' as const,
        publishedDate: new Date()
      } : s)
    );
    
    const updatedSchedule = this._schedules().find(s => s.id === id);
    return of(updatedSchedule!).pipe(delay(500));
  }

  // Utility methods
  getUpcomingLiturgies(days: number = 7): Observable<LiturgyInstance[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    const upcoming = this._instances().filter(instance => 
      instance.date >= new Date() && 
      instance.date <= futureDate && 
      !instance.isCancelled
    );
    
    return of(upcoming).pipe(delay(300));
  }

  getLiturgiesForMinister(ministerId: string): Observable<LiturgyInstance[]> {
    const ministerLiturgies = this._instances().filter(instance =>
      instance.assignedMinisters.some(assignment => assignment.ministerId === ministerId)
    );
    
    return of(ministerLiturgies).pipe(delay(300));
  }
}
