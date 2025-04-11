import { Gift } from '../gift.interface';
import { IGiftRepository } from './gift-repository.interface';

export abstract class BaseGiftRepository implements IGiftRepository {
  private readonly DEFAULT_GIFT_IMAGE =
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=60';

  abstract getAll(): Promise<Gift[]>;

  async add(gift: Omit<Gift, 'id'>): Promise<void> {
    const giftWithDefaultImage = {
      ...gift,
      imageUrl: gift.imageUrl || this.DEFAULT_GIFT_IMAGE,
    };
    return this.addGift(giftWithDefaultImage);
  }

  protected abstract addGift(gift: Omit<Gift, 'id'>): Promise<void>;
}
