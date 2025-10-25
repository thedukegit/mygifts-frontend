import { FirestoreGift, MigrationConfig, MigrationStats, SqlGift } from '../types';
import { getFirestore, getSqlConnection } from '../utils/database';
import { logger } from '../utils/logger';

/**
 * Migrate gifts from SQL to Firestore
 */

export async function migrateGifts(
  config: MigrationConfig,
  stats: MigrationStats
): Promise<void> {
  logger.section('Migrating Gifts');

  const sql = getSqlConnection();
  const firestore = getFirestore();

  try {
    // Fetch all gifts from SQL
    const [gifts] = await sql.execute<any[]>(`
      SELECT g.*, u.id as userId 
      FROM gifts g 
      JOIN users u ON g.user_id = u.id
    `);
    logger.info(`Found ${gifts.length} gifts to migrate`);

    if (config.migration.dryRun) {
      logger.warn('DRY RUN MODE - No changes will be made');
      return;
    }

    // Process in batches for better performance
    const batchSize = config.migration.batchSize;
    
    for (let i = 0; i < gifts.length; i += batchSize) {
      const batchGifts = gifts.slice(i, i + batchSize);
      const batch = firestore.batch();
      
      logger.info(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(gifts.length / batchSize)}`);

      for (const gift of batchGifts) {
        stats.giftsProcessed++;

        try {
          const sqlGift = gift as SqlGift;
          
          // Transform SQL gift to Firestore format
          const firestoreGift: FirestoreGift = {
            id: sqlGift.id,
            name: sqlGift.name || '',
            description: sqlGift.description || '',
            price: sqlGift.price || 0,
            quantity: sqlGift.quantity || 1,
            imageUrl: sqlGift.imageUrl || '',
            link: sqlGift.link,
            purchased: sqlGift.purchased || false,
            purchasedBy: sqlGift.purchasedBy,
            purchasedByName: sqlGift.purchasedByName,
            purchasedAt: sqlGift.purchasedAt,
          };

          const docRef = firestore
            .collection('users')
            .doc(sqlGift.userId)
            .collection('gifts')
            .doc(sqlGift.id);

          batch.set(docRef, firestoreGift);
          stats.giftsSucceeded++;
        } catch (error) {
          logger.error(`Failed to prepare gift ${gift.id}`, error);
          stats.giftsFailed++;
          stats.errors.push({
            entity: `gift:${gift.id}`,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      // Commit the batch
      try {
        await batch.commit();
        logger.success(`Committed batch with ${batchGifts.length} gifts`);
      } catch (error) {
        logger.error('Failed to commit batch', error);
        throw error;
      }
    }

    logger.success(`Gifts migration complete: ${stats.giftsSucceeded}/${gifts.length} succeeded`);
  } catch (error) {
    logger.error('Failed to fetch gifts from SQL', error);
    throw error;
  }
}

/**
 * Migrate gifts for a specific user
 * Useful for incremental migration or fixing specific users
 */
export async function migrateGiftsForUser(
  userId: string,
  config: MigrationConfig,
  stats: MigrationStats
): Promise<void> {
  logger.section(`Migrating Gifts for User ${userId}`);

  const sql = getSqlConnection();
  const firestore = getFirestore();

  try {
    const [gifts] = await sql.execute<any[]>(
      'SELECT * FROM gifts WHERE user_id = ?',
      [userId]
    );
    logger.info(`Found ${gifts.length} gifts for user ${userId}`);

    if (config.migration.dryRun) {
      logger.warn('DRY RUN MODE - No changes will be made');
      return;
    }

    for (const gift of gifts) {
      stats.giftsProcessed++;

      try {
        const sqlGift = gift as SqlGift;
        
        const firestoreGift: FirestoreGift = {
          id: sqlGift.id,
          name: sqlGift.name || '',
          description: sqlGift.description || '',
          price: sqlGift.price || 0,
          quantity: sqlGift.quantity || 1,
          imageUrl: sqlGift.imageUrl || '',
          link: sqlGift.link,
          purchased: sqlGift.purchased || false,
          purchasedBy: sqlGift.purchasedBy,
          purchasedByName: sqlGift.purchasedByName,
          purchasedAt: sqlGift.purchasedAt,
        };

        await firestore
          .collection('users')
          .doc(userId)
          .collection('gifts')
          .doc(sqlGift.id)
          .set(firestoreGift);

        stats.giftsSucceeded++;
        logger.success(`Migrated gift: ${sqlGift.name}`);
      } catch (error) {
        logger.error(`Failed to migrate gift ${gift.id}`, error);
        stats.giftsFailed++;
        stats.errors.push({
          entity: `gift:${gift.id}`,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    logger.success(`Completed migration for user ${userId}: ${stats.giftsSucceeded}/${gifts.length} succeeded`);
  } catch (error) {
    logger.error(`Failed to migrate gifts for user ${userId}`, error);
    throw error;
  }
}

