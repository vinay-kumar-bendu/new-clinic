import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../services/appointment.service';
import { PatientService } from '../services/patient.service';
import { Appointment } from '../models/appointment.model';
import { Patient } from '../models/patient.model';

@Component({
  selector: 'app-appointments',
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  patients: Patient[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0];
  showForm = false;
  editingAppointment: Appointment | null = null;
  patientSearchTerm: string = '';
  showPatientDropdown: boolean = false;

  appointmentForm = {
    patientId: 0,
    appointmentDate: '',
    appointmentTime: '',
    duration: 30,
    type: 'Consultation' as Appointment['type'],
    status: 'Scheduled' as Appointment['status'],
    notes: ''
  };

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.appointmentService.appointments$.subscribe(appointments => {
      this.appointments = appointments;
    });
  }

  loadData(): void {
    this.appointmentService.getAllAppointments().subscribe({
      next: (appointments) => this.appointments = appointments,
      error: (error) => console.error('Error loading appointments:', error)
    });
    this.patientService.getAllPatients().subscribe({
      next: (patients) => this.patients = patients,
      error: (error) => console.error('Error loading patients:', error)
    });
  }

  get appointmentsForDate(): Appointment[] {
    if (!this.selectedDate) return [];
    
    // Parse selected date using local timezone
    const selectedDate = new Date(this.selectedDate + 'T00:00:00');
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const selectedDay = selectedDate.getDate();
    
    return this.appointments
      .filter(a => {
        if (!a.appointmentDate) return false;
        
        // Parse appointment date and compare using local date components
        const aptDate = new Date(a.appointmentDate);
        const aptYear = aptDate.getFullYear();
        const aptMonth = aptDate.getMonth();
        const aptDay = aptDate.getDate();
        
        // Compare year, month, and day (ignore time and timezone)
        return aptYear === selectedYear && 
               aptMonth === selectedMonth && 
               aptDay === selectedDay;
      })
      .sort((a, b) => {
        // Sort by time
        const timeA = a.appointmentTime || '00:00:00';
        const timeB = b.appointmentTime || '00:00:00';
        return timeA.localeCompare(timeB);
      });
  }

  openAddForm(): void {
    this.editingAppointment = null;
    this.patientSearchTerm = '';
    this.showPatientDropdown = false;
    this.appointmentForm = {
      patientId: 0,
      appointmentDate: this.selectedDate,
      appointmentTime: '',
      duration: 30,
      type: 'Consultation',
      status: 'Scheduled',
      notes: ''
    };
    this.showForm = true;
  }

  openEditForm(appointment: Appointment): void {
    this.editingAppointment = appointment;
    
    // Normalize appointment date for date input (YYYY-MM-DD format)
    // Use local date components to avoid timezone issues
    let aptDate = '';
    if (appointment.appointmentDate) {
      const date = new Date(appointment.appointmentDate);
      // Use local date components to avoid timezone shift
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      aptDate = `${year}-${month}-${day}`;
    }
    
    // Normalize appointment time for time input (HH:mm format)
    const aptTime = appointment.appointmentTime ? appointment.appointmentTime.substring(0, 5) : '';
    
    this.appointmentForm = {
      patientId: appointment.patientId,
      appointmentDate: aptDate,
      appointmentTime: aptTime,
      duration: appointment.duration,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes || ''
    };
    this.showForm = true;
  }

  saveAppointment(): void {
    // Ensure date is in YYYY-MM-DD format without timezone conversion
    const formData = {
      ...this.appointmentForm,
      appointmentDate: this.appointmentForm.appointmentDate // Keep as YYYY-MM-DD string
    };
    
    const operation = this.editingAppointment
      ? this.appointmentService.updateAppointment(this.editingAppointment.id, formData)
      : this.appointmentService.addAppointment(formData);
    
    operation.subscribe({
      next: () => {
        this.showForm = false;
        this.editingAppointment = null;
        // Reload data to get updated appointments
        this.loadData();
      },
      error: (error) => {
        console.error('Error saving appointment:', error);
        alert('Error saving appointment. Please try again.');
      }
    });
  }

  deleteAppointment(id: number): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () => this.loadData(),
        error: (error) => {
          console.error('Error deleting appointment:', error);
          alert('Error deleting appointment. Please try again.');
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
        !this.filteredPatients.find(p => p.id === this.appointmentForm.patientId)) {
      this.appointmentForm.patientId = 0;
    }
  }

  onPatientSelect(patientId: number): void {
    this.appointmentForm.patientId = patientId;
    const selectedPatient = this.patients.find(p => p.id === patientId);
    if (selectedPatient) {
      this.patientSearchTerm = `${selectedPatient.firstName} ${selectedPatient.lastName}`;
    }
    this.showPatientDropdown = false;
  }

  getPatientName(patientId: number, appointment?: Appointment): string {
    // First try to get from appointment.patient if available
    if (appointment?.patient) {
      return `${appointment.patient.firstName} ${appointment.patient.lastName}`;
    }
    // Fallback: search in patients array
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingAppointment = null;
    this.patientSearchTerm = '';
    this.showPatientDropdown = false;
  }

  onDateChange(): void {
    // Force change detection when date changes
    // This ensures appointmentsForDate getter is re-evaluated
    console.log('Date changed to:', this.selectedDate);
  }

  goToToday(): void {
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.onDateChange();
  }

  formatTime(time: string): string {
    if (!time) return '';
    // Convert HH:mm:ss to HH:mm format for display
    return time.substring(0, 5);
  }
}
