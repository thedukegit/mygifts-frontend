import { GiftsEntity } from './gifts.models';
import * as GiftsActions from './gifts.actions';
import { State, initialState, reducer } from './gifts.reducer';

describe('Gifts Reducer', () => {
  const createGiftsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as GiftsEntity);

  beforeEach(() => {});

  describe('valid Gifts actions', () => {
    it('loadGiftsSuccess should return set the list of known Gifts', () => {
      const gifts = [
        createGiftsEntity('PRODUCT-AAA'),
        createGiftsEntity('PRODUCT-zzz'),
      ];
      const action = GiftsActions.loadGiftsSuccess({ gifts });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
