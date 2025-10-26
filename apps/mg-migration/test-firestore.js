// Quick test to list Firestore collections
const admin = require('firebase-admin');

// Set emulator BEFORE requiring admin
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

// For emulator, use any dummy project ID
admin.initializeApp({
  projectId: 'demo-test',
});

const db = admin.firestore();

async function listCollections() {
  console.log('Listing Firestore collections...\n');
  
  const collections = await db.listCollections();
  console.log(`Found ${collections.length} collections:`);
  collections.forEach(col => console.log(`  - ${col.id}`));
  
  if (collections.length > 0) {
    console.log('\nChecking users collection:');
    const usersSnapshot = await db.collection('users').limit(5).get();
    console.log(`  Users count (first 5): ${usersSnapshot.size}`);
    
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`  - ${doc.id}: ${data.firstName} ${data.lastName} (${data.email})`);
    });
  }
  
  process.exit(0);
}

listCollections().catch(console.error);

