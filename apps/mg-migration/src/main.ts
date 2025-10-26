#!/usr/bin/env node

import { Command } from 'commander';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Check command-line arguments EARLY to determine which .env file to load
const targetArgIndex = process.argv.indexOf('--target');
const commandLineTarget = targetArgIndex !== -1 ? process.argv[targetArgIndex + 1] : null;
const hasDryRunFlag = process.argv.includes('--dry-run');

// Load the appropriate .env file based on target
const envFile = commandLineTarget === 'production' ? '.env.production' : '.env';
const envPath = path.resolve(process.cwd(), 'apps/mg-migration', envFile);
console.log(`📁 Loading environment from: ${envFile}`);
dotenv.config({ path: envPath });
dotenv.config(); // Fallback to root .env if it exists

// Override environment variables with command-line arguments if provided
if (commandLineTarget) {
  process.env.MIGRATION_TARGET = commandLineTarget;
}
if (hasDryRunFlag) {
  process.env.DRY_RUN = 'true';
}

// Set emulator environment variables BEFORE importing Firebase modules
// This is critical - must be done before any firebase-admin code loads
if (!process.env.MIGRATION_TARGET || process.env.MIGRATION_TARGET === 'emulator') {
  const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080';
  const authEmulatorHost = emulatorHost.replace('8080', '9099');
  
  process.env.FIRESTORE_EMULATOR_HOST = emulatorHost;
  process.env.FIREBASE_AUTH_EMULATOR_HOST = authEmulatorHost;
  
  console.log(`🔧 Emulator environment variables set:`);
  console.log(`   FIRESTORE_EMULATOR_HOST=${process.env.FIRESTORE_EMULATOR_HOST}`);
  console.log(`   FIREBASE_AUTH_EMULATOR_HOST=${process.env.FIREBASE_AUTH_EMULATOR_HOST}\n`);
} else {
  console.log(`🚀 Production mode: Connecting to real Firebase`);
  console.log(`   Project ID: ${process.env.FIREBASE_PROJECT_ID || 'from service account'}\n`);
}

// NOW import Firebase-related modules
import { config } from './config.template';
import { migrateBidirectionalFriends, migrateFriends } from './migrations/migrate-friends';
import { migrateGifts, migrateGiftsForUser } from './migrations/migrate-gifts';
import { importUsersWithPasswords, migrateUsers } from './migrations/migrate-users';
import { MigrationStats } from './types';
import { closeSqlConnection, initializeFirebase, initializeSqlConnection } from './utils/database';
import { logger } from './utils/logger';
import { sampleRecords, validateMigration } from './utils/validation';

const program = new Command();

program
  .name('mg-migration')
  .description('MyGifts database migration tool - SQL to Firestore')
  .version('1.0.0');

/**
 * Migrate all data
 */
program
  .command('migrate-all')
  .description('Migrate all data (users, gifts, friendships)')
  .option('-d, --dry-run', 'Run in dry-run mode (no changes will be made)')
  .option('-t, --target <target>', 'Target environment (emulator|production)', 'emulator')
  .option('--skip-users', 'Skip user migration')
  .option('--skip-gifts', 'Skip gift migration')
  .option('--skip-friends', 'Skip friendship migration')
  .option('--bidirectional-friends', 'Create bidirectional friendships')
  .action(async (options) => {
    const stats: MigrationStats = {
      usersProcessed: 0,
      usersSucceeded: 0,
      usersFailed: 0,
      giftsProcessed: 0,
      giftsSucceeded: 0,
      giftsFailed: 0,
      friendshipsProcessed: 0,
      friendshipsSucceeded: 0,
      friendshipsFailed: 0,
      errors: [],
    };

    try {
      // Update config based on options
      config.migration.dryRun = options.dryRun || false;
      config.migration.target = options.target;

      logger.section('MyGifts Database Migration');
      logger.info(`Target: ${config.migration.target}`);
      logger.info(`Dry Run: ${config.migration.dryRun}`);

      if (config.migration.dryRun) {
        logger.warn('⚠ DRY RUN MODE - No changes will be made');
      }

      // Initialize connections
      await initializeSqlConnection(config);
      await initializeFirebase(config);

      // Run migrations
      if (!options.skipUsers) {
        await migrateUsers(config, stats);
      }

      if (!options.skipGifts) {
        await migrateGifts(config, stats);
      }

      if (!options.skipFriends) {
        if (options.bidirectionalFriends) {
          await migrateBidirectionalFriends(config, stats);
        } else {
          await migrateFriends(config, stats);
        }
      }

      // Validate
      if (!config.migration.dryRun) {
        await validateMigration(stats);
      }

      await closeSqlConnection();
      logger.success('\n✓ Migration completed successfully!');
      process.exit(0);
    } catch (error) {
      logger.error('\n✗ Migration failed:', error);
      await closeSqlConnection();
      process.exit(1);
    }
  });

/**
 * Migrate users only
 */
program
  .command('migrate-users')
  .description('Migrate only users')
  .option('-d, --dry-run', 'Run in dry-run mode')
  .option('-t, --target <target>', 'Target environment (emulator|production)', 'emulator')
  .option('--import-passwords', 'Import users with existing password hashes')
  .action(async (options) => {
    const stats: MigrationStats = {
      usersProcessed: 0,
      usersSucceeded: 0,
      usersFailed: 0,
      giftsProcessed: 0,
      giftsSucceeded: 0,
      giftsFailed: 0,
      friendshipsProcessed: 0,
      friendshipsSucceeded: 0,
      friendshipsFailed: 0,
      errors: [],
    };

    try {
      config.migration.dryRun = options.dryRun || false;
      config.migration.target = options.target;

      await initializeSqlConnection(config);
      await initializeFirebase(config);

      if (options.importPasswords) {
        await importUsersWithPasswords(config, stats);
      } else {
        await migrateUsers(config, stats);
      }

      await closeSqlConnection();
      logger.success('\n✓ User migration completed!');
      process.exit(0);
    } catch (error) {
      logger.error('\n✗ User migration failed:', error);
      await closeSqlConnection();
      process.exit(1);
    }
  });

/**
 * Migrate gifts only
 */
program
  .command('migrate-gifts')
  .description('Migrate only gifts')
  .option('-d, --dry-run', 'Run in dry-run mode')
  .option('-t, --target <target>', 'Target environment (emulator|production)', 'emulator')
  .option('-u, --user-id <userId>', 'Migrate gifts for a specific user only')
  .action(async (options) => {
    const stats: MigrationStats = {
      usersProcessed: 0,
      usersSucceeded: 0,
      usersFailed: 0,
      giftsProcessed: 0,
      giftsSucceeded: 0,
      giftsFailed: 0,
      friendshipsProcessed: 0,
      friendshipsSucceeded: 0,
      friendshipsFailed: 0,
      errors: [],
    };

    try {
      config.migration.dryRun = options.dryRun || false;
      config.migration.target = options.target;

      await initializeSqlConnection(config);
      await initializeFirebase(config);

      if (options.userId) {
        await migrateGiftsForUser(options.userId, config, stats);
      } else {
        await migrateGifts(config, stats);
      }

      await closeSqlConnection();
      logger.success('\n✓ Gift migration completed!');
      process.exit(0);
    } catch (error) {
      logger.error('\n✗ Gift migration failed:', error);
      await closeSqlConnection();
      process.exit(1);
    }
  });

/**
 * Migrate friends only
 */
program
  .command('migrate-friends')
  .description('Migrate only friendships')
  .option('-d, --dry-run', 'Run in dry-run mode')
  .option('-t, --target <target>', 'Target environment (emulator|production)', 'emulator')
  .option('--bidirectional', 'Create bidirectional friendships')
  .action(async (options) => {
    const stats: MigrationStats = {
      usersProcessed: 0,
      usersSucceeded: 0,
      usersFailed: 0,
      giftsProcessed: 0,
      giftsSucceeded: 0,
      giftsFailed: 0,
      friendshipsProcessed: 0,
      friendshipsSucceeded: 0,
      friendshipsFailed: 0,
      errors: [],
    };

    try {
      config.migration.dryRun = options.dryRun || false;
      config.migration.target = options.target;

      await initializeSqlConnection(config);
      await initializeFirebase(config);

      if (options.bidirectional) {
        await migrateBidirectionalFriends(config, stats);
      } else {
        await migrateFriends(config, stats);
      }

      await closeSqlConnection();
      logger.success('\n✓ Friendship migration completed!');
      process.exit(0);
    } catch (error) {
      logger.error('\n✗ Friendship migration failed:', error);
      await closeSqlConnection();
      process.exit(1);
    }
  });

/**
 * Validate migration
 */
program
  .command('validate')
  .description('Validate migration by comparing record counts')
  .option('-t, --target <target>', 'Target environment (emulator|production)', 'emulator')
  .option('--sample [count]', 'Sample random records for verification', '5')
  .action(async (options) => {
    const stats: MigrationStats = {
      usersProcessed: 0,
      usersSucceeded: 0,
      usersFailed: 0,
      giftsProcessed: 0,
      giftsSucceeded: 0,
      giftsFailed: 0,
      friendshipsProcessed: 0,
      friendshipsSucceeded: 0,
      friendshipsFailed: 0,
      errors: [],
    };

    try {
      config.migration.target = options.target;

      await initializeSqlConnection(config);
      await initializeFirebase(config);

      const isValid = await validateMigration(stats);

      if (options.sample) {
        const sampleCount = parseInt(options.sample, 10);
        await sampleRecords(sampleCount);
      }

      await closeSqlConnection();

      if (isValid) {
        logger.success('\n✓ Validation passed!');
        process.exit(0);
      } else {
        logger.error('\n✗ Validation failed!');
        process.exit(1);
      }
    } catch (error) {
      logger.error('\n✗ Validation failed:', error);
      await closeSqlConnection();
      process.exit(1);
    }
  });

program.parse();
