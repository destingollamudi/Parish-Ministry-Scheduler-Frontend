import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Minister } from './ministers.service';
import { LiturgyInstance, LiturgyTemplate } from './liturgies.service';

export interface SchedulingConstraint {
  type: 'availability' | 'qualification' | 'fairness' | 'family_grouping' | 'max_assignments';
  weight: number;
  enabled: boolean;
}

export interface SchedulingResult {
  success: boolean;
  assignedMinisters: {
    liturgyId: string;
    ministryId: string;
    ministerId: string;
    ministerName: string;
  }[];
  unassignedPositions: {
    liturgyId: string;
    ministryId: string;
    ministryName: string;
    requiredCount: number;
    assignedCount: number;
  }[];
  conflicts: {
    ministerId: string;
    ministerName: string;
    conflictType: string;
    details: string;
  }[];
  statistics: {
    totalPositions: number;
    assignedPositions: number;
    assignmentRate: number;
    averageAssignmentsPerMinister: number;
  };
}

export interface SubRequest {
  id: string;
  liturgyId: string;
  ministerId: string;
  ministerName: string;
  ministryId: string;
  ministryName: string;
  date: Date;
  time: string;
  reason: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  requestedDate: Date;
  acceptedBy?: string;
  acceptedDate?: Date;
  expiresDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SchedulingService {
  private _constraints = signal<SchedulingConstraint[]>([
    { type: 'availability', weight: 10, enabled: true },
    { type: 'qualification', weight: 10, enabled: true },
    { type: 'fairness', weight: 8, enabled: true },
    { type: 'family_grouping', weight: 6, enabled: true },
    { type: 'max_assignments', weight: 7, enabled: true }
  ]);
  
  private _subRequests = signal<SubRequest[]>([]);
  private _isLoading = signal<boolean>(false);

  // Readonly signals
  public readonly constraints = this._constraints.asReadonly();
  public readonly subRequests = this._subRequests.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Initialize mock sub requests
    const mockSubRequests: SubRequest[] = [
      {
        id: '1',
        liturgyId: '1-2024-10-27',
        ministerId: '1',
        ministerName: 'John Smith',
        ministryId: '1',
        ministryName: 'Altar Server',
        date: new Date('2024-10-27'),
        time: '09:00',
        reason: 'Family emergency',
        status: 'pending',
        requestedDate: new Date(),
        expiresDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      },
      {
        id: '2',
        liturgyId: '4-2024-10-30',
        ministerId: '3',
        ministerName: 'Mary Johnson',
        ministryId: '2',
        ministryName: 'Music',
        date: new Date('2024-10-30'),
        time: '19:00',
        reason: 'Out of town',
        status: 'pending',
        requestedDate: new Date(),
        expiresDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    ];

    this._subRequests.set(mockSubRequests);
  }

  // Scheduling operations
  generateSchedule(
    liturgies: LiturgyInstance[],
    ministers: Minister[],
    templates: LiturgyTemplate[]
  ): Observable<SchedulingResult> {
    this._isLoading.set(true);
    
    // Simulate complex scheduling algorithm
    const result = this.performScheduling(liturgies, ministers, templates);
    
    this._isLoading.set(false);
    return of(result).pipe(delay(2000)); // Simulate processing time
  }

  private performScheduling(
    liturgies: LiturgyInstance[],
    ministers: Minister[],
    templates: LiturgyTemplate[]
  ): SchedulingResult {
    const assignedMinisters: any[] = [];
    const unassignedPositions: any[] = [];
    const conflicts: any[] = [];
    
    // Get active constraints
    const activeConstraints = this._constraints().filter(c => c.enabled);
    
    for (const liturgy of liturgies) {
      if (liturgy.isCancelled) continue;
      
      const template = templates.find(t => t.id === liturgy.templateId);
      if (!template) continue;
      
      for (const requirement of template.ministryRequirements) {
        const availableMinisters = this.getAvailableMinisters(
          ministers,
          requirement.ministryId,
          liturgy.date,
          activeConstraints
        );
        
        const assigned = this.assignMinisters(
          availableMinisters,
          requirement.requiredCount,
          liturgy,
          requirement.ministryId
        );
        
        assignedMinisters.push(...assigned);
        
        if (assigned.length < requirement.requiredCount) {
          unassignedPositions.push({
            liturgyId: liturgy.id,
            ministryId: requirement.ministryId,
            ministryName: requirement.ministryName,
            requiredCount: requirement.requiredCount,
            assignedCount: assigned.length
          });
        }
      }
    }
    
    const totalPositions = liturgies.reduce((total, liturgy) => {
      const template = templates.find(t => t.id === liturgy.templateId);
      return total + (template?.ministryRequirements.reduce((sum, req) => sum + req.requiredCount, 0) || 0);
    }, 0);
    
    const statistics = {
      totalPositions,
      assignedPositions: assignedMinisters.length,
      assignmentRate: assignedMinisters.length / totalPositions,
      averageAssignmentsPerMinister: this.calculateAverageAssignments(assignedMinisters, ministers)
    };
    
    return {
      success: unassignedPositions.length === 0,
      assignedMinisters,
      unassignedPositions,
      conflicts,
      statistics
    };
  }

  private getAvailableMinisters(
    ministers: Minister[],
    ministryId: string,
    date: Date,
    constraints: SchedulingConstraint[]
  ): Minister[] {
    return ministers.filter(minister => {
      // Check if minister is active
      if (!minister.isActive) return false;
      
      // Check qualification
      if (!minister.ministries.includes(ministryId)) return false;
      
      // Check availability
      if (minister.availability?.unavailableDates) {
        const isUnavailable = minister.availability.unavailableDates.some(unavailableDate => 
          unavailableDate.toDateString() === date.toDateString()
        );
        if (isUnavailable) return false;
      }
      
      return true;
    });
  }

  private assignMinisters(
    availableMinisters: Minister[],
    requiredCount: number,
    liturgy: LiturgyInstance,
    ministryId: string
  ): any[] {
    const assigned: any[] = [];
    const shuffled = [...availableMinisters].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(requiredCount, shuffled.length); i++) {
      const minister = shuffled[i];
      assigned.push({
        liturgyId: liturgy.id,
        ministryId: ministryId,
        ministerId: minister.id,
        ministerName: `${minister.firstName} ${minister.lastName}`
      });
    }
    
    return assigned;
  }

  private calculateAverageAssignments(assignedMinisters: any[], ministers: Minister[]): number {
    const assignmentCounts = new Map<string, number>();
    
    assignedMinisters.forEach(assignment => {
      const count = assignmentCounts.get(assignment.ministerId) || 0;
      assignmentCounts.set(assignment.ministerId, count + 1);
    });
    
    const totalAssignments = Array.from(assignmentCounts.values()).reduce((sum, count) => sum + count, 0);
    return totalAssignments / ministers.length;
  }

  // Sub request operations
  getAllSubRequests(): Observable<SubRequest[]> {
    return of(this._subRequests()).pipe(delay(300));
  }

  getSubRequestsByMinister(ministerId: string): Observable<SubRequest[]> {
    const requests = this._subRequests().filter(req => req.ministerId === ministerId);
    return of(requests).pipe(delay(300));
  }

  getPendingSubRequests(): Observable<SubRequest[]> {
    const pending = this._subRequests().filter(req => req.status === 'pending');
    return of(pending).pipe(delay(300));
  }

  createSubRequest(request: Omit<SubRequest, 'id' | 'requestedDate' | 'expiresDate'>): Observable<SubRequest> {
    const newRequest: SubRequest = {
      ...request,
      id: Date.now().toString(),
      requestedDate: new Date(),
      expiresDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };
    
    this._subRequests.update(requests => [...requests, newRequest]);
    return of(newRequest).pipe(delay(500));
  }

  acceptSubRequest(requestId: string, acceptedBy: string): Observable<SubRequest> {
    this._subRequests.update(requests => 
      requests.map(req => req.id === requestId ? {
        ...req,
        status: 'accepted' as const,
        acceptedBy,
        acceptedDate: new Date()
      } : req)
    );
    
    const updatedRequest = this._subRequests().find(req => req.id === requestId);
    return of(updatedRequest!).pipe(delay(500));
  }

  declineSubRequest(requestId: string): Observable<SubRequest> {
    this._subRequests.update(requests => 
      requests.map(req => req.id === requestId ? {
        ...req,
        status: 'declined' as const
      } : req)
    );
    
    const updatedRequest = this._subRequests().find(req => req.id === requestId);
    return of(updatedRequest!).pipe(delay(500));
  }

  // Constraint management
  updateConstraint(type: string, updates: Partial<SchedulingConstraint>): Observable<SchedulingConstraint> {
    this._constraints.update(constraints => 
      constraints.map(c => c.type === type ? { ...c, ...updates } : c)
    );
    
    const updatedConstraint = this._constraints().find(c => c.type === type);
    return of(updatedConstraint!).pipe(delay(300));
  }

  getConstraints(): Observable<SchedulingConstraint[]> {
    return of(this._constraints()).pipe(delay(300));
  }

  // Utility methods
  validateSchedule(liturgies: LiturgyInstance[], ministers: Minister[]): Observable<any[]> {
    const conflicts: any[] = [];
    
    // Check for double-bookings
    const ministerAssignments = new Map<string, string[]>();
    
    liturgies.forEach(liturgy => {
      liturgy.assignedMinisters.forEach(assignment => {
        if (!ministerAssignments.has(assignment.ministerId)) {
          ministerAssignments.set(assignment.ministerId, []);
        }
        ministerAssignments.get(assignment.ministerId)!.push(liturgy.id);
      });
    });
    
    // Check for conflicts
    ministerAssignments.forEach((liturgyIds, ministerId) => {
      if (liturgyIds.length > 1) {
        const minister = ministers.find(m => m.id === ministerId);
        conflicts.push({
          ministerId,
          ministerName: minister ? `${minister.firstName} ${minister.lastName}` : 'Unknown',
          conflictType: 'double_booking',
          details: `Assigned to ${liturgyIds.length} liturgies on the same date`
        });
      }
    });
    
    return of(conflicts).pipe(delay(500));
  }

  getScheduleStatistics(liturgies: LiturgyInstance[]): Observable<any> {
    const totalPositions = liturgies.reduce((total, liturgy) => {
      return total + liturgy.assignedMinisters.length;
    }, 0);
    
    const ministerCounts = new Map<string, number>();
    liturgies.forEach(liturgy => {
      liturgy.assignedMinisters.forEach(assignment => {
        const count = ministerCounts.get(assignment.ministerId) || 0;
        ministerCounts.set(assignment.ministerId, count + 1);
      });
    });
    
    const statistics = {
      totalLiturgies: liturgies.length,
      totalPositions,
      uniqueMinisters: ministerCounts.size,
      averageAssignmentsPerMinister: totalPositions / ministerCounts.size,
      distribution: Array.from(ministerCounts.entries()).map(([ministerId, count]) => ({
        ministerId,
        count
      }))
    };
    
    return of(statistics).pipe(delay(300));
  }
}
