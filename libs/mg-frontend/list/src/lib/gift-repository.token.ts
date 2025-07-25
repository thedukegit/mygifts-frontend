import { InjectionToken } from '@angular/core';
import { GiftRepository } from './gift-repository.interface';

export const GIFT_REPOSITORY = new InjectionToken<GiftRepository>(
  'GIFT_REPOSITORY'
);
