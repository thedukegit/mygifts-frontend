import { Gift } from '../gift.interface';

export interface GiftRepository {
  getAll(): Promise<Gift[]>;

  add(gift: Omit<Gift, 'id'>): Promise<void>;
}
