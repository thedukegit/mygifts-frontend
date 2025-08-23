import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs } from '@angular/fire/firestore';
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

  async getAll(): Promise<Gift[]> {
    const giftsCollection = this.getUserGiftsCollection();
    const snapshot = await getDocs(giftsCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Gift));
  }

  async add(gift: Omit<Gift, 'id'>): Promise<void> {
    const newGift = {
      ...gift,
      imageUrl: DefaultImageService.ensureDefaultImage(gift.imageUrl),
    };

    const giftsCollection = this.getUserGiftsCollection();
    await addDoc(giftsCollection, newGift);
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
