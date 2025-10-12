import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { GiftRepository } from '../gift-repository.interface';
import { Gift } from '../gift.interface';
import { DefaultImageService } from '../services/default-image.service';
import { GiftDatabase } from '../services/gift.database';

@Injectable()
export class IndexedDbGiftRepository implements GiftRepository {
  private db: GiftDatabase;

  constructor() {
    this.db = new GiftDatabase();
  }

  async getAll(): Promise<Gift[]> {
    return this.db.gifts.toArray();
  }

  async add(gift: Omit<Gift, 'id'>): Promise<void> {
    const newGift: Gift = {
      ...gift,
      id: uuidv4(),
      imageUrl: DefaultImageService.ensureDefaultImage(gift.imageUrl),
    };
    await this.db.gifts.add(newGift);
  }

  async delete(id: string): Promise<void> {
    await this.db.gifts.delete(id);
  }

  async getByUserId(userId: string): Promise<Gift[]> {
    // IndexedDB is single-user; cross-user view returns empty
    return [];
  }
}
