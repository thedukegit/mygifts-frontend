import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  GIFTS_FEATURE_KEY,
  State,
  GiftsPartialState,
  giftsAdapter,
} from './gifts.reducer';

// Lookup the 'Gifts' feature state managed by NgRx
export const getGiftsState = createFeatureSelector<GiftsPartialState, State>(
  GIFTS_FEATURE_KEY
);

const { selectAll, selectEntities } = giftsAdapter.getSelectors();

export const getGiftsLoaded = createSelector(
  getGiftsState,
  (state: State) => state.loaded
);

export const getGiftsError = createSelector(
  getGiftsState,
  (state: State) => state.error
);

export const getAllGifts = createSelector(getGiftsState, (state: State) =>
  selectAll(state)
);

export const getGiftsEntities = createSelector(getGiftsState, (state: State) =>
  selectEntities(state)
);

export const getSelectedId = createSelector(
  getGiftsState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getGiftsEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
