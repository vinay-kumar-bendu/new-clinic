import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Appointment } from '../models/appointment.model';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:3000/api/appointments';
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  public appointments$ = this.appointmentsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadAppointments();
  }

  private loadAppointments(): void {
    this.http.get<Appointment[]>(this.apiUrl).subscribe({
      next: (appointments) => this.appointmentsSubject.next(this.enrichWithPatients(appointments)),
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.appointmentsSubject.next([]);
      }
    });
  }

  private enrichWithPatients(appointments: any[]): Appointment[] {
    return appointments.map((apt: any) => ({
      ...apt,
      patient: apt.firstName && apt.lastName ? {
        id: apt.patientId,
        firstName: apt.firstName,
        lastName: apt.lastName
      } as any : undefined
    }));
  }

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl).pipe(
      map(appointments => this.enrichWithPatients(appointments)),
      tap(appointments => this.appointmentsSubject.next(appointments))
    );
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`).pipe(
      map(apt => this.enrichWithPatients([apt])[0])
    );
  }

  getAppointmentsByPatientId(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl).pipe(
      map(appointments => appointments.filter(a => a.patientId === patientId)),
      map(appointments => this.enrichWithPatients(appointments))
    );
  }

  getAppointmentsByDate(date: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl).pipe(
      map(appointments => appointments.filter(a => a.appointmentDate === date)),
      map(appointments => this.enrichWithPatients(appointments))
    );
  }

  addAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'patient'>): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment).pipe(
      map(apt => this.enrichWithPatients([apt])[0]),
      tap(() => this.loadAppointments())
    );
  }

  updateAppointment(id: number, appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, appointment).pipe(
      map(apt => this.enrichWithPatients([apt])[0]),
      tap(() => this.loadAppointments())
    );
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadAppointments())
    );
  }
}
