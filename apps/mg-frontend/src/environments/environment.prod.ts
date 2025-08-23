import { StorageSolution } from '../app/interfaces/storage-solution.enum';

export const environment = {
  production: true,
  //if production is true, then it will always use firestore, no matter what the storageSolution is set to
  storageSolution: StorageSolution.Firestore, 
  firebase: {
    apiKey: 'AIzaSyDlxkUjHM6j62Sg6bFLJI1XTajmUJ6xwYQ',
    authDomain: 'mygifts-faf66.firebaseapp.com',
    projectId: 'mygifts-faf66', // Match the project ID from .firebaserc
    storageBucket: 'mygifts-faf66.firebasestorage.app',
    messagingSenderId: '578747211791',
    appId: '1:578747211791:web:1b5aef704d0faf3d09037a',
  },
};
