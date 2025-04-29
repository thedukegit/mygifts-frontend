import Dexie, { Table } from 'dexie';
import { Friend } from '../friend.interface';

export class FriendDatabase extends Dexie {
  friends!: Table<Friend, string>;

  constructor() {
    super('FriendDatabase');
    this.version(1).stores({
      friends: 'id, name, email',
    });
  }
}
