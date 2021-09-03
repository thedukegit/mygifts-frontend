import { createAction, props } from '@ngrx/store';
import { GiftsEntity } from './gifts.models';

export const loadGifts = createAction('[Gifts] Load Gifts');

export const loadGiftsSuccess = createAction(
  '[Gifts] Load Gifts Success',
  props<{ gifts: GiftsEntity[] }>()
);

export const loadGiftsFailure = createAction(
  '[Gifts] Load Gifts Failure',
  props<{ error: any }>()
);
