import { Friend } from './friend.interface';
import { Gift } from '@mg-frontend/list';

export interface FriendRepository {
  getAll(): Promise<Array<Friend>>;
  add(email: string): Promise<Friend>;
  delete(id: string): Promise<void>;
  getFriendGifts(friendId: string): Promise<Array<Gift>>;
}
