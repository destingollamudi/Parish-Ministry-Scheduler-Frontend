import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'schedule_published' | 'sub_request' | 'sub_accepted' | 'reminder' | 'custom';
  isActive: boolean;
  tokens: string[]; // Available tokens like {{minister_name}}, {{schedule_link}}
}

export interface EmailMessage {
  id: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  templateId?: string;
  status: 'pending' | 'sent' | 'failed' | 'delivered';
  sentDate?: Date;
  errorMessage?: string;
  attachments?: {
    filename: string;
    content: string;
    contentType: string;
  }[];
}

export interface BulkEmailRequest {
  templateId: string;
  recipients: {
    email: string;
    name: string;
    tokens?: { [key: string]: string };
  }[];
  customSubject?: string;
  customBody?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private _templates = signal<EmailTemplate[]>([]);
  private _messages = signal<EmailMessage[]>([]);
  private _isLoading = signal<boolean>(false);

  // Readonly signals
  public readonly templates = this._templates.asReadonly();
  public readonly messages = this._messages.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Initialize email templates
    const mockTemplates: EmailTemplate[] = [
      {
        id: '1',
        name: 'Schedule Published',
        subject: 'New Ministry Schedule Published - {{month_year}}',
        body: `Dear {{minister_name}},

The ministry schedule for {{month_year}} has been published and is now available for viewing.

You have been assigned to the following services:
{{assignments}}

Please review your schedule and mark any dates when you cannot serve.

View your schedule: {{schedule_link}}

If you have any questions or need to request a substitute, please contact the parish office.

Thank you for your service to our parish.

Blessings,
Parish Ministry Coordinator`,
        type: 'schedule_published',
        isActive: true,
        tokens: ['minister_name', 'month_year', 'assignments', 'schedule_link']
      },
      {
        id: '2',
        name: 'Sub Request Notification',
        subject: 'Substitute Request - {{ministry_name}} on {{date}}',
        body: `Dear {{minister_name}},

A substitute request has been made for the following service:

Service: {{liturgy_name}}
Date: {{date}}
Time: {{time}}
Ministry: {{ministry_name}}
Requested by: {{requested_by}}
Reason: {{reason}}

If you are available to serve as a substitute, please respond by {{expires_date}}.

Accept Request: {{accept_link}}
Decline Request: {{decline_link}}

Thank you for your consideration.

Parish Ministry Coordinator`,
        type: 'sub_request',
        isActive: true,
        tokens: ['minister_name', 'ministry_name', 'date', 'liturgy_name', 'time', 'requested_by', 'reason', 'expires_date', 'accept_link', 'decline_link']
      },
      {
        id: '3',
        name: 'Sub Request Accepted',
        subject: 'Substitute Request Accepted - {{ministry_name}} on {{date}}',
        body: `Dear {{minister_name}},

Your substitute request for {{ministry_name}} on {{date}} at {{time}} has been accepted by {{accepted_by}}.

You are no longer responsible for this assignment.

Thank you for your service to our parish.

Parish Ministry Coordinator`,
        type: 'sub_accepted',
        isActive: true,
        tokens: ['minister_name', 'ministry_name', 'date', 'time', 'accepted_by']
      },
      {
        id: '4',
        name: 'Service Reminder',
        subject: 'Reminder: You are scheduled to serve tomorrow',
        body: `Dear {{minister_name}},

This is a friendly reminder that you are scheduled to serve as {{ministry_name}} tomorrow:

Date: {{date}}
Time: {{time}}
Service: {{liturgy_name}}

Please arrive 15 minutes early for setup and preparation.

If you are unable to serve, please contact the parish office immediately.

Thank you for your service to our parish.

Parish Ministry Coordinator`,
        type: 'reminder',
        isActive: true,
        tokens: ['minister_name', 'ministry_name', 'date', 'time', 'liturgy_name']
      },
      {
        id: '5',
        name: 'Custom Message',
        subject: '{{custom_subject}}',
        body: `Dear {{minister_name}},

{{custom_message}}

Thank you for your service to our parish.

Parish Ministry Coordinator`,
        type: 'custom',
        isActive: true,
        tokens: ['minister_name', 'custom_subject', 'custom_message']
      }
    ];

    // Initialize mock sent messages
    const mockMessages: EmailMessage[] = [
      {
        id: '1',
        to: ['john.smith@email.com'],
        subject: 'New Ministry Schedule Published - November 2024',
        body: 'Dear John Smith,\n\nThe ministry schedule for November 2024 has been published...',
        templateId: '1',
        status: 'sent',
        sentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        id: '2',
        to: ['mary.johnson@email.com'],
        subject: 'Substitute Request - Altar Server on Sunday, Oct 27',
        body: 'Dear Mary Johnson,\n\nA substitute request has been made...',
        templateId: '2',
        status: 'delivered',
        sentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];

    this._templates.set(mockTemplates);
    this._messages.set(mockMessages);
  }

  // Template operations
  getAllTemplates(): Observable<EmailTemplate[]> {
    return of(this._templates()).pipe(delay(300));
  }

  getTemplateById(id: string): Observable<EmailTemplate | undefined> {
    const template = this._templates().find(t => t.id === id);
    return of(template).pipe(delay(200));
  }

  createTemplate(template: Omit<EmailTemplate, 'id'>): Observable<EmailTemplate> {
    this._isLoading.set(true);
    const newTemplate: EmailTemplate = {
      ...template,
      id: Date.now().toString()
    };
    
    this._templates.update(templates => [...templates, newTemplate]);
    this._isLoading.set(false);
    
    return of(newTemplate).pipe(delay(500));
  }

  updateTemplate(id: string, updates: Partial<EmailTemplate>): Observable<EmailTemplate> {
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

  // Message operations
  sendMessage(message: Omit<EmailMessage, 'id' | 'status'>): Observable<EmailMessage> {
    this._isLoading.set(true);
    const newMessage: EmailMessage = {
      ...message,
      id: Date.now().toString(),
      status: 'pending'
    };
    
    // Simulate sending email
    setTimeout(() => {
      this._messages.update(messages => 
        messages.map(m => m.id === newMessage.id ? {
          ...m,
          status: 'sent' as const,
          sentDate: new Date()
        } : m)
      );
    }, 2000);
    
    this._messages.update(messages => [...messages, newMessage]);
    this._isLoading.set(false);
    
    return of(newMessage).pipe(delay(1000));
  }

  sendBulkEmail(request: BulkEmailRequest): Observable<EmailMessage[]> {
    this._isLoading.set(true);
    const template = this._templates().find(t => t.id === request.templateId);
    if (!template) {
      this._isLoading.set(false);
      return of([]);
    }

    const messages: EmailMessage[] = [];
    
    request.recipients.forEach(recipient => {
      const subject = request.customSubject || this.replaceTokens(template.subject, recipient.tokens || {});
      const body = request.customBody || this.replaceTokens(template.body, recipient.tokens || {});
      
      const message: EmailMessage = {
        id: Date.now().toString() + Math.random(),
        to: [recipient.email],
        subject,
        body,
        templateId: request.templateId,
        status: 'pending'
      };
      
      messages.push(message);
    });

    // Add all messages to the store
    this._messages.update(currentMessages => [...currentMessages, ...messages]);
    
    // Simulate sending
    setTimeout(() => {
      this._messages.update(currentMessages => 
        currentMessages.map(m => {
          const message = messages.find(msg => msg.id === m.id);
          if (message) {
            return {
              ...m,
              status: 'sent' as const,
              sentDate: new Date()
            };
          }
          return m;
        })
      );
    }, 3000);
    
    this._isLoading.set(false);
    return of(messages).pipe(delay(2000));
  }

  private replaceTokens(text: string, tokens: { [key: string]: string }): string {
    let result = text;
    Object.entries(tokens).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    });
    return result;
  }

  // Notification triggers
  notifySchedulePublished(ministers: any[], scheduleInfo: any): Observable<EmailMessage[]> {
    const template = this._templates().find(t => t.type === 'schedule_published');
    if (!template) return of([]);

    const recipients = ministers.map(minister => ({
      email: minister.email,
      name: `${minister.firstName} ${minister.lastName}`,
      tokens: {
        minister_name: `${minister.firstName} ${minister.lastName}`,
        month_year: scheduleInfo.monthYear,
        assignments: this.formatAssignments(minister.assignments),
        schedule_link: `${window.location.origin}/schedule`
      }
    }));

    return this.sendBulkEmail({
      templateId: template.id,
      recipients
    });
  }

  notifySubRequest(ministers: any[], request: any): Observable<EmailMessage[]> {
    const template = this._templates().find(t => t.type === 'sub_request');
    if (!template) return of([]);

    const recipients = ministers.map(minister => ({
      email: minister.email,
      name: `${minister.firstName} ${minister.lastName}`,
      tokens: {
        minister_name: `${minister.firstName} ${minister.lastName}`,
        ministry_name: request.ministryName,
        date: request.date,
        liturgy_name: request.liturgyName,
        time: request.time,
        requested_by: request.requestedBy,
        reason: request.reason,
        expires_date: request.expiresDate,
        accept_link: `${window.location.origin}/sub-requests/accept/${request.id}`,
        decline_link: `${window.location.origin}/sub-requests/decline/${request.id}`
      }
    }));

    return this.sendBulkEmail({
      templateId: template.id,
      recipients
    });
  }

  notifySubAccepted(request: any, acceptedBy: any): Observable<EmailMessage> {
    const template = this._templates().find(t => t.type === 'sub_accepted');
    if (!template) {
      return of({} as EmailMessage);
    }

    const message = {
      to: [request.ministerEmail],
      subject: this.replaceTokens(template.subject, {
        ministry_name: request.ministryName,
        date: request.date
      }),
      body: this.replaceTokens(template.body, {
        minister_name: request.ministerName,
        ministry_name: request.ministryName,
        date: request.date,
        time: request.time,
        accepted_by: `${acceptedBy.firstName} ${acceptedBy.lastName}`
      }),
      templateId: template.id
    };

    return this.sendMessage(message);
  }

  sendReminder(assignments: any[]): Observable<EmailMessage[]> {
    const template = this._templates().find(t => t.type === 'reminder');
    if (!template) return of([]);

    const recipients = assignments.map(assignment => ({
      email: assignment.ministerEmail,
      name: assignment.ministerName,
      tokens: {
        minister_name: assignment.ministerName,
        ministry_name: assignment.ministryName,
        date: assignment.date,
        time: assignment.time,
        liturgy_name: assignment.liturgyName
      }
    }));

    return this.sendBulkEmail({
      templateId: template.id,
      recipients
    });
  }

  // Utility methods
  private formatAssignments(assignments: any[]): string {
    if (!assignments || assignments.length === 0) {
      return 'No assignments for this period.';
    }

    return assignments.map(assignment => 
      `${assignment.date} at ${assignment.time} - ${assignment.ministryName}`
    ).join('\n');
  }

  getMessageHistory(): Observable<EmailMessage[]> {
    return of(this._messages()).pipe(delay(300));
  }

  getMessagesByStatus(status: string): Observable<EmailMessage[]> {
    const filtered = this._messages().filter(m => m.status === status);
    return of(filtered).pipe(delay(300));
  }

  getMessagesByTemplate(templateId: string): Observable<EmailMessage[]> {
    const filtered = this._messages().filter(m => m.templateId === templateId);
    return of(filtered).pipe(delay(300));
  }
}
