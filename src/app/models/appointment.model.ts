import { Patient } from './patient.model';

export interface Appointment {
  id: number;
  patientId: number;
  patient?: Patient;
  appointmentDate: string;
  appointmentTime: string;
  duration: number; // in minutes
  type: 'Consultation' | 'Cleaning' | 'Filling' | 'Root Canal' | 'Extraction' | 'Crown' | 'Orthodontic' | 'Emergency' | 'Follow-up' | 'Other';
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';
  notes: string;
  createdAt: string;
}





