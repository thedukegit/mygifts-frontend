/**
 * Type definitions for the migration tool
 */

export interface MigrationConfig {
  sql: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  firebase: {
    serviceAccountPath: string;
    projectId: string;
  };
  migration: {
    batchSize: number;
    dryRun: boolean;
    target: 'emulator' | 'production';
    emulatorHost?: string;
  };
}

export interface SqlUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  passwordHash?: string;
  passwordSalt?: string;
  emailVerified?: boolean;
  createdAt?: Date;
}

export interface SqlGift {
  id: string;
  userId: string;
  name: string;
  description?: string;
  price?: number;
  quantity?: number;
  imageUrl?: string;
  link?: string;
  purchased?: boolean;
  purchasedBy?: string;
  purchasedByName?: string;
  purchasedAt?: Date;
}

export interface SqlFriendship {
  id?: string;
  userId: string;
  friendId: string;
  createdAt?: Date;
}

export interface FirestoreUser {
  uid: string;
  email: string | null;
  firstName?: string | null;
  lastName?: string | null;
  photoURL?: string | null;
  createdAt?: FirebaseFirestore.Timestamp;
  updatedAt?: FirebaseFirestore.Timestamp;
}

export interface FirestoreGift {
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

export interface FirestoreFriend {
  id: string;
  name: string;
  email: string;
}

export interface MigrationStats {
  usersProcessed: number;
  usersSucceeded: number;
  usersFailed: number;
  giftsProcessed: number;
  giftsSucceeded: number;
  giftsFailed: number;
  friendshipsProcessed: number;
  friendshipsSucceeded: number;
  friendshipsFailed: number;
  errors: Array<{ entity: string; error: string }>;
}

