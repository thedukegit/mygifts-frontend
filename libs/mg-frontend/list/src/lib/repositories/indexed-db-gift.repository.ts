import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Gift } from '../gift.interface';
import { BaseGiftRepository } from './base-gift.repository';
import { GiftDatabase } from '../services/gift.database';

@Injectable()
export class IndexedDBGiftRepository extends BaseGiftRepository {
  private db: GiftDatabase;

  constructor() {
    super();
    this.db = new GiftDatabase();
  }

  async getAll(): Promise<Gift[]> {
    return this.db.gifts.toArray();
  }

  protected async addGift(gift: Omit<Gift, 'id'>): Promise<void> {
    const newGift: Gift = { ...gift, id: uuidv4() };
    await this.db.gifts.add(newGift);
  }
}
