import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { StorageSolution } from './interfaces/storage-solution.enum';
import { createFriendRepositoryProvider, createGiftRepositoryProvider } from './tokens/repository-tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),

    // In production always initialize Firebase; otherwise only for Firestore/Emulator
    ...((environment.production ||
      environment.storageSolution === StorageSolution.Firestore ||
      environment.storageSolution === StorageSolution.FirestoreEmulator)
      ? [
          provideFirebaseApp(() => initializeApp(environment.firebase)),
          provideAuth(() => {
            const auth = getAuth();
            if (environment.storageSolution === StorageSolution.FirestoreEmulator) {
              connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
            }
            return auth;
          }),
          provideFirestore(() => {
            const firestore = getFirestore();
            if (environment.storageSolution === StorageSolution.FirestoreEmulator) {
              connectFirestoreEmulator(firestore, 'localhost', 8080);
            }
            return firestore;
          }),
        ]
      : []),

    // Dynamic repository providers
    createGiftRepositoryProvider(),
    createFriendRepositoryProvider(),
  ],
};
