import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Patient } from '../models/patient.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:3000/api/patients';
  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  public patients$ = this.patientsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadPatients();
  }

  private loadPatients(): void {
    this.http.get<Patient[]>(this.apiUrl).subscribe({
      next: (patients) => this.patientsSubject.next(patients),
      error: (error) => {
        console.error('Error loading patients:', error);
        this.patientsSubject.next([]);
      }
    });
  }

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl).pipe(
      tap(patients => this.patientsSubject.next(patients))
    );
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  addPatient(patient: Omit<Patient, 'id' | 'createdAt'>): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient).pipe(
      tap(() => this.loadPatients())
    );
  }

  updatePatient(id: number, patient: Partial<Patient>): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, patient).pipe(
      tap(() => this.loadPatients())
    );
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadPatients())
    );
  }
}
