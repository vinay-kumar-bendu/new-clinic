import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';

@Component({
  selector: 'app-employee-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
      department: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.employeeId = +id;
      this.loadEmployee();
    }
  }

  loadEmployee(): void {
    if (this.employeeId) {
      const employee = this.employeeService.getEmployeeById(this.employeeId);
      if (employee) {
        this.employeeForm.patchValue(employee);
      }
    }
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employeeData = this.employeeForm.value;
      
      if (this.isEditMode && this.employeeId) {
        this.employeeService.updateEmployee(this.employeeId, employeeData);
      } else {
        this.employeeService.addEmployee(employeeData);
      }
      
      this.router.navigate(['/']);
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least 2 characters`;
    }
    if (field?.hasError('min')) {
      return 'Salary must be a positive number';
    }
    return '';
  }
}
