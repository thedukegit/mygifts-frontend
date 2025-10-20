export interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  link?: string;
  purchased?: boolean;
  purchasedBy?: string;
  purchasedByName?: string;
  purchasedAt?: Date;
}
