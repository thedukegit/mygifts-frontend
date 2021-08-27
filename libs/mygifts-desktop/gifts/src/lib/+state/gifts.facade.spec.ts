import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { GiftsEntity } from './gifts.models';
import { GiftsEffects } from './gifts.effects';
import { GiftsFacade } from './gifts.facade';

import * as GiftsSelectors from './gifts.selectors';
import * as GiftsActions from './gifts.actions';
import {
  GIFTS_FEATURE_KEY,
  State,
  initialState,
  reducer,
} from './gifts.reducer';

interface TestSchema {
  gifts: State;
}

describe('GiftsFacade', () => {
  let facade: GiftsFacade;
  let store: Store<TestSchema>;
  const createGiftsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as GiftsEntity);

  beforeEach(() => {});

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(GIFTS_FEATURE_KEY, reducer),
          EffectsModule.forFeature([GiftsEffects]),
        ],
        providers: [GiftsFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          NxModule.forRoot(),
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.get(Store);
      facade = TestBed.get(GiftsFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async (done) => {
      try {
        let list = await readFirst(facade.allGifts$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.dispatch(GiftsActions.loadGifts());

        list = await readFirst(facade.allGifts$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `loadGiftsSuccess` to manually update list
     */
    it('allGifts$ should return the loaded list; and loaded flag == true', async (done) => {
      try {
        let list = await readFirst(facade.allGifts$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.dispatch(
          GiftsActions.loadGiftsSuccess({
            gifts: [createGiftsEntity('AAA'), createGiftsEntity('BBB')],
          })
        );

        list = await readFirst(facade.allGifts$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(2);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });
  });
});
