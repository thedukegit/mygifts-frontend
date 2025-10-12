// libs/firebase/rules-tests/src/firestore.spec.ts (or similar path)
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import * as path from 'path';
// Ensure compat Firestore is registered for rules-unit-testing contexts
import 'firebase/compat/app';
import 'firebase/compat/firestore';

let testEnv: any; // Type for RulesTestEnvironment

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'mygifts-faf66',
    firestore: {
      rules: readFileSync(path.resolve(process.cwd(), 'firestore.rules'), 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  // await testEnv.clearDatabase(); // For RTDB
});

describe('Firestore Rules', () => {
  it('should allow read access to authenticated users for all documents', async () => {
    const alice = testEnv.authenticatedContext('alice_uid');
    await assertSucceeds(alice.firestore().collection('someCollection').get());
  });

  it('should NOT allow read access to unauthenticated users', async () => {
    const unauthed = testEnv.unauthenticatedContext();
    await assertFails(unauthed.firestore().collection('someCollection').get());
  });

  // Add more specific tests for your /users/{userId}/gifts/{giftId} rule
  it('should allow a user to read their own gifts', async () => {
    const alice = testEnv.authenticatedContext('alice_uid');
    await testEnv.withSecurityRulesDisabled(async (context: any) => {
      await context.firestore().collection('users').doc('alice_uid').collection('gifts').doc('gift123').set({ name: 'Book' });
    });
    await assertSucceeds(alice.firestore().collection('users').doc('alice_uid').collection('gifts').doc('gift123').get());
  });

  it('should NOT allow a user to read another user\'s gifts', async () => {
    const alice = testEnv.authenticatedContext('alice_uid');
    await testEnv.withSecurityRulesDisabled(async (context: any) => {
      await context.firestore().collection('users').doc('bob_uid').collection('gifts').doc('gift456').set({ name: 'Game' });
    });
    await assertFails(alice.firestore().collection('users').doc('bob_uid').collection('gifts').doc('gift456').get());
  });
});
