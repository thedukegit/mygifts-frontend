import { Gift } from './gift.interface';
import { ListComponentBusiness } from './list.component.business';
import { GiftRepository } from './repositories/gift-repository.interface';

// Mock GiftRepository
class MockGiftRepository implements GiftRepository {
  public _gifts: Gift[] = [];
  getAll = jest.fn(async () => this._gifts);
  add = jest.fn(async (gift: Omit<Gift, 'id'>) => {
    const newGift = { ...gift, id: 'mock-id-' + (this._gifts.length + 1) };
    this._gifts.push(newGift);
  });
}

// Mock MatDialog
class MockDialog {
  open = jest.fn(() => ({
    afterClosed: () => ({
      subscribe: (cb: (result: any) => void) => {
        // Simulate dialog closed with a result
        setTimeout(() => cb({ name: 'New Gift', description: 'desc', price: 10, imageUrl: 'img' }), 0);
      },
    }),
  }));
}

describe('ListComponentBusiness', () => {
  let business: ListComponentBusiness;
  let giftRepository: MockGiftRepository;
  let dialog: MockDialog;

  beforeEach(async () => {
    giftRepository = new MockGiftRepository();
    dialog = new MockDialog();
    business = new ListComponentBusiness(giftRepository as any, dialog as any);
    // Pre-populate gifts
    giftRepository._gifts = [
      { id: '1', name: 'A', description: 'desc', price: 20, imageUrl: 'img' },
      { id: '2', name: 'B', description: 'desc', price: 10, imageUrl: 'img' },
    ];
    await business.init();
  });

  it('should initialize with gifts from repository', async () => {
    expect(business['gifts'].length).toBe(2);
  });

  it('should sort gifts by name ascending', () => {
    business.sortBy = 'name';
    business.sortDirection = 'asc';
    const sorted = business.sortedGifts;
    expect(sorted[0].name).toBe('A');
    expect(sorted[1].name).toBe('B');
  });

  it('should sort gifts by name descending', () => {
    business.sortBy = 'name';
    business.sortDirection = 'desc';
    const sorted = business.sortedGifts;
    expect(sorted[0].name).toBe('B');
    expect(sorted[1].name).toBe('A');
  });

  it('should sort gifts by price ascending', () => {
    business.sortBy = 'price';
    business.sortDirection = 'asc';
    const sorted = business.sortedGifts;
    expect(sorted[0].price).toBe(10);
    expect(sorted[1].price).toBe(20);
  });

  it('should sort gifts by price descending', () => {
    business.sortBy = 'price';
    business.sortDirection = 'desc';
    const sorted = business.sortedGifts;
    expect(sorted[0].price).toBe(20);
    expect(sorted[1].price).toBe(10);
  });

  it('setSort toggles direction if same sortBy', () => {
    business.sortBy = 'name';
    business.sortDirection = 'asc';
    business.setSort('name');
    expect(business.sortDirection).toBe('desc');
    business.setSort('name');
    expect(business.sortDirection).toBe('asc');
  });

  it('setSort changes sortBy and resets direction', () => {
    business.sortBy = 'name';
    business.sortDirection = 'desc';
    business.setSort('price');
    expect(business.sortBy).toBe('price');
    expect(business.sortDirection).toBe('asc');
  });

  it('toggleViewMode switches between list and grid', () => {
    business.viewMode = 'list';
    business.toggleViewMode();
    expect(business.viewMode).toBe('grid');
    business.toggleViewMode();
    expect(business.viewMode).toBe('list');
  });

  it('openAddGiftDialog adds a new gift when dialog returns a result', async () => {
    const initialCount = business['gifts'].length;
    await business.openAddGiftDialog();
    // Wait for dialog callback
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(giftRepository.add).toHaveBeenCalled();
    expect(business['gifts'].length).toBe(initialCount + 1);
  });

  it('openAddGiftDialog does not add a gift if dialog returns no result', async () => {
    // Patch dialog to return undefined
    dialog.open = jest.fn(() => ({
      afterClosed: () => ({
        subscribe: (cb: (result: any) => void) => {
          setTimeout(() => cb(undefined), 0);
        },
      }),
    }));
    const initialCount = business['gifts'].length;
    await business.openAddGiftDialog();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(giftRepository.add).not.toHaveBeenCalled();
    expect(business['gifts'].length).toBe(initialCount);
  });
}); 