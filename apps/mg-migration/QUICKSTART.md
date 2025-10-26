# Quick Start Guide

Get started with the migration in 5 minutes!

## Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com) → Your Project
2. Settings → Service Accounts → Generate New Private Key
3. Save as `apps/mg-migration/serviceAccountKey.json`

## Step 2: Create Environment File

Create `apps/mg-migration/.env`:

```bash
SQL_HOST=localhost
SQL_PORT=3306
SQL_USER=root
SQL_PASSWORD=your_password
SQL_DATABASE=mygifts_old

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

MIGRATION_TARGET=emulator
FIRESTORE_EMULATOR_HOST=localhost:8080
BATCH_SIZE=500
```

## Step 3: Test with Emulator

```bash
# Terminal 1: Start emulator
npm run emulators:start

# Terminal 2: Run migration
npx nx build mg-migration
node dist/apps/mg-migration/main.js migrate-all --target emulator --dry-run

# If dry-run looks good, run for real:
node dist/apps/mg-migration/main.js migrate-all --target emulator

# Validate
node dist/apps/mg-migration/main.js validate --target emulator
```

## Step 4: Test Your App

Test your Angular app against the migrated data in the emulator to ensure everything works.

## Step 5: Production Migration

```bash
# Update .env
MIGRATION_TARGET=production

# Build and run
npx nx build mg-migration
node dist/apps/mg-migration/main.js migrate-all --target production --dry-run

# If everything looks good:
node dist/apps/mg-migration/main.js migrate-all --target production

# Validate
node dist/apps/mg-migration/main.js validate --target production
```

## Common Commands

```bash
# Migrate everything
node dist/apps/mg-migration/main.js migrate-all

# Migrate only users
node dist/apps/mg-migration/main.js migrate-users

# Migrate with bidirectional friendships
node dist/apps/mg-migration/main.js migrate-all --bidirectional-friends

# Validate migration
node dist/apps/mg-migration/main.js validate --sample 10

# See all options
node dist/apps/mg-migration/main.js --help
```

## Need Help?

See the full [README.md](./README.md) for detailed documentation.

