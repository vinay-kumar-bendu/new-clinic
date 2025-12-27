import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreatmentService } from '../services/treatment.service';
import { PatientService } from '../services/patient.service';
import { Treatment } from '../models/treatment.model';
import { Patient } from '../models/patient.model';

@Component({
  selector: 'app-treatments',
  imports: [CommonModule, FormsModule],
  templateUrl: './treatments.component.html',
  styleUrl: './treatments.component.css'
})
export class TreatmentsComponent implements OnInit {
  treatments: Treatment[] = [];
  patients: Patient[] = [];
  selectedPatientId: number = 0;
  showForm = false;
  editingTreatment: Treatment | null = null;

  treatmentForm = {
    patientId: 0,
    appointmentId: 0,
    treatmentDate: new Date().toISOString().split('T')[0],
    toothNumber: '',
    treatmentType: 'Cleaning' as Treatment['treatmentType'],
    description: '',
    diagnosis: '',
    procedure: '',
    notes: '',
    nextVisitDate: ''
  };

  constructor(
    private treatmentService: TreatmentService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.treatmentService.treatments$.subscribe(treatments => {
      this.treatments = treatments;
    });
  }

  loadData(): void {
    this.treatmentService.getAllTreatments().subscribe({
      next: (treatments) => this.treatments = treatments,
      error: (error) => console.error('Error loading treatments:', error)
    });
    this.patientService.getAllPatients().subscribe({
      next: (patients) => this.patients = patients,
      error: (error) => console.error('Error loading patients:', error)
    });
  }

  get filteredTreatments(): Treatment[] {
    if (this.selectedPatientId === 0) return this.treatments;
    return this.treatments.filter(t => t.patientId === this.selectedPatientId);
  }

  openAddForm(): void {
    this.editingTreatment = null;
    this.treatmentForm = {
      patientId: this.selectedPatientId || 0,
      appointmentId: 0,
      treatmentDate: new Date().toISOString().split('T')[0],
      toothNumber: '',
      treatmentType: 'Cleaning',
      description: '',
      diagnosis: '',
      procedure: '',
      notes: '',
      nextVisitDate: ''
    };
    this.showForm = true;
  }

  openEditForm(treatment: Treatment): void {
    this.editingTreatment = treatment;
    const date = new Date(treatment.treatmentDate).toISOString().split('T')[0];
    const nextVisit = treatment.nextVisitDate ? new Date(treatment.nextVisitDate).toISOString().split('T')[0] : '';
    this.treatmentForm = {
      patientId: treatment.patientId,
      appointmentId: treatment.appointmentId || 0,
      treatmentDate: date,
      toothNumber: treatment.toothNumber || '',
      treatmentType: treatment.treatmentType,
      description: treatment.description,
      diagnosis: treatment.diagnosis,
      procedure: treatment.procedure,
      notes: treatment.notes,
      nextVisitDate: nextVisit
    };
    this.showForm = true;
  }

  saveTreatment(): void {
    const operation = this.editingTreatment
      ? this.treatmentService.updateTreatment(this.editingTreatment.id, this.treatmentForm)
      : this.treatmentService.addTreatment(this.treatmentForm);
    
    operation.subscribe({
      next: () => {
        this.showForm = false;
        this.editingTreatment = null;
      },
      error: (error) => {
        console.error('Error saving treatment:', error);
        alert('Error saving treatment. Please try again.');
      }
    });
  }

  deleteTreatment(id: number): void {
    if (confirm('Are you sure you want to delete this treatment record?')) {
      this.treatmentService.deleteTreatment(id).subscribe({
        next: () => this.loadData(),
        error: (error) => {
          console.error('Error deleting treatment:', error);
          alert('Error deleting treatment. Please try again.');
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
    this.editingTreatment = null;
  }
}
