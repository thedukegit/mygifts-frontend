import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from '@angular/fire/firestore';
import { Gift } from '@mg-frontend/list';
import { FriendRepository } from '../friend-repository.interface';
import { Friend } from '../friend.interface';

@Injectable()
export class FirestoreFriendRepository implements FriendRepository {
  // @todo: use inject
  constructor(private firestore: Firestore, private auth: Auth) {}

  private getUserFriendsCollection() {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('User is not authenticated.');
    }
    return collection(this.firestore, 'users', currentUser.uid, 'friends');
  }

  async getAll(): Promise<Friend[]> {
    const friendsCollection = this.getUserFriendsCollection();
    const snapshot = await getDocs(friendsCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Friend));
  }

  async add(email: string): Promise<Friend> {
    const newFriend: Omit<Friend, 'id'> = {
      name: email.split('@')[0], // Use part before @ as temporary name
      email: email,
    };

    const friendsCollection = this.getUserFriendsCollection();
    const docRef = await addDoc(friendsCollection, newFriend);

    return {
      id: docRef.id,
      ...newFriend,
    };
  }

  async delete(id: string): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('User is not authenticated.');
    }
    const friendDoc = doc(this.firestore, 'users', currentUser.uid, 'friends', id);
    await deleteDoc(friendDoc);
  }

  async getFriendGifts(friendId: string): Promise<Gift[]> {
    // Gifts are already scoped under users/{uid}/gifts in the list module
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('User is not authenticated.');
    }
    const giftsCollection = collection(this.firestore, 'users', currentUser.uid, 'gifts');
    const snapshot = await getDocs(giftsCollection);
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as Gift))
      .filter((gift) => (gift as any).friendId === friendId);
  }
}
