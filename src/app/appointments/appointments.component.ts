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
    return this.appointments.filter(a => a.appointmentDate === this.selectedDate);
  }

  openAddForm(): void {
    this.editingAppointment = null;
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
    this.appointmentForm = {
      patientId: appointment.patientId,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      duration: appointment.duration,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes
    };
    this.showForm = true;
  }

  saveAppointment(): void {
    const operation = this.editingAppointment
      ? this.appointmentService.updateAppointment(this.editingAppointment.id, this.appointmentForm)
      : this.appointmentService.addAppointment(this.appointmentForm);
    
    operation.subscribe({
      next: () => {
        this.showForm = false;
        this.editingAppointment = null;
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

  getPatientName(patientId: number): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingAppointment = null;
  }
}
