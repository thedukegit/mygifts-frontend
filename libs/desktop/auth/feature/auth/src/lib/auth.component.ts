import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountGateway } from '@mygifts/desktop/shared/data-access/gateways';
import { Message } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'mg-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  public loginForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required]),
  });
  public error: Message[] = [];
  public isLoading: boolean = false;

  public constructor(
    private accountGateway: AccountGateway,
    private router: Router
  ) {}

  public onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }
    this.isLoading = true;
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.accountGateway.signInWithPassword(email, password).subscribe(
      () => {
        this.isLoading = false;
        this.navigateToGiftsPage();
      },
      (errorMessage) => {
        this.isLoading = false;
        this.resetErrors();
        this.setError(errorMessage);
      }
    );
  }

  private navigateToGiftsPage(): void {
    this.router.navigate(['gifts']);
  }

  private resetErrors(): void {
    this.error = [];
  }

  private setError(message: string): void {
    this.error.push({
      severity: 'error',
      summary: 'Error: ',
      detail: message,
    });
  }
}
