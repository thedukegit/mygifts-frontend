// Test Firestore with exact validation method
const admin = require('firebase-admin');

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

admin.initializeApp({
  projectId: 'mygifts-faf66',
});

const db = admin.firestore();

async function testFirestore() {
  console.log('Testing Firestore access...\n');
  
  // Try to get a specific user document (we know user ID "1" should exist - Emiel)
  console.log('Checking for user ID "1":');
  const userDoc = await db.collection('users').doc('1').get();
  
  if (userDoc.exists) {
    console.log('✓ User document EXISTS!');
    console.log('  Data:', userDoc.data());
  } else {
    console.log('✗ User document DOES NOT EXIST');
  }
  
  // Try to list all documents in users collection
  console.log('\nTrying to get all users:');
  const usersSnapshot = await db.collection('users').get();
  console.log(`  Found ${usersSnapshot.size} user documents`);
  
  if (usersSnapshot.size > 0) {
    console.log('\n  First 3 users:');
    usersSnapshot.docs.slice(0, 3).forEach(doc => {
      const data = doc.data();
      console.log(`    - ${doc.id}: ${data.email}`);
    });
  }
  
  process.exit(0);
}

testFirestore().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

