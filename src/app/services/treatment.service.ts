import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Treatment } from '../models/treatment.model';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TreatmentService {
  private apiUrl = 'http://localhost:3000/api/treatments';
  private treatmentsSubject = new BehaviorSubject<Treatment[]>([]);
  public treatments$ = this.treatmentsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTreatments();
  }

  private loadTreatments(): void {
    this.http.get<Treatment[]>(this.apiUrl).subscribe({
      next: (treatments) => this.treatmentsSubject.next(this.enrichWithPatients(treatments)),
      error: (error) => {
        console.error('Error loading treatments:', error);
        this.treatmentsSubject.next([]);
      }
    });
  }

  private enrichWithPatients(treatments: any[]): Treatment[] {
    return treatments.map((treatment: any) => ({
      ...treatment,
      procedure: treatment.procedureDetails || treatment.procedure,
      patient: treatment.firstName && treatment.lastName ? {
        id: treatment.patientId,
        firstName: treatment.firstName,
        lastName: treatment.lastName
      } as any : undefined
    }));
  }

  getAllTreatments(): Observable<Treatment[]> {
    // Use cached data from BehaviorSubject, only fetch if empty
    const currentValue = this.treatmentsSubject.value;
    if (currentValue.length > 0) {
      return this.treatmentsSubject.asObservable();
    }
    // Fetch and update cache
    return this.http.get<Treatment[]>(this.apiUrl).pipe(
      map(treatments => this.enrichWithPatients(treatments)),
      tap(treatments => this.treatmentsSubject.next(treatments))
    );
  }

  getTreatmentById(id: number): Observable<Treatment> {
    return this.http.get<Treatment>(`${this.apiUrl}/${id}`).pipe(
      map(treatment => this.enrichWithPatients([treatment])[0])
    );
  }

  getTreatmentsByPatientId(patientId: number): Observable<Treatment[]> {
    return this.http.get<Treatment[]>(this.apiUrl).pipe(
      map(treatments => treatments.filter(t => t.patientId === patientId)),
      map(treatments => this.enrichWithPatients(treatments))
    );
  }

  addTreatment(treatment: Omit<Treatment, 'id' | 'createdAt' | 'patient'>): Observable<Treatment> {
    const treatmentData = {
      ...treatment,
      procedureDetails: treatment.procedure
    };
    return this.http.post<Treatment>(this.apiUrl, treatmentData).pipe(
      map(t => this.enrichWithPatients([t])[0]),
      tap(() => this.loadTreatments())
    );
  }

  updateTreatment(id: number, treatment: Partial<Treatment>): Observable<Treatment> {
    const treatmentData: any = { ...treatment };
    if (treatment.procedure) {
      treatmentData.procedureDetails = treatment.procedure;
    }
    return this.http.put<Treatment>(`${this.apiUrl}/${id}`, treatmentData).pipe(
      map(t => this.enrichWithPatients([t])[0]),
      tap(() => this.loadTreatments())
    );
  }

  deleteTreatment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadTreatments())
    );
  }
}
