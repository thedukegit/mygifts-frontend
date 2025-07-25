import { Provider } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';

// Gift Repository Providers
import { FirestoreGiftRepository, GIFT_REPOSITORY, LocalStorageGiftRepository } from '@mg-frontend/list';

// Friend Repository Providers
import { FirestoreFriendRepository, FRIEND_REPOSITORY, IndexedDbFriendRepository } from '@mg-frontend/friends';

export function createGiftRepositoryProvider(): Provider {
  if (environment.useLocalRepositories) {
    return {
      provide: GIFT_REPOSITORY,
      useClass: LocalStorageGiftRepository,
    };
  } else {
    return {
      provide: GIFT_REPOSITORY,
      useFactory: (firestore: Firestore) => new FirestoreGiftRepository(firestore),
      deps: [Firestore],
    };
  }
}

export function createFriendRepositoryProvider(): Provider {
  if (environment.useLocalRepositories) {
    return {
      provide: FRIEND_REPOSITORY,
      useClass: IndexedDbFriendRepository,
    };
  } else {
    return {
      provide: FRIEND_REPOSITORY,
      useFactory: (firestore: Firestore) => new FirestoreFriendRepository(firestore),
      deps: [Firestore],
    };
  }
}
