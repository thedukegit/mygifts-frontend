import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  loading = false;
  errorMessage = '';
  successMessage = '';

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    const { email } = this.form.getRawValue();
    try {
      await this.authService.sendPasswordReset(email as string);
      this.successMessage = 'Password reset email sent. Please check your inbox.';
    } catch (err: unknown) {
      this.errorMessage = 'Failed to send reset email. Please check your email address.';
    } finally {
      this.loading = false;
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}

