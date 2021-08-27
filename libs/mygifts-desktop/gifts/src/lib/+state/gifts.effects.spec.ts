import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { GiftsEffects } from './gifts.effects';
import * as GiftsActions from './gifts.actions';

describe('GiftsEffects', () => {
  let actions: Observable<any>;
  let effects: GiftsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        GiftsEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.get(GiftsEffects);
  });

  describe('loadGifts$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: GiftsActions.loadGifts() });

      const expected = hot('-a-|', {
        a: GiftsActions.loadGiftsSuccess({ gifts: [] }),
      });

      expect(effects.loadGifts$).toBeObservable(expected);
    });
  });
});
