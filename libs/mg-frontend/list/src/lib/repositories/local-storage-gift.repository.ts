import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Gift } from '../gift.interface';
import { BaseGiftRepository } from './base-gift.repository';

@Injectable()
export class LocalStorageGiftRepository extends BaseGiftRepository {
  private readonly STORAGE_KEY = 'gifts';

  async getAll(): Promise<Gift[]> {
    const storedGifts = localStorage.getItem(this.STORAGE_KEY);
    return Promise.resolve(storedGifts ? JSON.parse(storedGifts) : []);
  }

  protected async addGift(gift: Omit<Gift, 'id'>): Promise<void> {
    const gifts = await this.getAll();
    const newGift: Gift = { ...gift, id: uuidv4() };
    gifts.push(newGift);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(gifts));
    return Promise.resolve();
  }
}
