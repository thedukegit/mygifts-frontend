import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Friend } from '../friend.interface';
import { FriendRepository } from '../friend-repository.interface';
import { FriendDatabase } from '../services/friend.database';
import { Gift } from '@mg-frontend/list';

@Injectable()
export class IndexedDbFriendRepository implements FriendRepository {
  private db: FriendDatabase;

  constructor() {
    this.db = new FriendDatabase();
  }

  async getAll(): Promise<Friend[]> {
    return this.db.friends.toArray();
  }

  async add(email: string): Promise<Friend> {
    const newFriend: Friend = {
      id: uuidv4(),
      name: email.split('@')[0], // Use part before @ as temporary name
      email: email,
    };
    await this.db.friends.add(newFriend);
    return newFriend;
  }

  async delete(id: string): Promise<void> {
    await this.db.friends.delete(id);
  }

  async getFriendGifts(): Promise<Gift[]> {
    // For now, return empty array as we'll implement this later
    return [];
  }
}
