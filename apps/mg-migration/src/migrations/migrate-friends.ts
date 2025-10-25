import { FirestoreFriend, MigrationConfig, MigrationStats } from '../types';
import { getFirestore, getSqlConnection } from '../utils/database';
import { logger } from '../utils/logger';

/**
 * Migrate friendships from SQL to Firestore
 */

export async function migrateFriends(
  config: MigrationConfig,
  stats: MigrationStats
): Promise<void> {
  logger.section('Migrating Friendships');

  const sql = getSqlConnection();
  const firestore = getFirestore();

  try {
    // Fetch all friendships from SQL
    const [friendships] = await sql.execute<any[]>(`
      SELECT 
        f.*,
        u1.email as user_email,
        u2.id as friend_id,
        u2.email as friend_email,
        u2.first_name as friend_first_name,
        u2.last_name as friend_last_name
      FROM friendships f
      JOIN users u1 ON f.user_id = u1.id
      JOIN users u2 ON f.friend_id = u2.id
    `);
    logger.info(`Found ${friendships.length} friendships to migrate`);

    if (config.migration.dryRun) {
      logger.warn('DRY RUN MODE - No changes will be made');
      return;
    }

    // Process in batches
    const batchSize = config.migration.batchSize;
    
    for (let i = 0; i < friendships.length; i += batchSize) {
      const batchFriendships = friendships.slice(i, i + batchSize);
      const batch = firestore.batch();
      
      logger.info(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(friendships.length / batchSize)}`);

      for (const friendship of batchFriendships) {
        stats.friendshipsProcessed++;

        try {
          const sqlFriendship = friendship as any;
          
          // Create bidirectional friendship documents
          // User -> Friend
          const friendDoc: FirestoreFriend = {
            id: sqlFriendship.friend_id,
            name: sqlFriendship.friend_first_name && sqlFriendship.friend_last_name
              ? `${sqlFriendship.friend_first_name} ${sqlFriendship.friend_last_name}`
              : sqlFriendship.friend_email,
            email: sqlFriendship.friend_email,
          };

          const userFriendRef = firestore
            .collection('users')
            .doc(sqlFriendship.user_id)
            .collection('friends')
            .doc(sqlFriendship.friend_id);

          batch.set(userFriendRef, friendDoc);

          // Note: Depending on your SQL schema, you might also want to create
          // the reverse friendship (Friend -> User) if not already in the SQL data
          // This would ensure bidirectional friendships in Firestore

          stats.friendshipsSucceeded++;
        } catch (error) {
          logger.error(`Failed to prepare friendship ${friendship.id}`, error);
          stats.friendshipsFailed++;
          stats.errors.push({
            entity: `friendship:${friendship.id}`,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      // Commit the batch
      try {
        await batch.commit();
        logger.success(`Committed batch with ${batchFriendships.length} friendships`);
      } catch (error) {
        logger.error('Failed to commit batch', error);
        throw error;
      }
    }

    logger.success(`Friendships migration complete: ${stats.friendshipsSucceeded}/${friendships.length} succeeded`);
  } catch (error) {
    logger.error('Failed to fetch friendships from SQL', error);
    throw error;
  }
}

/**
 * Create bidirectional friendships
 * This ensures that if A is friends with B, then B is also friends with A
 */
export async function migrateBidirectionalFriends(
  config: MigrationConfig,
  stats: MigrationStats
): Promise<void> {
  logger.section('Migrating Bidirectional Friendships');

  const sql = getSqlConnection();
  const firestore = getFirestore();

  try {
    // Fetch all friendships
    const [friendships] = await sql.execute<any[]>(`
      SELECT 
        f.*,
        u1.id as user_id,
        u1.email as user_email,
        u1.first_name as user_first_name,
        u1.last_name as user_last_name,
        u2.id as friend_id,
        u2.email as friend_email,
        u2.first_name as friend_first_name,
        u2.last_name as friend_last_name
      FROM friendships f
      JOIN users u1 ON f.user_id = u1.id
      JOIN users u2 ON f.friend_id = u2.id
    `);
    logger.info(`Found ${friendships.length} friendships to migrate (bidirectional)`);

    if (config.migration.dryRun) {
      logger.warn('DRY RUN MODE - No changes will be made');
      return;
    }

    // Use a Set to track processed friendship pairs to avoid duplicates
    const processedPairs = new Set<string>();

    for (const friendship of friendships) {
      const sqlFriendship = friendship as any;
      const pairKey = [sqlFriendship.user_id, sqlFriendship.friend_id].sort().join(':');

      if (processedPairs.has(pairKey)) {
        continue; // Skip if already processed
      }

      stats.friendshipsProcessed++;

      try {
        const batch = firestore.batch();

        // User -> Friend
        const friendDoc: FirestoreFriend = {
          id: sqlFriendship.friend_id,
          name: sqlFriendship.friend_first_name && sqlFriendship.friend_last_name
            ? `${sqlFriendship.friend_first_name} ${sqlFriendship.friend_last_name}`
            : sqlFriendship.friend_email,
          email: sqlFriendship.friend_email,
        };

        const userFriendRef = firestore
          .collection('users')
          .doc(sqlFriendship.user_id)
          .collection('friends')
          .doc(sqlFriendship.friend_id);

        batch.set(userFriendRef, friendDoc);

        // Friend -> User (reverse)
        const userDoc: FirestoreFriend = {
          id: sqlFriendship.user_id,
          name: sqlFriendship.user_first_name && sqlFriendship.user_last_name
            ? `${sqlFriendship.user_first_name} ${sqlFriendship.user_last_name}`
            : sqlFriendship.user_email,
          email: sqlFriendship.user_email,
        };

        const friendUserRef = firestore
          .collection('users')
          .doc(sqlFriendship.friend_id)
          .collection('friends')
          .doc(sqlFriendship.user_id);

        batch.set(friendUserRef, userDoc);

        await batch.commit();

        processedPairs.add(pairKey);
        stats.friendshipsSucceeded++;
        logger.success(`Created bidirectional friendship: ${sqlFriendship.user_email} ↔ ${sqlFriendship.friend_email}`);
      } catch (error) {
        logger.error(`Failed to migrate friendship ${friendship.id}`, error);
        stats.friendshipsFailed++;
        stats.errors.push({
          entity: `friendship:${friendship.id}`,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    logger.success(`Bidirectional friendships migration complete: ${stats.friendshipsSucceeded}/${friendships.length} succeeded`);
  } catch (error) {
    logger.error('Failed to migrate bidirectional friendships', error);
    throw error;
  }
}

