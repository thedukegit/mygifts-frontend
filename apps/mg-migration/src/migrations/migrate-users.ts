import { FieldValue } from 'firebase-admin/firestore';
import { FirestoreUser, MigrationConfig, MigrationStats, SqlUser } from '../types';
import { getAuth, getFirestore, getSqlConnection } from '../utils/database';
import { logger } from '../utils/logger';

/**
 * Migrate users from SQL to Firebase Auth and Firestore
 */

export async function migrateUsers(
  config: MigrationConfig,
  stats: MigrationStats
): Promise<void> {
  logger.section('Migrating Users');

  const sql = getSqlConnection();
  const firestore = getFirestore();
  const auth = getAuth();

  try {
    // Fetch all users from SQL
    const [users] = await sql.execute<any[]>('SELECT * FROM users');
    logger.info(`Found ${users.length} users to migrate`);

    if (config.migration.dryRun) {
      logger.warn('DRY RUN MODE - No changes will be made');
      return;
    }

    for (let i = 0; i < users.length; i++) {
      const user = users[i] as SqlUser;
      stats.usersProcessed++;

      try {
        logger.progress(i + 1, users.length, user.email);

        // Check if user already exists in Firebase Auth
        let userRecord;
        try {
          userRecord = await auth.getUserByEmail(user.email);
          logger.info(`User already exists: ${user.email}`);
        } catch (error: any) {
          if (error.code === 'auth/user-not-found') {
            // Create new Firebase Auth user
            userRecord = await auth.createUser({
              uid: user.id,
              email: user.email,
              displayName: user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : undefined,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified || false,
              // Generate a random temporary password
              password: generateTemporaryPassword(),
            });
            logger.info(`Created Firebase Auth user: ${user.email}`);
          } else {
            throw error;
          }
        }

        // Create Firestore user document
        const userDoc: FirestoreUser = {
          uid: userRecord.uid,
          email: userRecord.email || user.email,
          firstName: user.firstName || null,
          lastName: user.lastName || null,
          photoURL: user.photoURL || null,
          createdAt: FieldValue.serverTimestamp() as any,
          updatedAt: FieldValue.serverTimestamp() as any,
        };

        await firestore.collection('users').doc(userRecord.uid).set(userDoc, { merge: true });
        logger.success(`Migrated user: ${user.email}`);
        stats.usersSucceeded++;
      } catch (error) {
        logger.error(`Failed to migrate user ${user.email}`, error);
        stats.usersFailed++;
        stats.errors.push({
          entity: `user:${user.email}`,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    logger.success(`Users migration complete: ${stats.usersSucceeded}/${users.length} succeeded`);
  } catch (error) {
    logger.error('Failed to fetch users from SQL', error);
    throw error;
  }
}

/**
 * Generate a secure temporary password for new users
 * Users will need to reset their password on first login
 */
function generateTemporaryPassword(): string {
  const length = 20;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

/**
 * Alternative: Import users with existing password hashes
 * Only works if you know the hashing algorithm used
 */
export async function importUsersWithPasswords(
  config: MigrationConfig,
  stats: MigrationStats
): Promise<void> {
  logger.section('Importing Users with Password Hashes');
  logger.warn('This requires knowing the password hash algorithm used in your SQL database');

  const sql = getSqlConnection();
  const auth = getAuth();

  try {
    const [users] = await sql.execute<any[]>('SELECT * FROM users');
    logger.info(`Found ${users.length} users to import`);

    if (config.migration.dryRun) {
      logger.warn('DRY RUN MODE - No changes will be made');
      return;
    }

    // Process in batches of 1000 (Firebase limit)
    const batchSize = 1000;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      const userImports = batch.map((user: SqlUser) => ({
        uid: user.id,
        email: user.email,
        displayName: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : undefined,
        photoURL: user.photoURL,
        passwordHash: user.passwordHash ? Buffer.from(user.passwordHash) : undefined,
        passwordSalt: user.passwordSalt ? Buffer.from(user.passwordSalt) : undefined,
        emailVerified: user.emailVerified || false,
      }));

      try {
        const result = await auth.importUsers(userImports, {
          hash: {
            algorithm: 'BCRYPT', // Change this based on your SQL hash algorithm
            // For SCRYPT: algorithm: 'SCRYPT', rounds: 8, memoryCost: 14
          },
        });

        logger.success(`Imported batch: ${result.successCount} succeeded, ${result.failureCount} failed`);
        stats.usersSucceeded += result.successCount;
        stats.usersFailed += result.failureCount;

        // Log any errors
        result.errors.forEach(error => {
          logger.error(`Failed to import user at index ${error.index}`, error.error);
          stats.errors.push({
            entity: `user:${batch[error.index].email}`,
            error: error.error.message,
          });
        });
      } catch (error) {
        logger.error('Failed to import batch', error);
        throw error;
      }
    }

    logger.success(`User import complete: ${stats.usersSucceeded}/${users.length} succeeded`);
  } catch (error) {
    logger.error('Failed to import users', error);
    throw error;
  }
}

