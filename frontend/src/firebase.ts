import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// Your Firebase web config
const firebaseConfig = {
  apiKey: "AIzaSyDdXNiRRkeXq8JZ9gecR5gsmytmca3p1DY",
  authDomain: "rabuste-coffee-d621d.firebaseapp.com",
  projectId: "rabuste-coffee-d621d",
  storageBucket: "rabuste-coffee-d621d.firebasestorage.app",
  messagingSenderId: "973156930028",
  appId: "1:973156930028:web:9278dd6dc99197da90f0c9",
  measurementId: "G-JFYEWNQNBV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Export auth functions
export { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber
};

export { app, analytics };