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

    console.log('REGISTER submit clicked');
    console.log('REGISTER payload', {
      name: this.name,
      email: this.email,
      passwordLength: this.password.length
    });

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
        console.error('REGISTER error', err);
        this.errorMessage = err?.error?.message || 'Registration failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}