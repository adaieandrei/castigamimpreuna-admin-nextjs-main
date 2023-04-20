// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getFirestore } from 'firebase/firestore'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_NEW,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_NEW,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_NEW,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_NEW,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_NEW,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_NEW,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_NEW
};

// Initialize Firebase
const defaultProject = firebase.initializeApp(firebaseConfig);
export let firestoreDB = getFirestore(defaultProject);