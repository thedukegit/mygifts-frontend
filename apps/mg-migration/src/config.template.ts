import * as path from 'path';
import { MigrationConfig } from './types';

/**
 * Migration configuration template
 * Uses environment variables for configuration
 * Set FIREBASE_SERVICE_ACCOUNT_PATH to an absolute path or path relative to workspace root
 * 
 * NOTE: This is a getter function so environment variables are read when accessed,
 * not when this module is imported
 */

// Helper to resolve paths - if not absolute, resolve relative to current working directory (workspace root)
function resolvePath(filePath: string): string {
  if (path.isAbsolute(filePath)) {
    return filePath;
  }
  // Assume relative to workspace root (where you run the command from)
  return path.resolve(process.cwd(), filePath);
}

// Use a getter so env vars are read when accessed, not at module load time
let _config: MigrationConfig | null = null;

export const config: MigrationConfig = {
  get sql() {
    return {
      host: process.env.SQL_HOST || 'localhost',
      port: parseInt(process.env.SQL_PORT || '3306', 10),
      user: process.env.SQL_USER || 'root',
      password: process.env.SQL_PASSWORD || '',
      database: process.env.SQL_DATABASE || 'mygifts',
    };
  },
  get firebase() {
    return {
      serviceAccountPath: resolvePath(
        process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
        'apps/mg-migration/serviceAccountKey.json'
      ),
      projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id',
    };
  },
  get migration() {
    return {
      batchSize: parseInt(process.env.BATCH_SIZE || '500', 10),
      dryRun: process.env.DRY_RUN === 'true',
      target: (process.env.MIGRATION_TARGET as 'emulator' | 'production') || 'emulator',
      emulatorHost: process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080',
    };
  },
} as MigrationConfig;

