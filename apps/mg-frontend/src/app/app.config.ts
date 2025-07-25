import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { createFriendRepositoryProvider, createGiftRepositoryProvider } from './tokens/repository-tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),

    // Only provide Firebase in production or when not using local repositories
    ...(environment.useLocalRepositories ? [] : [
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideFirestore(() => getFirestore()),
    ]),

    // Dynamic repository providers
    createGiftRepositoryProvider(),
    createFriendRepositoryProvider(),
  ],
};
