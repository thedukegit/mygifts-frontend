import { MigrationConfig } from './types';

/**
 * Migration configuration template
 * Copy this file to config.ts and fill in your values
 * DO NOT commit config.ts with sensitive credentials
 */
export const config: MigrationConfig = {
  sql: {
    host: process.env.SQL_HOST || 'localhost',
    port: parseInt(process.env.SQL_PORT || '3306', 10),
    user: process.env.SQL_USER || 'root',
    password: process.env.SQL_PASSWORD || '',
    database: process.env.SQL_DATABASE || 'mygifts',
  },
  firebase: {
    serviceAccountPath:
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
      './serviceAccountKey.json',
    projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id',
  },
  migration: {
    batchSize: parseInt(process.env.BATCH_SIZE || '500', 10),
    dryRun: process.env.DRY_RUN === 'true',
    target: (process.env.MIGRATION_TARGET as 'emulator' | 'production') || 'emulator',
    emulatorHost: process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080',
  },
};

