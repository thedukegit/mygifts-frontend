import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Custom validator to check if passwords match
// This validator is applied to the confirmPassword control itself
export const confirmPasswordValidator = (passwordFieldName: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) {
      return null;
    }

    const password = control.parent.get(passwordFieldName);
    const confirmPassword = control;

    if (!password || !confirmPassword.value) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  };
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  loading = false;
  errorMessage = '';
  infoMessage = '';

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, confirmPasswordValidator('password')]],
  });

  get confirmPasswordControl() {
    return this.form.get('confirmPassword');
  }

  constructor() {
    // Add value change listeners to update validation when password changes
    this.form.get('password')?.valueChanges.subscribe(() => {
      this.form.get('confirmPassword')?.updateValueAndValidity({ emitEvent: false });
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const { email, firstName, lastName, password } = this.form.getRawValue();
    
    try {
      const cred = await this.authService.signUp(
        email as string, 
        password as string,
        firstName as string,
        lastName as string
      );
      
      if (cred.user) {
        await this.authService.sendVerificationEmail();
      }
      
      this.infoMessage = 'Verification email sent. Please check your inbox.';
      await this.router.navigate(['/verify-email']);
    } catch (err: unknown) {
      this.errorMessage = 'Sign up failed. Try a different email or password.';
    } finally {
      this.loading = false;
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}

