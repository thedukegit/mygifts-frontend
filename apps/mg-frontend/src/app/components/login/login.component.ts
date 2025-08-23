import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  loading = false;
  errorMessage = '';

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    const { email, password } = this.form.getRawValue();
    try {
      await this.authService.signIn(email as string, password as string);
      await this.router.navigate(['/list']);
    } catch (err: unknown) {
      this.errorMessage = 'Sign in failed. Please check your credentials.';
    } finally {
      this.loading = false;
    }
  }

  async onSignUp() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    const { email, password } = this.form.getRawValue();
    try {
      await this.authService.signUp(email as string, password as string);
      await this.router.navigate(['/list']);
    } catch (err: unknown) {
      this.errorMessage = 'Sign up failed. Try a different email or password.';
    } finally {
      this.loading = false;
    }
  }
}


