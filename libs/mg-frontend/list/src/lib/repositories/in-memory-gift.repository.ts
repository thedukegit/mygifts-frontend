import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Gift } from '../gift.interface';
import { GiftRepository } from '../gift-repository.interface';
import { DefaultImageService } from '../services/default-image.service';

@Injectable()
export class InMemoryGiftRepository implements GiftRepository {

  private gifts: Gift[] = [];

  async getAll(): Promise<Gift[]> {
    return Promise.resolve(this.gifts);
  }

  public async add(gift: Omit<Gift, 'id'>): Promise<void> {
    const newGift: Gift = {
      ...gift,
      id: uuidv4(),
      imageUrl: DefaultImageService.ensureDefaultImage(gift.imageUrl),
    };
    this.gifts.push(newGift);
    return Promise.resolve();
  }
  
  public async delete(id: string): Promise<void> {
    this.gifts = this.gifts.filter(gift => gift.id !== id);
    return Promise.resolve();
  }
}
