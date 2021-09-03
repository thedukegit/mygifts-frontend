import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as GiftsActions from './gifts.actions';
import { GiftsEntity } from './gifts.models';

export const GIFTS_FEATURE_KEY = 'gifts';

export interface State extends EntityState<GiftsEntity> {
  selectedId?: string | number; // which Gifts record has been selected
  loaded: boolean; // has the Gifts list been loaded
  error?: string | null; // last known error (if any)
}

export interface GiftsPartialState {
  readonly [GIFTS_FEATURE_KEY]: State;
}

export const giftsAdapter: EntityAdapter<GiftsEntity> = createEntityAdapter<
  GiftsEntity
>();

export const initialState: State = giftsAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const giftsReducer = createReducer(
  initialState,
  on(GiftsActions.loadGifts, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(GiftsActions.loadGiftsSuccess, (state, { gifts }) =>
    giftsAdapter.setAll(gifts, { ...state, loaded: true })
  ),
  on(GiftsActions.loadGiftsFailure, (state, { error }) => ({ ...state, error }))
);

export function reducer(state: State | undefined, action: Action) {
  return giftsReducer(state, action);
}
