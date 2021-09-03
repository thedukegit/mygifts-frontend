import { Injectable } from '@angular/core';

import { select, Store, Action } from '@ngrx/store';

import * as fromGifts from './gifts.reducer';
import * as GiftsSelectors from './gifts.selectors';

@Injectable()
export class GiftsFacade {
  loaded$ = this.store.pipe(select(GiftsSelectors.getGiftsLoaded));
  allGifts$ = this.store.pipe(select(GiftsSelectors.getAllGifts));
  selectedGifts$ = this.store.pipe(select(GiftsSelectors.getSelected));

  constructor(private store: Store<fromGifts.GiftsPartialState>) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
