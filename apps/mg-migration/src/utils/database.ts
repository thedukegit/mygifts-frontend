import { Connection, createConnection } from 'mysql2/promise';
import { MigrationConfig } from '../types';

// Import firebase-admin - env vars should already be set in main.ts
import * as admin from 'firebase-admin';

/**
 * Database connection utilities
 */

let sqlConnection: Connection | null = null;
let firestoreInstance: FirebaseFirestore.Firestore | null = null;

export async function initializeSqlConnection(
  config: MigrationConfig
): Promise<Connection> {
  if (sqlConnection) {
    return sqlConnection;
  }

  try {
    sqlConnection = await createConnection({
      host: config.sql.host,
      port: config.sql.port,
      user: config.sql.user,
      password: config.sql.password,
      database: config.sql.database,
    });

    console.log('✓ Connected to SQL database');
    return sqlConnection;
  } catch (error) {
    console.error('✗ Failed to connect to SQL database:', error);
    throw error;
  }
}

export async function initializeFirebase(
  config: MigrationConfig
): Promise<FirebaseFirestore.Firestore> {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  try {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      if (config.migration.target === 'emulator') {
        // For emulator, we don't need credentials
        console.log(`✓ Using Firestore emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
        console.log(`✓ Using Auth emulator at ${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
        
        // Initialize with minimal config for emulator
        admin.initializeApp({
          projectId: config.firebase.projectId || 'demo-project',
        });
      } else {
        // For production, use service account credentials
        const serviceAccount = require(config.firebase.serviceAccountPath);
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: config.firebase.projectId,
        });
      }
    }

    firestoreInstance = admin.firestore();
    console.log('✓ Connected to Firestore');
    console.log(`  Project ID: ${admin.app().options.projectId}`);
    console.log(`  Emulator Host: ${process.env.FIRESTORE_EMULATOR_HOST || 'NOT SET'}`);
    
    return firestoreInstance;
  } catch (error) {
    console.error('✗ Failed to initialize Firebase:', error);
    throw error;
  }
}

export function getSqlConnection(): Connection {
  if (!sqlConnection) {
    throw new Error('SQL connection not initialized. Call initializeSqlConnection first.');
  }
  return sqlConnection;
}

export function getFirestore(): FirebaseFirestore.Firestore {
  if (!firestoreInstance) {
    throw new Error('Firestore not initialized. Call initializeFirebase first.');
  }
  return firestoreInstance;
}

export function getAuth(): admin.auth.Auth {
  return admin.auth();
}

export async function closeSqlConnection(): Promise<void> {
  if (sqlConnection) {
    await sqlConnection.end();
    sqlConnection = null;
    console.log('✓ Closed SQL connection');
  }
}

