import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
  if (this.isLoading) return;
  
  // Client-side validation
  if (!this.email.includes('@')) {
    this.errorMessage = 'Please enter a valid email address.';
    return;
  }
  if (this.password.length < 8) {
    this.errorMessage = 'Password must be at least 8 characters.';
    return;
  }
  if (!this.name.trim()) {
    this.errorMessage = 'Please enter your name.';
    return;
  }


    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        console.log('REGISTER success', res);
        this.router.navigate(['/workspace']);
      },
      error: (err) => {
  this.isLoading = false;
  if (err.status === 400) {
    this.errorMessage = err.error?.message || 'Invalid details. Check your email and password.';
  } else if (err.status === 409) {
    this.errorMessage = 'Email already registered. Please login.';
  } else if (err.status === 0) {
    this.errorMessage = 'Cannot reach server. Please try again.';
  } else {
    this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
  }
}
    });
  }
}