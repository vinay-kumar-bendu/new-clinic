import { Patient } from './patient.model';

export interface Treatment {
  id: number;
  patientId: number;
  patient?: Patient;
  appointmentId?: number;
  treatmentDate: string;
  toothNumber?: string; // e.g., "12", "21-25"
  treatmentType: 'Cleaning' | 'Filling' | 'Root Canal' | 'Extraction' | 'Crown' | 'Bridge' | 'Implant' | 'Orthodontic' | 'Whitening' | 'Other';
  description: string;
  diagnosis: string;
  procedure: string;
  notes: string;
  nextVisitDate?: string;
  createdAt: string;
}





