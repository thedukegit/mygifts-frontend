import Dexie, { Table } from 'dexie';
import { Gift } from '../gift.interface';

export class GiftDatabase extends Dexie {
  gifts!: Table<Gift, string>;

  constructor() {
    super('GiftDatabase');
    this.version(1).stores({
      gifts: 'id, name, description, price',
    });
  }
}
