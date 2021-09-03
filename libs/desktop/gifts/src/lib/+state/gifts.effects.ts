import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as fromGifts from './gifts.reducer';
import * as GiftsActions from './gifts.actions';

@Injectable()
export class GiftsEffects {
  loadGifts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GiftsActions.loadGifts),
      fetch({
        run: (action) => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return GiftsActions.loadGiftsSuccess({ gifts: [] });
        },

        onError: (action, error) => {
          console.error('Error', error);
          return GiftsActions.loadGiftsFailure({ error });
        },
      })
    )
  );

  constructor(private actions$: Actions) {}
}
