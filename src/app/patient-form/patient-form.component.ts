import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient.model';

@Component({
  selector: 'app-patient-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.css'
})
export class PatientFormComponent implements OnInit {
  patientForm: FormGroup;
  isEditMode = false;
  patientId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.patientForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      emergencyContact: ['', Validators.required],
      emergencyPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      medicalHistory: [''],
      allergies: [''],
      insuranceProvider: [''],
      insuranceNumber: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.patientId = +id;
      this.loadPatient();
    }
  }

  loadPatient(): void {
    if (this.patientId) {
      this.patientService.getPatientById(this.patientId).subscribe({
        next: (patient) => {
          const dob = new Date(patient.dateOfBirth).toISOString().split('T')[0];
          this.patientForm.patchValue({ ...patient, dateOfBirth: dob });
        },
        error: (error) => console.error('Error loading patient:', error)
      });
    }
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      const patientData = this.patientForm.value;
      
      const operation = this.isEditMode && this.patientId
        ? this.patientService.updatePatient(this.patientId, patientData)
        : this.patientService.addPatient(patientData);
      
      operation.subscribe({
        next: () => this.router.navigate(['/patients']),
        error: (error) => {
          console.error('Error saving patient:', error);
          alert('Error saving patient. Please try again.');
        }
      });
    } else {
      this.patientForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/patients']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.patientForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least 2 characters`;
    }
    if (field?.hasError('pattern')) {
      return 'Please enter a valid 10-digit phone number';
    }
    return '';
  }
}
