import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, serverTimestamp, setDoc } from '@angular/fire/firestore';

export interface AppUserDocument {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
}
// @todo: introduce an interface just like with gifts and lists, so that we can use other storage solutions as well, like indexedDb
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);

  async upsertCurrentUserDoc(partial?: Partial<AppUserDocument>): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('User is not authenticated.');
    }
    const userDocRef = doc(this.firestore, 'users', currentUser.uid);
    const base: AppUserDocument = {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: (currentUser as any).displayName ?? null,
      photoURL: (currentUser as any).photoURL ?? null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(userDocRef, { ...base, ...partial, updatedAt: serverTimestamp() }, { merge: true });
  }
}


