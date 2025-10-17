import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Gift } from './gift.interface';

@Injectable({ providedIn: 'root' })
export class GiftRepository {
  private gifts: Gift[] = [
    {
      id: uuidv4(),
      name: 'Wireless Headphones',
      description:
        'Premium noise-cancelling wireless headphones with 30-hour battery life',
      price: 199.99,
      quantity: 1,
      imageUrl:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      id: uuidv4(),
      name: 'Smart Watch',
      description: 'Fitness tracker with heart rate monitor and GPS',
      price: 249.99,
      quantity: 1,
      imageUrl:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      id: uuidv4(),
      name: 'Coffee Maker',
      description: 'Programmable coffee maker with thermal carafe',
      price: 89.99,
      quantity: 1,
      imageUrl:
        'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNvZmZlZSUyMG1ha2VyfGVufDB8fDB8fHww',
    },
    {
      id: uuidv4(),
      name: 'Bluetooth Speaker',
      description: 'Portable waterproof speaker with 20-hour battery life',
      price: 129.99,
      quantity: 1,
      imageUrl:
        'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D',
    },
  ];

  public getAll(): Gift[] {
    return this.gifts;
  }

  public add(gift: Omit<Gift, 'id'>): void {
    const newGift: Gift = { ...gift, id: uuidv4() };
    this.gifts.push(newGift);
  }
}
