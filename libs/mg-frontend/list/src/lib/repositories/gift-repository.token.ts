import { InjectionToken } from '@angular/core';
import { IGiftRepository } from './gift-repository.interface';

export const GIFT_REPOSITORY = new InjectionToken<IGiftRepository>(
  'GIFT_REPOSITORY'
);
