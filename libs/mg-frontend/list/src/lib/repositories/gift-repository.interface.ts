import { Gift } from '../gift.interface';

export interface IGiftRepository {
  getAll(): Promise<Gift[]>;

  add(gift: Omit<Gift, 'id'>): Promise<void>;
}
