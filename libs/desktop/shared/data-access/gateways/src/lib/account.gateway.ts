import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Account } from '../../../domains/src/lib/account.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AccountGateway {
  private accountResource: string =
    'https://identitytoolkit.googleapis.com/v1/accounts';
  public account = new BehaviorSubject<Account | null>(null);

  constructor(private http: HttpClient) {}

  public signInWithPassword(
    email: string,
    password: string
  ): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
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
        }),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const account = new Account(email, userId, token, expirationDate);
    this.account.next(account);
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
