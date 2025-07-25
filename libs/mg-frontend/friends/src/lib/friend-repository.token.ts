import { InjectionToken } from '@angular/core';
import { FriendRepository } from './friend-repository.interface';

export const FRIEND_REPOSITORY = new InjectionToken<FriendRepository>(
  'FRIEND_REPOSITORY'
);
