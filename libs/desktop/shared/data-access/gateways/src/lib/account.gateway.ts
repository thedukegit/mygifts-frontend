import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Account } from '../../../domains/src/lib/account.interface';

@Injectable({ providedIn: 'root' })
export class AccountGateway {
  private accountResource: string =
    'https://identitytoolkit.googleapis.com/v1/accounts';

  constructor(private http: HttpClient) {}

  public signInWithPassword(
    email: string,
    password: string
  ): Observable<Account> {
    return this.http
      .post<Account>(
        `${this.accountResource}:signInWithPassword?key=AIzaSyCS0pevxJiFspRAlGsEc2DrLi89vDDsDhw`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((err) => {
          let errorMessage = 'Un unknown error occurred';
          if (!err.error.error.message) {
            return throwError(new Error(errorMessage));
          }
          errorMessage = this.createSensibleMessage(err.error.error.message);
          return throwError(new Error(errorMessage));
        })
      );
  }

  private createSensibleMessage(message: string): string {
    let sensibleMessage: string = '';
    switch (message) {
      case 'INVALID_EMAIL':
        sensibleMessage = 'The email address was invalid';
        break;
      case 'EMAIL_NOT_FOUND':
        sensibleMessage = 'The email address was not found';
        break;
      case 'INVALID_PASSWORD':
        sensibleMessage = 'Invalid password';
        break;
      case 'USER_DISABLED':
        sensibleMessage = 'This account has been disabled';
        break;
    }
    return sensibleMessage;
  }
}
