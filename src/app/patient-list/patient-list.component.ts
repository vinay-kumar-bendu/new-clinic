import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient.model';

@Component({
  selector: 'app-patient-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css'
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  searchTerm: string = '';

  constructor(
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    this.patientService.patients$.subscribe(patients => {
      this.patients = patients;
    });
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (patients) => this.patients = patients,
      error: (error) => console.error('Error loading patients:', error)
    });
  }

  addPatient(): void {
    this.router.navigate(['/patients/new']);
  }

  editPatient(id: number): void {
    this.router.navigate(['/patients/edit', id]);
  }

  viewPatient(id: number): void {
    this.router.navigate(['/patients', id]);
  }

  deletePatient(id: number): void {
    if (confirm('Are you sure you want to delete this patient? This will also delete associated appointments, treatments, and payments.')) {
      this.patientService.deletePatient(id).subscribe({
        next: () => this.loadPatients(),
        error: (error) => console.error('Error deleting patient:', error)
      });
    }
  }

  get filteredPatients(): Patient[] {
    if (!this.searchTerm) return this.patients;
    const term = this.searchTerm.toLowerCase();
    return this.patients.filter(p => 
      p.firstName.toLowerCase().includes(term) ||
      p.lastName.toLowerCase().includes(term) ||
      p.phone.includes(term) ||
      p.email.toLowerCase().includes(term)
    );
  }

  getAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
