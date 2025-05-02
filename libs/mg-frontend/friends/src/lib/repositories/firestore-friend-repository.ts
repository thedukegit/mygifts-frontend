import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Friend } from '../friend.interface';
import { FriendRepository } from '../friend-repository.interface';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from '@angular/fire/firestore';
import { Gift } from '@mg-frontend/list';

@Injectable()
export class FirestoreFriendRepository implements FriendRepository {
  private readonly COLLECTION_NAME = 'friends';

  constructor(private firestore: Firestore) {}

  async getAll(): Promise<Friend[]> {
    const friendsCollection = collection(this.firestore, this.COLLECTION_NAME);
    const snapshot = await getDocs(friendsCollection);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Friend)
    );
  }

  async add(email: string): Promise<Friend> {
    const newFriend: Omit<Friend, 'id'> = {
      name: email.split('@')[0], // Use part before @ as temporary name
      email: email,
    };

    const friendsCollection = collection(this.firestore, this.COLLECTION_NAME);
    const docRef = await addDoc(friendsCollection, newFriend);

    return {
      id: docRef.id,
      ...newFriend,
    };
  }

  async delete(id: string): Promise<void> {
    const friendDoc = doc(this.firestore, this.COLLECTION_NAME, id);
    await deleteDoc(friendDoc);
  }

  async getFriendGifts(friendId: string): Promise<Gift[]> {
    const giftsCollection = collection(this.firestore, 'gifts');
    const q = query(giftsCollection, where('friendId', '==', friendId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Gift));
  }
}
