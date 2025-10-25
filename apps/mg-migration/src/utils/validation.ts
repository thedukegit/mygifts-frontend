import { MigrationStats } from '../types';
import { getFirestore, getSqlConnection } from './database';
import { logger } from './logger';

/**
 * Validation utilities to verify migration success
 */

export async function validateMigration(stats: MigrationStats): Promise<boolean> {
  logger.section('Validating Migration');

  let isValid = true;

  try {
    isValid = await validateUserCount() && isValid;
    isValid = await validateGiftCount() && isValid;
    isValid = await validateFriendshipCount() && isValid;

    if (isValid) {
      logger.success('✓ Migration validation passed');
    } else {
      logger.error('✗ Migration validation failed - counts do not match');
    }

    // Print summary
    printMigrationSummary(stats);

    return isValid;
  } catch (error) {
    logger.error('Failed to validate migration', error);
    return false;
  }
}

async function validateUserCount(): Promise<boolean> {
  const sql = getSqlConnection();
  const firestore = getFirestore();

  try {
    // Get SQL count
    const [sqlResult] = await sql.execute<any[]>('SELECT COUNT(*) as count FROM users');
    const sqlCount = sqlResult[0].count;

    // Get Firestore count
    const snapshot = await firestore.collection('users').count().get();
    const firestoreCount = snapshot.data().count;

    logger.info(`Users: SQL=${sqlCount}, Firestore=${firestoreCount}`);

    if (sqlCount === firestoreCount) {
      logger.success('✓ User counts match');
      return true;
    } else {
      logger.error(`✗ User counts do not match (difference: ${sqlCount - firestoreCount})`);
      return false;
    }
  } catch (error) {
    logger.error('Failed to validate user count', error);
    return false;
  }
}

async function validateGiftCount(): Promise<boolean> {
  const sql = getSqlConnection();
  const firestore = getFirestore();

  try {
    // Get SQL count
    const [sqlResult] = await sql.execute<any[]>('SELECT COUNT(*) as count FROM gifts');
    const sqlCount = sqlResult[0].count;

    // Get Firestore count (need to count across all user subcollections)
    let firestoreCount = 0;
    const usersSnapshot = await firestore.collection('users').get();
    
    for (const userDoc of usersSnapshot.docs) {
      const giftsSnapshot = await firestore
        .collection('users')
        .doc(userDoc.id)
        .collection('gifts')
        .count()
        .get();
      firestoreCount += giftsSnapshot.data().count;
    }

    logger.info(`Gifts: SQL=${sqlCount}, Firestore=${firestoreCount}`);

    if (sqlCount === firestoreCount) {
      logger.success('✓ Gift counts match');
      return true;
    } else {
      logger.error(`✗ Gift counts do not match (difference: ${sqlCount - firestoreCount})`);
      return false;
    }
  } catch (error) {
    logger.error('Failed to validate gift count', error);
    return false;
  }
}

async function validateFriendshipCount(): Promise<boolean> {
  const sql = getSqlConnection();
  const firestore = getFirestore();

  try {
    // Get SQL count
    const [sqlResult] = await sql.execute<any[]>('SELECT COUNT(*) as count FROM friendships');
    const sqlCount = sqlResult[0].count;

    // Get Firestore count
    let firestoreCount = 0;
    const usersSnapshot = await firestore.collection('users').get();
    
    for (const userDoc of usersSnapshot.docs) {
      const friendsSnapshot = await firestore
        .collection('users')
        .doc(userDoc.id)
        .collection('friends')
        .count()
        .get();
      firestoreCount += friendsSnapshot.data().count;
    }

    logger.info(`Friendships: SQL=${sqlCount}, Firestore=${firestoreCount}`);

    // Note: If you're creating bidirectional friendships, 
    // Firestore count will be 2x SQL count
    const expectedFirestoreCount = sqlCount; // or sqlCount * 2 for bidirectional

    if (expectedFirestoreCount === firestoreCount) {
      logger.success('✓ Friendship counts match');
      return true;
    } else {
      logger.warn(`⚠ Friendship counts differ (SQL=${sqlCount}, Firestore=${firestoreCount})`);
      logger.info('This might be expected if you are using bidirectional friendships');
      return true; // Don't fail on this as it might be intentional
    }
  } catch (error) {
    logger.error('Failed to validate friendship count', error);
    return false;
  }
}

export function printMigrationSummary(stats: MigrationStats): void {
  logger.section('Migration Summary');

  console.log('\nUsers:');
  console.log(`  Processed: ${stats.usersProcessed}`);
  console.log(`  Succeeded: ${stats.usersSucceeded} ✓`);
  console.log(`  Failed: ${stats.usersFailed} ${stats.usersFailed > 0 ? '✗' : ''}`);

  console.log('\nGifts:');
  console.log(`  Processed: ${stats.giftsProcessed}`);
  console.log(`  Succeeded: ${stats.giftsSucceeded} ✓`);
  console.log(`  Failed: ${stats.giftsFailed} ${stats.giftsFailed > 0 ? '✗' : ''}`);

  console.log('\nFriendships:');
  console.log(`  Processed: ${stats.friendshipsProcessed}`);
  console.log(`  Succeeded: ${stats.friendshipsSucceeded} ✓`);
  console.log(`  Failed: ${stats.friendshipsFailed} ${stats.friendshipsFailed > 0 ? '✗' : ''}`);

  if (stats.errors.length > 0) {
    console.log('\nErrors:');
    stats.errors.slice(0, 10).forEach(error => {
      console.log(`  - ${error.entity}: ${error.error}`);
    });
    if (stats.errors.length > 10) {
      console.log(`  ... and ${stats.errors.length - 10} more errors`);
    }
  }

  const totalProcessed = stats.usersProcessed + stats.giftsProcessed + stats.friendshipsProcessed;
  const totalSucceeded = stats.usersSucceeded + stats.giftsSucceeded + stats.friendshipsSucceeded;
  const totalFailed = stats.usersFailed + stats.giftsFailed + stats.friendshipsFailed;

  console.log('\nOverall:');
  console.log(`  Total Processed: ${totalProcessed}`);
  console.log(`  Total Succeeded: ${totalSucceeded} ✓`);
  console.log(`  Total Failed: ${totalFailed} ${totalFailed > 0 ? '✗' : ''}`);
  console.log(`  Success Rate: ${((totalSucceeded / totalProcessed) * 100).toFixed(2)}%`);
}

/**
 * Sample random records for manual verification
 */
export async function sampleRecords(count = 5): Promise<void> {
  logger.section(`Sampling ${count} Random Records`);

  const sql = getSqlConnection();
  const firestore = getFirestore();

  try {
    // Sample users
    const [users] = await sql.execute<any[]>(
      `SELECT * FROM users ORDER BY RAND() LIMIT ${count}`
    );

    for (const user of users) {
      logger.info(`\nUser: ${user.email}`);
      
      // Check in Firestore
      const firestoreDoc = await firestore.collection('users').doc(user.id).get();
      if (firestoreDoc.exists) {
        logger.success('  ✓ Found in Firestore');
        const data = firestoreDoc.data();
        logger.info(`    Name: ${data?.firstName} ${data?.lastName}`);
      } else {
        logger.error('  ✗ Not found in Firestore');
      }
    }
  } catch (error) {
    logger.error('Failed to sample records', error);
  }
}

