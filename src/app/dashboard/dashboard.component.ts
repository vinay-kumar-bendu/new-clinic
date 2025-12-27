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
  selectedCalendarDate: Date | null = null;
  showAppointmentModal: boolean = false;
  appointmentsForSelectedDate: Appointment[] = [];

  ngOnInit(): void {
    this.generateCalendar();
    
    // Subscribe to data from BehaviorSubjects (no API calls, uses cached data)
    this.patientService.patients$.subscribe({
      next: (patients) => {
        this.totalPatients = patients.length;
        this.recentPatients = patients.slice(-5).reverse();
      },
      error: (error) => console.error('Error loading patients:', error)
    });

    this.appointmentService.appointments$.subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        
        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];
        
        // Normalize appointment dates and filter for today
        this.todayAppointments = appointments
          .filter(a => {
            if (!a.appointmentDate || a.status !== 'Scheduled') return false;
            // Normalize date format - handle both ISO strings and date strings
            const aptDate = new Date(a.appointmentDate);
            aptDate.setHours(0, 0, 0, 0);
            const aptDateStr = aptDate.toISOString().split('T')[0];
            return aptDateStr === todayStr;
          })
          .slice(0, 5)
          .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime));

        // Filter upcoming appointments (next 7 days)
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        futureDate.setHours(23, 59, 59, 999);
        
        this.upcomingAppointments = appointments
          .filter(a => {
            if (!a.appointmentDate || a.status !== 'Scheduled') return false;
            const aptDate = new Date(a.appointmentDate);
            aptDate.setHours(0, 0, 0, 0);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            return aptDate > todayDate && aptDate <= futureDate;
          })
          .slice(0, 5)
          .sort((a, b) => {
            const dateCompare = new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime();
            if (dateCompare !== 0) return dateCompare;
            return a.appointmentTime.localeCompare(b.appointmentTime);
          });
        
        // Regenerate calendar to show updated appointments
        this.generateCalendar();
      },
      error: (error) => console.error('Error loading appointments:', error)
    });

    this.paymentService.payments$.subscribe({
      next: (payments) => {
        this.totalRevenue = payments
          .filter(p => p.status === 'Paid')
          .reduce((sum, p) => sum + p.amount, 0);
      },
      error: (error) => console.error('Error loading payments:', error)
    });
  }

  getPatientName(patientId: number, appointment?: Appointment): string {
    // First try to get from appointment.patient if available
    if (appointment?.patient) {
      return `${appointment.patient.firstName} ${appointment.patient.lastName}`;
    }
    // Fallback: search in appointments for patient data
    const apt = this.appointments.find(a => a.patientId === patientId && a.patient);
    if (apt?.patient) {
      return `${apt.patient.firstName} ${apt.patient.lastName}`;
    }
    return 'Unknown Patient';
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
    return this.appointments.some(a => {
      if (!a.appointmentDate) return false;
      // Normalize appointment date for comparison - handle ISO format
      const aptDate = new Date(a.appointmentDate);
      aptDate.setHours(0, 0, 0, 0);
      const aptDateStr = aptDate.toISOString().split('T')[0];
      return aptDateStr === dateStr;
    });
  }

  getAppointmentsForDate(date: Date | null): Appointment[] {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return this.appointments.filter(a => {
      if (!a.appointmentDate) return false;
      // Normalize appointment date for comparison - handle ISO format
      const aptDate = new Date(a.appointmentDate);
      aptDate.setHours(0, 0, 0, 0);
      const aptDateStr = aptDate.toISOString().split('T')[0];
      return aptDateStr === dateStr;
    });
  }

  getAppointmentCountForDate(date: Date | null): number {
    if (!date) return 0;
    return this.getAppointmentsForDate(date).length;
  }

  onCalendarDateClick(date: Date | null): void {
    if (!date) {
      console.log('Date is null, not opening modal');
      return;
    }
    
    console.log('Date clicked:', date);
    this.selectedCalendarDate = date;
    this.appointmentsForSelectedDate = this.getAppointmentsForDate(date);
    console.log('Appointments for date:', this.appointmentsForSelectedDate.length);
    console.log('Appointments:', this.appointmentsForSelectedDate);
    this.showAppointmentModal = true;
    console.log('Modal should be open:', this.showAppointmentModal);
    
    // Force change detection
    setTimeout(() => {
      console.log('Modal state after timeout:', this.showAppointmentModal);
    }, 100);
  }

  closeAppointmentModal(): void {
    this.showAppointmentModal = false;
    this.selectedCalendarDate = null;
    this.appointmentsForSelectedDate = [];
  }

  getFormattedDate(date: Date | null): string {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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

  formatTime(time: string): string {
    if (!time) return '';
    // Convert HH:mm:ss to HH:mm format for display
    return time.substring(0, 5);
  }
}
