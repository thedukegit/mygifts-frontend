# SQL Schema Adjustments Guide

If your SQL schema differs from the expected structure, use this guide to adjust the migration scripts.

## Expected SQL Schema

The migration tool expects the following SQL tables:

### Users Table

```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  photo_url VARCHAR(500),
  password_hash VARCHAR(255),
  password_salt VARCHAR(255),
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Gifts Table

```sql
CREATE TABLE gifts (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  quantity INT DEFAULT 1,
  image_url VARCHAR(500),
  link VARCHAR(500),
  purchased BOOLEAN DEFAULT false,
  purchased_by VARCHAR(255),
  purchased_by_name VARCHAR(255),
  purchased_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Friendships Table

```sql
CREATE TABLE friendships (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  friend_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (friend_id) REFERENCES users(id)
);
```

## Common Adjustments

### Different Table Names

If your tables have different names, update the SQL queries in the migration files:

**File: `src/migrations/migrate-users.ts`**
```typescript
// Change this:
const [users] = await sql.execute<any[]>('SELECT * FROM users');

// To this (if your table is named 'app_users'):
const [users] = await sql.execute<any[]>('SELECT * FROM app_users');
```

### Different Column Names

If your columns have different names, adjust the field mapping:

**Example: Different User Fields**

If your SQL has `username` instead of `email`:

**File: `src/migrations/migrate-users.ts`**
```typescript
// Update the query to alias the column:
const [users] = await sql.execute<any[]>(
  'SELECT id, username as email, first_name, last_name FROM users'
);
```

**Example: Different Gift Fields**

If your SQL has `item_name` instead of `name`:

**File: `src/migrations/migrate-gifts.ts`**
```typescript
// Update the query:
const [gifts] = await sql.execute<any[]>(`
  SELECT 
    g.id,
    g.user_id as userId,
    g.item_name as name,  -- aliased here
    g.description,
    g.price
  FROM gifts g 
  JOIN users u ON g.user_id = u.id
`);
```

### Composite Keys

If you use composite keys instead of single ID columns:

**File: `src/migrations/migrate-friends.ts`**
```typescript
// If friendships don't have an ID column and use (user_id, friend_id) as key:
const [friendships] = await sql.execute<any[]>(`
  SELECT 
    CONCAT(f.user_id, '-', f.friend_id) as id,  -- create synthetic ID
    f.user_id,
    f.friend_id,
    u1.email as user_email,
    u2.id as friend_id,
    u2.email as friend_email,
    u2.first_name as friend_first_name,
    u2.last_name as friend_last_name
  FROM friendships f
  JOIN users u1 ON f.user_id = u1.id
  JOIN users u2 ON f.friend_id = u2.id
`);
```

### Different Relationship Structure

If gifts are linked differently:

```typescript
// If gifts have a separate link table:
const [gifts] = await sql.execute<any[]>(`
  SELECT 
    g.*,
    ug.user_id as userId
  FROM gifts g
  JOIN user_gifts ug ON g.id = ug.gift_id
  JOIN users u ON ug.user_id = u.id
`);
```

### Additional Fields

If you have additional fields you want to migrate:

**File: `src/types.ts`**
```typescript
// Add to interface:
export interface SqlGift {
  id: string;
  userId: string;
  name: string;
  // ... existing fields ...
  customField?: string;  // Add your field
}

export interface FirestoreGift {
  id: string;
  name: string;
  // ... existing fields ...
  customField?: string;  // Add your field
}
```

**File: `src/migrations/migrate-gifts.ts`**
```typescript
// Add to Firestore mapping:
const firestoreGift: FirestoreGift = {
  id: sqlGift.id,
  name: sqlGift.name || '',
  // ... existing fields ...
  customField: sqlGift.customField,  // Map your field
};
```

### Testing Your Changes

After making adjustments:

1. **Test with a small dataset first:**
   ```sql
   -- Export just a few records for testing
   SELECT * FROM users LIMIT 5;
   SELECT * FROM gifts WHERE user_id IN (SELECT id FROM users LIMIT 5);
   ```

2. **Run in dry-run mode:**
   ```bash
   node dist/apps/mg-migration/main.js migrate-all --dry-run --target emulator
   ```

3. **Check the logs** for any SQL or mapping errors

4. **Validate** the migrated data structure in Firebase Console

## Quick Reference: Files to Edit

| What to Change | File to Edit | Section |
|----------------|-------------|---------|
| User table/fields | `src/migrations/migrate-users.ts` | SQL query |
| Gift table/fields | `src/migrations/migrate-gifts.ts` | SQL query |
| Friendship table/fields | `src/migrations/migrate-friends.ts` | SQL query |
| Add new fields | `src/types.ts` | Interfaces |
| Change batch size | `.env` | `BATCH_SIZE` |
| Hash algorithm | `src/migrations/migrate-users.ts` | `importUsersWithPasswords` |

## Need More Help?

Check the inline comments in each migration file for additional guidance.

