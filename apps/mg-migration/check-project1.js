// Check data in project: mygifts-faf66
const admin = require('firebase-admin');

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

const app = admin.initializeApp({
  projectId: 'mygifts-faf66',
}, 'check1');

const db = app.firestore();

async function checkData() {
  console.log('Checking PROJECT: mygifts-faf66\n');
  
  const usersSnapshot = await db.collection('users').get();
  console.log(`Users found: ${usersSnapshot.size}`);
  
  if (usersSnapshot.size > 0) {
    console.log('First 3 users:');
    usersSnapshot.docs.slice(0, 3).forEach(doc => {
      const data = doc.data();
      console.log(`  - ${doc.id}: ${data.email}`);
    });
  }
  
  process.exit(0);
}

checkData().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});

