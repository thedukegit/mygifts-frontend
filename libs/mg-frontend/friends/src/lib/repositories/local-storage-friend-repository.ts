import { Injectable } from '@angular/core';
import { Gift } from '@mg-frontend/list';
import { v4 as uuidv4 } from 'uuid';
import { FriendRepository } from '../friend-repository.interface';
import { Friend } from '../friend.interface';

@Injectable()
export class LocalStorageFriendRepository implements FriendRepository {
  private readonly STORAGE_KEY = 'friends';

  async getAll(): Promise<Friend[]> {
    const storedFriends = localStorage.getItem(this.STORAGE_KEY);
    return Promise.resolve(storedFriends ? JSON.parse(storedFriends) : []);
  }

  async add(email: string): Promise<Friend> {
    const friends = await this.getAll();
    const newFriend: Friend = {
      id: uuidv4(),
      name: email.split('@')[0],
      email: email,
    };
    friends.push(newFriend);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(friends));
    return Promise.resolve(newFriend);
  }

  async delete(id: string): Promise<void> {
    const friends = await this.getAll();
    const updatedFriends = friends.filter((friend) => friend.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedFriends));
    return Promise.resolve();
  }

  async getFriendGifts(): Promise<Gift[]> {
    return Promise.resolve([]);
  }
}


