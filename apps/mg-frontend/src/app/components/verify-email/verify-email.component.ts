import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div class="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 class="text-2xl font-semibold mb-2">Verify your email</h2>
        <p class="text-sm text-muted mb-4">We sent a verification link to your email. Click the link, then come back and press "I've verified".</p>
        <div class="flex flex-wrap items-center gap-2">
          <button class="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60" (click)="onResend()" [disabled]="loading">Resend email</button>
          <button class="inline-flex items-center rounded-lg border border-border bg-bg px-4 py-2 text-sm font-medium hover:bg-card disabled:opacity-60" (click)="onRefresh()" [disabled]="loading">I've verified</button>
          <a class="inline-flex items-center rounded-lg border border-border bg-bg px-4 py-2 text-sm font-medium hover:bg-card" routerLink="/login">Back to login</a>
        </div>
        <p class="text-sm text-red-500 mt-3" *ngIf="errorMessage">{{ errorMessage }}</p>
        <p class="text-sm text-green-600 mt-1" *ngIf="infoMessage">{{ infoMessage }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      /* Tailwind in template */
    `,
  ],
})
export class VerifyEmailComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  errorMessage = '';
  infoMessage = '';

  async onResend() {
    this.loading = true;
    this.errorMessage = '';
    try {
      await this.authService.sendVerificationEmail();
      this.infoMessage = 'Verification email resent.';
    } catch (e) {
      this.errorMessage = 'Could not resend verification email.';
    } finally {
      this.loading = false;
    }
  }

  async onRefresh() {
    this.loading = true;
    this.errorMessage = '';
    try {
      const verified = await this.authService.reloadCurrentUser();
      if (verified) {
        await this.router.navigate(['/list']);
      } else {
        this.infoMessage = 'Still not verified. Please check your email.';
      }
    } catch (e) {
      this.errorMessage = 'Could not refresh verification status.';
    } finally {
      this.loading = false;
    }
  }
}



