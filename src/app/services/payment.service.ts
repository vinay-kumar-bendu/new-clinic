import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Payment, Billing } from '../models/payment.model';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/api/payments';
  private paymentsSubject = new BehaviorSubject<Payment[]>([]);
  public payments$ = this.paymentsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadPayments();
  }

  private loadPayments(): void {
    this.http.get<Payment[]>(this.apiUrl).subscribe({
      next: (payments) => this.paymentsSubject.next(this.enrichWithRelations(payments)),
      error: (error) => {
        console.error('Error loading payments:', error);
        this.paymentsSubject.next([]);
      }
    });
  }

  private enrichWithRelations(payments: any[]): Payment[] {
    return payments.map((payment: any) => ({
      ...payment,
      patient: payment.firstName && payment.lastName ? {
        id: payment.patientId,
        firstName: payment.firstName,
        lastName: payment.lastName
      } as any : undefined
    }));
  }

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl).pipe(
      map(payments => this.enrichWithRelations(payments)),
      tap(payments => this.paymentsSubject.next(payments))
    );
  }

  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`).pipe(
      map(payment => this.enrichWithRelations([payment])[0])
    );
  }

  getPaymentsByPatientId(patientId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl).pipe(
      map(payments => payments.filter(p => p.patientId === patientId)),
      map(payments => this.enrichWithRelations(payments))
    );
  }

  getBillingByPatientId(patientId: number): Observable<Billing> {
    return this.getPaymentsByPatientId(patientId).pipe(
      map(payments => {
        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
        const paidAmount = payments
          .filter(p => p.status === 'Paid')
          .reduce((sum, p) => sum + p.amount, 0);
        
        return {
          patientId,
          totalAmount,
          paidAmount,
          pendingAmount: totalAmount - paidAmount,
          payments
        };
      })
    );
  }

  addPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'patient' | 'treatment' | 'invoiceNumber'>): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment).pipe(
      map(p => this.enrichWithRelations([p])[0]),
      tap(() => this.loadPayments())
    );
  }

  updatePayment(id: number, payment: Partial<Payment>): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${id}`, payment).pipe(
      map(p => this.enrichWithRelations([p])[0]),
      tap(() => this.loadPayments())
    );
  }

  deletePayment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadPayments())
    );
  }
}
