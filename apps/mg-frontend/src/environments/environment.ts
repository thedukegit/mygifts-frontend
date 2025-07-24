export const environment = {
  production: false,
  // For local development, use local storage instead of Firestore
  useLocalRepositories: true,
  firebase: {
    apiKey: 'demo-key', // Demo key for emulator
    authDomain: 'mygifts-faf66.firebaseapp.com',
    projectId: 'mygifts-faf66', // Match the project ID from .firebaserc
    storageBucket: 'mygifts-faf66.appspot.com',
    messagingSenderId: '123456789',
    appId: 'demo-app-id',
  },
};
