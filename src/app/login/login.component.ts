import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  currentImageIndex: number = 0;

  // Dental-related images (using Unsplash URLs)
  dentalImages: string[] = [
    'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80',
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80',
    'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&q=80',
    'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // If already authenticated, redirect to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    // Start image carousel
    this.startImageCarousel();
  }

  startImageCarousel(): void {
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.dentalImages.length;
    }, 4000); // Change image every 4 seconds
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/']);
          } else {
            this.errorMessage = 'Invalid username or password';
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = 'Invalid username or password';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please enter both username and password';
    }
  }
}
