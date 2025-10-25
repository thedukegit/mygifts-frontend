import * as admin from 'firebase-admin';
import { Connection, createConnection } from 'mysql2/promise';
import { MigrationConfig } from '../types';

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
      const serviceAccount = require(config.firebase.serviceAccountPath);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: config.firebase.projectId,
      });
    }

    // Configure for emulator if needed
    if (config.migration.target === 'emulator' && config.migration.emulatorHost) {
      process.env.FIRESTORE_EMULATOR_HOST = config.migration.emulatorHost;
      console.log(`✓ Using Firestore emulator at ${config.migration.emulatorHost}`);
    }

    firestoreInstance = admin.firestore();
    console.log('✓ Connected to Firestore');
    
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

