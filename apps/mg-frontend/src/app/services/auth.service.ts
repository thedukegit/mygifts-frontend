// apps/mg-frontend/src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, reload, sendEmailVerification, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  user$ = user(this.auth);

  async signIn(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async signUp(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async signOut() {
    return await signOut(this.auth);
  }

  async sendVerificationEmail() {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user to verify');
    }
    await sendEmailVerification(currentUser);
  }

  async reloadCurrentUser() {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user to reload');
    }
    await reload(currentUser);
    return currentUser.emailVerified;
  }
}