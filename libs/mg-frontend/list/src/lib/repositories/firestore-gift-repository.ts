import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, deleteDoc, deleteField, doc, Firestore, getDocs, Timestamp, updateDoc } from '@angular/fire/firestore';
import { GiftRepository } from '../gift-repository.interface';
import { Gift } from '../gift.interface';
import { DefaultImageService } from '../services/default-image.service';

@Injectable()
export class FirestoreGiftRepository implements GiftRepository {
  constructor(private firestore: Firestore, private auth: Auth) {}

  private getUserGiftsCollection() {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('User is not authenticated.');
    }
    return collection(this.firestore, 'users', currentUser.uid, 'gifts');
  }

  private convertTimestamps(data: any): Gift {
    // Convert Firestore Timestamps to JavaScript Dates
    if (data.purchasedAt && data.purchasedAt instanceof Timestamp) {
      data.purchasedAt = data.purchasedAt.toDate();
    }
    return data as Gift;
  }

  async getAll(): Promise<Gift[]> {
    const giftsCollection = this.getUserGiftsCollection();
    const snapshot = await getDocs(giftsCollection);
    return snapshot.docs.map((doc) => this.convertTimestamps({ id: doc.id, ...doc.data() }));
  }

  async getByUserId(userId: string): Promise<Gift[]> {
    const giftsCollection = collection(this.firestore, 'users', userId, 'gifts');
    const snapshot = await getDocs(giftsCollection);
    return snapshot.docs.map((doc) => this.convertTimestamps({ id: doc.id, ...doc.data() }));
  }

  async add(gift: Omit<Gift, 'id'>): Promise<void> {
    const newGift = {
      ...gift,
      imageUrl: DefaultImageService.ensureDefaultImage(gift.imageUrl),
    };

    const giftsCollection = this.getUserGiftsCollection();
    await addDoc(giftsCollection, newGift);
  }

  async update(id: string, gift: Partial<Gift>, userId?: string): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('User is not authenticated.');
    }
    const targetUserId = userId || currentUser.uid;
    const giftDoc = doc(this.firestore, 'users', targetUserId, 'gifts', id);
    
    // Convert undefined values to deleteField() for Firestore
    const updateData: any = {};
    for (const [key, value] of Object.entries(gift)) {
      updateData[key] = value === undefined ? deleteField() : value;
    }
    
    await updateDoc(giftDoc, updateData);
  }

  async delete(id: string): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('User is not authenticated.');
    }
    const giftDoc = doc(this.firestore, 'users', currentUser.uid, 'gifts', id);
    await deleteDoc(giftDoc);
  }
}
