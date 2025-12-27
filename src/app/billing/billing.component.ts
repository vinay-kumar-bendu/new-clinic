import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../services/payment.service';
import { PatientService } from '../services/patient.service';
import { TreatmentService } from '../services/treatment.service';
import { Payment, Billing } from '../models/payment.model';
import { Patient } from '../models/patient.model';
import { Treatment } from '../models/treatment.model';

@Component({
  selector: 'app-billing',
  imports: [CommonModule, FormsModule],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.css'
})
export class BillingComponent implements OnInit {
  payments: Payment[] = [];
  patients: Patient[] = [];
  treatments: Treatment[] = [];
  selectedPatientId: number = 0;
  showForm = false;
  editingPayment: Payment | null = null;
  patientSearchTerm: string = '';
  showPatientDropdown: boolean = false;

  paymentForm = {
    patientId: 0,
    treatmentId: 0,
    appointmentId: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    amount: 0,
    paymentMethod: 'Cash' as Payment['paymentMethod'],
    paymentType: 'Full Payment' as Payment['paymentType'],
    description: '',
    status: 'Paid' as Payment['status']
  };

  constructor(
    private paymentService: PaymentService,
    private patientService: PatientService,
    private treatmentService: TreatmentService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.paymentService.payments$.subscribe(payments => {
      this.payments = payments;
    });
  }

  loadData(): void {
    this.paymentService.getAllPayments().subscribe({
      next: (payments) => this.payments = payments,
      error: (error) => console.error('Error loading payments:', error)
    });
    this.patientService.getAllPatients().subscribe({
      next: (patients) => this.patients = patients,
      error: (error) => console.error('Error loading patients:', error)
    });
    // Load all treatments at start (could also optimize by patient)
    this.treatmentService.getAllTreatments().subscribe({
      next: (treatments) => this.treatments = treatments,
      error: (err) => console.error('Error loading treatments:', err)
    });
  }

  get filteredPayments(): Payment[] {
    if (this.selectedPatientId === 0) return this.payments;
    return this.payments.filter(p => p.patientId === this.selectedPatientId);
  }

  get totalRevenue(): number {
    return this.payments
      .filter(p => p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  get pendingAmount(): number {
    return this.payments
      .filter(p => p.status === 'Pending')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  openAddForm(): void {
    this.editingPayment = null;
    this.patientSearchTerm = '';
    this.showPatientDropdown = false;
    this.paymentForm = {
      patientId: this.selectedPatientId || 0,
      treatmentId: 0,
      appointmentId: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      amount: 0,
      paymentMethod: 'Cash',
      paymentType: 'Full Payment',
      description: '',
      status: 'Paid'
    };
    this.showForm = true;
  }

  openEditForm(payment: Payment): void {
    this.editingPayment = payment;
    this.showPatientDropdown = false;
    const date = new Date(payment.paymentDate).toISOString().split('T')[0];
    this.paymentForm = {
      patientId: payment.patientId,
      treatmentId: payment.treatmentId || 0,
      appointmentId: payment.appointmentId || 0,
      paymentDate: date,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentType: payment.paymentType,
      description: payment.description,
      status: payment.status
    };
    
    // Set search term to selected patient name
    const selectedPatient = this.patients.find(p => p.id === payment.patientId);
    this.patientSearchTerm = selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : '';
    
    this.showForm = true;
  }

  savePayment(): void {
    // Make a copy of the payment form and fix treatmentId
    const formToSend = { ...this.paymentForm };
    if (!formToSend.treatmentId || formToSend.treatmentId === 0) {
      formToSend.treatmentId = null;
    }
    const operation = this.editingPayment
      ? this.paymentService.updatePayment(this.editingPayment.id, formToSend)
      : this.paymentService.addPayment(formToSend);
    
    operation.subscribe({
      next: () => {
        this.showForm = false;
        this.editingPayment = null;
      },
      error: (error) => {
        console.error('Error saving payment:', error);
        alert('Error saving payment. Please try again.');
      }
    });
  }

  deletePayment(id: number): void {
    if (confirm('Are you sure you want to delete this payment record?')) {
      this.paymentService.deletePayment(id).subscribe({
        next: () => this.loadData(),
        error: (error) => {
          console.error('Error deleting payment:', error);
          alert('Error deleting payment. Please try again.');
        }
      });
    }
  }

  get filteredPatients(): Patient[] {
    if (!this.patientSearchTerm.trim()) {
      return this.patients;
    }
    const searchLower = this.patientSearchTerm.toLowerCase().trim();
    return this.patients.filter(patient => 
      patient.firstName.toLowerCase().includes(searchLower) ||
      patient.lastName.toLowerCase().includes(searchLower) ||
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchLower) ||
      (patient.email && patient.email.toLowerCase().includes(searchLower)) ||
      (patient.phone && patient.phone.includes(searchLower))
    );
  }

  onPatientSearchFocus(): void {
    if (this.patients.length > 0) {
      this.showPatientDropdown = true;
    }
  }

  onPatientSearchBlur(): void {
    setTimeout(() => {
      this.showPatientDropdown = false;
    }, 150);
  }

  onPatientSearchInput(): void {
    this.showPatientDropdown = true;
    if (this.patientSearchTerm.trim() && 
        !this.filteredPatients.find(p => p.id === this.paymentForm.patientId)) {
      this.paymentForm.patientId = 0;
    }
  }

  onPatientSelect(patientId: number): void {
    this.paymentForm.patientId = patientId;
    // Clear treatment selection when patient changes
    this.paymentForm.treatmentId = null;
    const selectedPatient = this.patients.find(p => p.id === patientId);
    if (selectedPatient) {
      this.patientSearchTerm = `${selectedPatient.firstName} ${selectedPatient.lastName}`;
    }
    this.showPatientDropdown = false;
  }

  get patientTreatments(): Treatment[] {
    if (!this.paymentForm.patientId) return [];
    return this.treatments.filter(t => t.patientId === this.paymentForm.patientId);
  }

  getPatientName(patientId: number): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
  }

  getBillingForPatient(patientId: number): Billing {
    // This will need to be handled asynchronously in the template
    // For now, return a default billing object
    const patientPayments = this.payments.filter(p => p.patientId === patientId);
    const totalAmount = patientPayments.reduce((sum, p) => sum + p.amount, 0);
    const paidAmount = patientPayments
      .filter(p => p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);
    
    return {
      patientId,
      totalAmount,
      paidAmount,
      pendingAmount: totalAmount - paidAmount,
      payments: patientPayments
    };
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingPayment = null;
    this.patientSearchTerm = '';
    this.showPatientDropdown = false;
  }
}
