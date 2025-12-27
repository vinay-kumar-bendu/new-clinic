import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { AppointmentService } from '../services/appointment.service';
import { TreatmentService } from '../services/treatment.service';
import { PaymentService } from '../services/payment.service';
import { Patient } from '../models/patient.model';
import { Appointment } from '../models/appointment.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalPatients: number = 0;
  todayAppointments: Appointment[] = [];
  upcomingAppointments: Appointment[] = [];
  totalRevenue: number = 0;
  recentPatients: Patient[] = [];
  
  currentDate: Date = new Date();
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();
  calendarDays: (Date | null)[] = [];
  monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private treatmentService: TreatmentService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  appointments: Appointment[] = [];

  ngOnInit(): void {
    this.generateCalendar();
    this.loadDashboardData();
    
    // Subscribe to appointment changes to update calendar
    this.appointmentService.appointments$.subscribe((appointments) => {
      this.appointments = appointments;
      this.loadDashboardData();
    });
  }

  loadDashboardData(): void {
    this.patientService.getAllPatients().subscribe({
      next: (patients) => {
        this.totalPatients = patients.length;
        this.recentPatients = patients.slice(-5).reverse();
      },
      error: (error) => console.error('Error loading patients:', error)
    });

    this.appointmentService.getAllAppointments().subscribe({
      next: (appointments) => {
        const today = new Date().toISOString().split('T')[0];
        this.todayAppointments = appointments
          .filter(a => a.appointmentDate === today && a.status === 'Scheduled')
          .slice(0, 5);

        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        this.upcomingAppointments = appointments
          .filter(a => {
            const aptDate = new Date(a.appointmentDate);
            return aptDate > new Date() && aptDate <= futureDate && a.status === 'Scheduled';
          })
          .slice(0, 5);
      },
      error: (error) => console.error('Error loading appointments:', error)
    });

    this.paymentService.getAllPayments().subscribe({
      next: (payments) => {
        this.totalRevenue = payments
          .filter(p => p.status === 'Paid')
          .reduce((sum, p) => sum + p.amount, 0);
      },
      error: (error) => console.error('Error loading payments:', error)
    });
  }

  getPatientName(patientId: number): string {
    // This is used in template, so we'll need to handle it differently
    // For now, return a placeholder - the actual name should come from the appointment data
    return 'Loading...';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  generateCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    this.calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      this.calendarDays.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      this.calendarDays.push(new Date(this.currentYear, this.currentMonth, day));
    }
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  hasAppointment(date: Date | null): boolean {
    if (!date) return false;
    const dateStr = date.toISOString().split('T')[0];
    return this.appointments.some(a => a.appointmentDate === dateStr && a.status === 'Scheduled');
  }

  getAppointmentCount(date: Date | null): number {
    if (!date) return 0;
    const dateStr = date.toISOString().split('T')[0];
    return this.appointments.filter(a => a.appointmentDate === dateStr && a.status === 'Scheduled').length;
  }

  previousMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.generateCalendar();
  }
}
