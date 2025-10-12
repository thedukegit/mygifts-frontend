import { Gift } from './gift.interface';

export interface GiftRepository {
  getAll(): Promise<Gift[]>;

  add(gift: Omit<Gift, 'id'>): Promise<void>;

  delete(id: string): Promise<void>;

  // Retrieve gifts for a specific user (cross-user view)
  getByUserId?(userId: string): Promise<Gift[]>;
}
