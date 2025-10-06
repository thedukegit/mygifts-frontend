import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  template: `
    <div class="container">
      <mat-card>
        <h2>Verify your email</h2>
        <p>
          We sent a verification link to your email. Click the link, then come back and press
          "I've verified".
        </p>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="onResend()" [disabled]="loading">
            Resend email
          </button>
          <button mat-button (click)="onRefresh()" [disabled]="loading">
            I've verified
          </button>
          <button mat-button routerLink="/login">Back to login</button>
        </div>
        <p class="msg error" *ngIf="errorMessage">{{ errorMessage }}</p>
        <p class="msg info" *ngIf="infoMessage">{{ infoMessage }}</p>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 16px;
      }
      mat-card {
        width: 420px;
        padding: 16px;
      }
      .actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }
      .msg.error { color: #b00020; }
      .msg.info { color: #0b6e4f; }
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



