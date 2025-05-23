import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Gift } from '../gift.interface';
import { GiftRepository } from './gift-repository.interface';
import { DefaultImageService } from '../services/default-image.service';

@Injectable()
export class LocalStorageGiftRepository implements GiftRepository {
  private readonly STORAGE_KEY = 'gifts';

  async getAll(): Promise<Gift[]> {
    const storedGifts = localStorage.getItem(this.STORAGE_KEY);
    return Promise.resolve(storedGifts ? JSON.parse(storedGifts) : []);
  }

  async add(gift: Omit<Gift, 'id'>): Promise<void> {
    const gifts = await this.getAll();
    const newGift: Gift = {
      ...gift,
      id: uuidv4(),
      imageUrl: DefaultImageService.ensureDefaultImage(gift.imageUrl),
    };
    gifts.push(newGift);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(gifts));
    return Promise.resolve();
  }
}
