import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AccountGateway {
  private accountResource: string =
    'https://identitytoolkit.googleapis.com/v1/accounts';

  constructor(private http: HttpClient) {}

  public signInWithPassword(email: string, password: string): Observable<any> {
    return this.http
      .post(
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
          if (!err.error?.error?.message) {
            return throwError(errorMessage);
          }
          switch (err.error.error.message) {
            case 'INVALID_EMAIL':
              errorMessage = 'The email address was invalid';
              break;
            case 'EMAIL_NOT_FOUND':
              errorMessage = 'The email address was not found';
              break;
            case 'INVALID_PASSWORD':
              errorMessage = 'Invalid password';
              break;
            case 'USER_DISABLED':
              errorMessage = 'This account has been disabled';
              break;
          }
          return throwError(errorMessage);
        })
      );
  }
}
