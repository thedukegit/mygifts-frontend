import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FeatureFlagsService } from '../../services/feature-flags.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly featureFlagsService = inject(FeatureFlagsService);

  loading = false;
  errorMessage = '';
  infoMessage = '';

  // Feature flag for create account
  get isCreateAccountEnabled(): boolean {
    return this.featureFlagsService.isEnabled('createAccount');
  }

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
      const cred = await this.authService.signIn(email as string, password as string);
      if (cred.user && cred.user.emailVerified) {
        await this.router.navigate(['/list']);
      } else {
        this.infoMessage = 'Please verify your email. We can resend the link.';
        await this.router.navigate(['/verify-email']);
      }
    } catch (err: unknown) {
      this.errorMessage = 'Sign in failed. Please check your credentials.';
    } finally {
      this.loading = false;
    }
  }

  navigateToRegister() {
    if (this.isCreateAccountEnabled) {
      this.router.navigate(['/register']);
    }
  }
}


