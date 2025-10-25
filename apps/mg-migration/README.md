# MyGifts Migration Tool

A comprehensive migration tool to migrate data from SQL database to Firebase Firestore for the MyGifts application.

## Overview

This tool migrates:
- **Users** - from SQL to Firebase Authentication and Firestore
- **Gifts** - from SQL to Firestore user subcollections
- **Friendships** - from SQL to Firestore user subcollections (with optional bidirectional support)

## Features

- ✅ Batch processing for optimal performance
- ✅ Dry-run mode for testing
- ✅ Support for both Firebase emulator and production
- ✅ Detailed logging and progress tracking
- ✅ Validation tools to verify migration success
- ✅ Error handling and reporting
- ✅ CLI interface with multiple commands
- ✅ Modular architecture for easy customization

## Prerequisites

1. **SQL Database Access** - credentials for your existing MySQL database
2. **Firebase Project** - set up with Firestore enabled
3. **Firebase Service Account Key** - downloaded from Firebase Console
4. **Node.js** - version 18 or higher

## Setup

### 1. Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Save the JSON file as `serviceAccountKey.json` in the `apps/mg-migration` directory

⚠️ **Important**: Never commit this file to git! It's already in .gitignore.

### 2. Create Configuration File

Create a `.env` file in `apps/mg-migration/`:

```bash
# SQL Database Configuration
SQL_HOST=localhost
SQL_PORT=3306
SQL_USER=root
SQL_PASSWORD=your_password
SQL_DATABASE=mygifts_old

# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
FIREBASE_PROJECT_ID=your-project-id

# Migration Settings
BATCH_SIZE=500
DRY_RUN=false
MIGRATION_TARGET=emulator
FIRESTORE_EMULATOR_HOST=localhost:8080
```

### 3. Adjust SQL Table Names (if needed)

If your SQL table structure differs from the expected schema, edit the migration files:
- `src/migrations/migrate-users.ts`
- `src/migrations/migrate-gifts.ts`
- `src/migrations/migrate-friends.ts`

Expected SQL schema:

```sql
-- Users table
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

-- Gifts table
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

-- Friendships table
CREATE TABLE friendships (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  friend_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (friend_id) REFERENCES users(id)
);
```

## Usage

### Build the Migration Tool

```bash
# From the workspace root
nx build mg-migration
```

### Run Migrations

#### 1. Test with Emulator First (Recommended)

Start the Firebase emulator:

```bash
npm run emulators:start
```

Run migration in dry-run mode:

```bash
node dist/apps/mg-migration/main.js migrate-all --dry-run
```

Run migration to emulator:

```bash
node dist/apps/mg-migration/main.js migrate-all --target emulator
```

#### 2. Validate Migration

```bash
node dist/apps/mg-migration/main.js validate --target emulator
```

Sample random records for manual verification:

```bash
node dist/apps/mg-migration/main.js validate --target emulator --sample 10
```

#### 3. Migrate to Production

⚠️ **Warning**: Only run this after thoroughly testing with the emulator!

```bash
# Dry run first
node dist/apps/mg-migration/main.js migrate-all --target production --dry-run

# Actual migration
node dist/apps/mg-migration/main.js migrate-all --target production
```

### Available Commands

#### Migrate All Data

```bash
node dist/apps/mg-migration/main.js migrate-all [options]

Options:
  -d, --dry-run                  Run in dry-run mode (no changes)
  -t, --target <target>          Target environment (emulator|production)
  --skip-users                   Skip user migration
  --skip-gifts                   Skip gift migration
  --skip-friends                 Skip friendship migration
  --bidirectional-friends        Create bidirectional friendships
```

#### Migrate Users Only

```bash
node dist/apps/mg-migration/main.js migrate-users [options]

Options:
  -d, --dry-run                  Run in dry-run mode
  -t, --target <target>          Target environment (emulator|production)
  --import-passwords             Import users with existing password hashes
```

#### Migrate Gifts Only

```bash
node dist/apps/mg-migration/main.js migrate-gifts [options]

Options:
  -d, --dry-run                  Run in dry-run mode
  -t, --target <target>          Target environment (emulator|production)
  -u, --user-id <userId>         Migrate gifts for a specific user only
```

#### Migrate Friendships Only

```bash
node dist/apps/mg-migration/main.js migrate-friends [options]

Options:
  -d, --dry-run                  Run in dry-run mode
  -t, --target <target>          Target environment (emulator|production)
  --bidirectional                Create bidirectional friendships
```

#### Validate Migration

```bash
node dist/apps/mg-migration/main.js validate [options]

Options:
  -t, --target <target>          Target environment (emulator|production)
  --sample [count]               Sample random records for verification
```

## Migration Strategies

### Password Migration

**Option 1: Temporary Passwords (Default)**
- Generates random temporary passwords for all users
- Users must reset their passwords on first login
- Simpler but requires user action

**Option 2: Import Password Hashes**
- Imports existing password hashes from SQL
- Requires knowing the hash algorithm (BCRYPT, SCRYPT, etc.)
- Users can log in with existing passwords
- Use `--import-passwords` flag

To use Option 2, edit `src/migrations/migrate-users.ts` and update the hash algorithm:

```typescript
await auth.importUsers(userImports, {
  hash: {
    algorithm: 'BCRYPT', // or 'SCRYPT', 'SHA256', etc.
    // For SCRYPT: rounds: 8, memoryCost: 14
  },
});
```

### Friendship Migration

**Unidirectional (Default)**
- Migrates friendships as they exist in SQL
- If SQL has: User A → User B, then only User A sees User B as friend

**Bidirectional**
- Creates symmetric friendships
- If SQL has: User A → User B, creates both:
  - User A → User B
  - User B → User A
- Use `--bidirectional-friends` flag

## Troubleshooting

### Connection Issues

**SQL Connection Failed**
- Verify SQL credentials in `.env`
- Check if SQL server is running
- Verify firewall rules

**Firestore Connection Failed**
- Verify `serviceAccountKey.json` is in the correct location
- Check Firebase project ID in `.env`
- For emulator: ensure emulator is running

### Migration Errors

**User Already Exists**
- Tool handles this gracefully by updating existing user
- Check logs for details

**Invalid Data**
- Check SQL data for null values in required fields
- Ensure email addresses are valid

**Batch Size Too Large**
- Reduce `BATCH_SIZE` in `.env` if you encounter memory issues
- Default is 500, try 100 or 250

## Best Practices

1. **Always test with emulator first**
   - Run multiple test migrations
   - Validate data structure
   - Test your app with migrated data

2. **Use dry-run mode**
   - Test the migration without making changes
   - Review logs for potential issues

3. **Backup everything**
   - Export your SQL database before migration
   - Enable Firebase backup for Firestore

4. **Migration window**
   - Run production migration during low-traffic period
   - Put app in maintenance mode if possible

5. **Incremental migration**
   - Consider migrating users first
   - Then gifts and friendships
   - Validate each step

6. **Monitor Firebase quotas**
   - Watch Firestore write operations
   - Large datasets may hit rate limits
   - Consider running during off-peak hours

## Architecture

```
apps/mg-migration/
├── src/
│   ├── migrations/         # Migration modules
│   │   ├── migrate-users.ts
│   │   ├── migrate-gifts.ts
│   │   └── migrate-friends.ts
│   ├── utils/              # Utilities
│   │   ├── database.ts     # DB connections
│   │   ├── logger.ts       # Logging
│   │   └── validation.ts   # Validation tools
│   ├── config.template.ts  # Configuration
│   ├── types.ts            # TypeScript types
│   └── main.ts             # CLI entry point
├── .env                    # Environment variables (not in git)
├── serviceAccountKey.json  # Firebase credentials (not in git)
└── README.md               # This file
```

## Support

If you encounter issues:
1. Check the error logs
2. Verify your SQL schema matches expected structure
3. Test with a small dataset first
4. Review Firebase quotas and limits

## Security Notes

⚠️ **Never commit these files:**
- `.env`
- `serviceAccountKey.json`
- Any file containing passwords or credentials

These are already in `.gitignore`, but double-check before committing.

