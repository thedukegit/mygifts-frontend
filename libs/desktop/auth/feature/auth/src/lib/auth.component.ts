import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountGateway } from '@mygifts/desktop/shared/data-access/gateways';
import { Message } from 'primeng/api';

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

  public constructor(private accountGateway: AccountGateway) {}

  public onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.accountGateway.signInWithPassword(email, password).subscribe(
      (response) => {
        this.error = [];
        console.log(response);
      },
      (errorMessage) => {
        this.error = [];
        this.error.push({
          severity: 'error',
          summary: 'Error: ',
          detail: errorMessage,
        });
      }
    );
  }
}
