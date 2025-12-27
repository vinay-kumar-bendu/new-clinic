export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory: string;
  allergies: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  createdAt: string;
  lastVisit?: string;
}





