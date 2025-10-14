// apps/mg-frontend/src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, reload, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
import { UserService } from './user.service';

// @todo: introduce an interface for the functions in this service, so that we can implement other authentication providers as well
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private userService = inject(UserService);
  user$ = user(this.auth);

  async signIn(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async signUp(email: string, password: string, firstName: string, lastName: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    
    // Update the user's display name if first and last names are provided
    if (cred.user ) {
      const displayName = `${firstName} ${lastName}`;
      await updateProfile(cred.user, { displayName });
    }
    
    await this.userService.upsertCurrentUserDoc();
    return cred;
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