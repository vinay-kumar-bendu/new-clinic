import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  showModal: boolean = false;
  changePasswordForm: FormGroup;
  addUserForm: FormGroup;
  passwordMessage = '';
  addUserMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(5)]],
      confirmNewPassword: ['', [Validators.required]]
    });

    this.addUserForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  // --- Password logic
  changePassword(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      this.passwordMessage = 'Please fill out all fields.';
      return;
    }
    const { currentPassword, newPassword, confirmNewPassword } = this.changePasswordForm.value;
    
    if (newPassword !== confirmNewPassword) {
      this.passwordMessage = 'New passwords do not match.';
      return;
    }
    if (currentPassword === newPassword) {
      this.passwordMessage = 'New password must be different from current password.';
      return;
    }
    
    // Get username from auth storage
    const authData = localStorage.getItem('dental_auth');
    const username = authData ? JSON.parse(authData).username : 'admin';
    
    this.authService.updateCredentials(username, currentPassword, newPassword).subscribe({
      next: () => {
        this.passwordMessage = 'Password updated successfully!';
        this.changePasswordForm.reset();
      },
      error: (error) => {
        console.error('Error updating password:', error);
        this.passwordMessage = error.error?.message || 'Error updating password. Please try again.';
      }
    });
  }

  // --- Add user logic
  addUser(): void {
    if (this.addUserForm.invalid) {
      this.addUserForm.markAllAsTouched();
      this.addUserMessage = 'Please fill out all fields.';
      return;
    }
    const { username, password, confirmPassword } = this.addUserForm.value;
    if (password !== confirmPassword) {
      this.addUserMessage = 'Passwords do not match.';
      return;
    }
    
    this.authService.addUser(username, password).subscribe({
      next: () => {
        this.addUserMessage = 'User added successfully!';
        this.addUserForm.reset();
      },
      error: (error) => {
        console.error('Error adding user:', error);
        this.addUserMessage = error.error?.message || 'Error adding user. Please try again.';
      }
    });
  }

  show(): void { this.showModal = true; }
  close(): void { this.showModal = false;
    this.passwordMessage = ''; this.addUserMessage = '';
  }
}
