import { GiftsEntity } from './gifts.models';
import { State, giftsAdapter, initialState } from './gifts.reducer';
import * as GiftsSelectors from './gifts.selectors';

describe('Gifts Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getGiftsId = (it) => it['id'];
  const createGiftsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as GiftsEntity);

  let state;

  beforeEach(() => {
    state = {
      gifts: giftsAdapter.setAll(
        [
          createGiftsEntity('PRODUCT-AAA'),
          createGiftsEntity('PRODUCT-BBB'),
          createGiftsEntity('PRODUCT-CCC'),
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('Gifts Selectors', () => {
    it('getAllGifts() should return the list of Gifts', () => {
      const results = GiftsSelectors.getAllGifts(state);
      const selId = getGiftsId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = GiftsSelectors.getSelected(state);
      const selId = getGiftsId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getGiftsLoaded() should return the current 'loaded' status", () => {
      const result = GiftsSelectors.getGiftsLoaded(state);

      expect(result).toBe(true);
    });

    it("getGiftsError() should return the current 'error' state", () => {
      const result = GiftsSelectors.getGiftsError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
