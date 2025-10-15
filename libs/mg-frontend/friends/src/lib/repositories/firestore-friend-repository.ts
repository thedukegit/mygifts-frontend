import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore, collection, doc,
  getDoc,
  getDocs,
  query,
  where,
  writeBatch
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
    const results: Friend[] = [];
    for (const d of snapshot.docs) {
      const friendUid = d.id;
      // Join basic profile info from users/{friendUid}
      try {
        const profileSnap = await getDoc(doc(this.firestore, 'users', friendUid));
        const data = profileSnap.data() as any;
        const fullName = data?.firstName && data?.lastName 
          ? `${data.firstName} ${data.lastName}` 
          : (data?.firstName || data?.lastName || friendUid);
        results.push({ id: friendUid, name: fullName, email: data?.email ?? '' });
      } catch {
        results.push({ id: friendUid, name: friendUid, email: '' });
      }
    }
    return results;
  }

  async add(email: string): Promise<Friend> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('User is not authenticated.');
    }

    // Find the friend's uid by email from users collection
    const usersCol = collection(this.firestore, 'users');
    const qUsers = query(usersCol, where('email', '==', email));
    const usersSnap = await getDocs(qUsers);
    const friendUid = usersSnap.docs[0]?.id;

    if (!friendUid) {
      throw new Error('FRIEND_NOT_FOUND');
    }
    if (friendUid === currentUser.uid) {
      throw new Error('CANNOT_ADD_SELF');
    }

    // Mirror two docs using a batch: A->B (requested), B->A (pending)
    const batch = writeBatch(this.firestore);
    const aToB = doc(this.firestore, 'users', currentUser.uid, 'friends', friendUid);
    const bToA = doc(this.firestore, 'users', friendUid, 'friends', currentUser.uid);
    batch.set(aToB, { status: 'requested', requestedBy: currentUser.uid });
    batch.set(bToA, { status: 'pending', requestedBy: currentUser.uid });
    await batch.commit();

    return { id: friendUid, name: email.split('@')[0], email } as Friend;
  }

  async delete(friendUid: string): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('User is not authenticated.');
    }
    const batch = writeBatch(this.firestore);
    const aToB = doc(this.firestore, 'users', currentUser.uid, 'friends', friendUid);
    const bToA = doc(this.firestore, 'users', friendUid, 'friends', currentUser.uid);
    batch.delete(aToB);
    batch.delete(bToA);
    await batch.commit();
  }

  async getFriendGifts(friendUid: string): Promise<Gift[]> {
    // Read gifts in friend's user scope
    const giftsCollection = collection(this.firestore, 'users', friendUid, 'gifts');
    const snapshot = await getDocs(giftsCollection);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Gift));
  }
}
