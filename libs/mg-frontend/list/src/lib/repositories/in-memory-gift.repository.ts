import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Gift } from '../gift.interface';
import { BaseGiftRepository } from './base-gift.repository';

@Injectable()
export class InMemoryGiftRepository extends BaseGiftRepository {
  private gifts: Gift[] = [
    {
      id: uuidv4(),
      name: 'Wireless Headphones',
      description:
        'Premium noise-cancelling wireless headphones with 30-hour battery life',
      price: 199.99,
      imageUrl:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D',
    },
    // ... other initial gifts
  ];

  async getAll(): Promise<Gift[]> {
    return Promise.resolve(this.gifts);
  }

  protected async addGift(gift: Omit<Gift, 'id'>): Promise<void> {
    const newGift: Gift = { ...gift, id: uuidv4() };
    this.gifts.push(newGift);
    return Promise.resolve();
  }
}
