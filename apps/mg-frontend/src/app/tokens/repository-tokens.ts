import { Provider } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { StorageSolution } from '../interfaces/storage-solution.enum';

// Gift Repository Providers
import { FirestoreGiftRepository, GIFT_REPOSITORY, IndexedDbGiftRepository, LocalStorageGiftRepository } from '@mg-frontend/list';

// Friend Repository Providers
import { FirestoreFriendRepository, FRIEND_REPOSITORY, IndexedDbFriendRepository, LocalStorageFriendRepository } from '@mg-frontend/friends';

export function createGiftRepositoryProvider(): Provider {
  const storageSolutions: Record<StorageSolution, Provider> = {
    [StorageSolution.LocalStorage]: {
      provide: GIFT_REPOSITORY,
      useClass: LocalStorageGiftRepository,
    },
    [StorageSolution.IndexedDb]: {
      provide: GIFT_REPOSITORY,
      useClass: IndexedDbGiftRepository,
    },
    [StorageSolution.Firestore]: {
      provide: GIFT_REPOSITORY,
      useFactory: (firestore: Firestore, auth: Auth) => new FirestoreGiftRepository(firestore, auth),
      deps: [Firestore, Auth],
    },
    [StorageSolution.FirestoreEmulator]: {
      provide: GIFT_REPOSITORY,
      useFactory: (firestore: Firestore, auth: Auth) => new FirestoreGiftRepository(firestore, auth),
      deps: [Firestore, Auth],
    },
  };
  return environment.production ? storageSolutions[StorageSolution.Firestore] : storageSolutions[environment.storageSolution];
}

export function createFriendRepositoryProvider(): Provider {

  const storageSolutions: Record<StorageSolution, Provider> = {
    [StorageSolution.LocalStorage]: {
      provide: FRIEND_REPOSITORY,
      useClass: LocalStorageFriendRepository,
    },
    [StorageSolution.IndexedDb]: {
      provide: FRIEND_REPOSITORY,
      useClass: IndexedDbFriendRepository,
    },
    [StorageSolution.Firestore]: {
      provide: FRIEND_REPOSITORY,
      useFactory: (firestore: Firestore, auth: Auth) => new FirestoreFriendRepository(firestore, auth),
      deps: [Firestore, Auth],
    },
    [StorageSolution.FirestoreEmulator]: {
      provide: FRIEND_REPOSITORY,
      useFactory: (firestore: Firestore, auth: Auth) => new FirestoreFriendRepository(firestore, auth),
      deps: [Firestore, Auth],
    },
  };
  return environment.production ? storageSolutions[StorageSolution.Firestore] : storageSolutions[environment.storageSolution];
}
