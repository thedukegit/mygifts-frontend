import { Injectable } from '@angular/core';
import { Gift } from '../gift.interface';
import { GiftRepository } from '../gift-repository.interface';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs } from '@angular/fire/firestore';
import { DefaultImageService } from '../services/default-image.service';

@Injectable()
export class FirestoreGiftRepository implements GiftRepository {
  private readonly COLLECTION_NAME = 'gifts';

  constructor(private firestore: Firestore) {}

  async getAll(): Promise<Gift[]> {
    const giftsCollection = collection(this.firestore, this.COLLECTION_NAME);
    const snapshot = await getDocs(giftsCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Gift));
  }

  async add(gift: Omit<Gift, 'id'>): Promise<void> {
    const newGift = {
      ...gift,
      imageUrl: DefaultImageService.ensureDefaultImage(gift.imageUrl),
    };

    const giftsCollection = collection(this.firestore, this.COLLECTION_NAME);
    await addDoc(giftsCollection, newGift);
  }

  async delete(id: string): Promise<void> {
    const giftDoc = doc(this.firestore, this.COLLECTION_NAME, id);
    await deleteDoc(giftDoc);
  }
}
