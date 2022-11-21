import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCdgxYjEvR5pQkyGcyLbBTOPCcyiDkKjMg',
  authDomain: 'music-7e35b.firebaseapp.com',
  projectId: 'music-7e35b',
  storageBucket: 'music-7e35b.appspot.com',
  appId: '1:103975220807:web:25a383853799aeadc6a362',
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const usersCollection = db.collection('users');
const songsCollection = db.collection('songs');
const commentsCollection = db.collection('comments');

export {
  auth, db, storage, usersCollection, songsCollection, commentsCollection,
};
