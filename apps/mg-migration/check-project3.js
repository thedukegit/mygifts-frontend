// Check data in project: demo-mygifts-faf66 (Angular app's project ID)
const admin = require('firebase-admin');

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

const app = admin.initializeApp({
  projectId: 'demo-mygifts-faf66',
}, 'check3');

const db = app.firestore();

async function checkData() {
  console.log('Checking PROJECT: demo-mygifts-faf66 (Angular app project)\n');
  
  const usersSnapshot = await db.collection('users').get();
  console.log(`Users found: ${usersSnapshot.size}`);
  
  if (usersSnapshot.size > 0) {
    console.log('\nFirst 5 users:');
    usersSnapshot.docs.slice(0, 5).forEach(doc => {
      const data = doc.data();
      console.log(`  - ${doc.id}: ${data.firstName} ${data.lastName} (${data.email})`);
    });
  }
  
  process.exit(0);
}

checkData().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});

