import { Patient } from './patient.model';
import { Treatment } from './treatment.model';

export interface Payment {
  id: number;
  patientId: number;
  patient?: Patient;
  treatmentId?: number;
  treatment?: Treatment;
  appointmentId?: number;
  paymentDate: string;
  amount: number;
  paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'Insurance' | 'Check' | 'Online';
  paymentType: 'Full Payment' | 'Partial Payment' | 'Deposit';
  description: string;
  status: 'Paid' | 'Pending' | 'Refunded';
  invoiceNumber: string;
  createdAt: string;
}

export interface Billing {
  patientId: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  payments: Payment[];
}





