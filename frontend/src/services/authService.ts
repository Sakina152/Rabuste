import { auth } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';

const API_URL = "http://localhost:5000/api/auth";
const googleProvider = new GoogleAuthProvider();


// Firebase authentication
export const firebaseAuth = async (idToken: string, userData?: {
  name?: string;
  phoneNumber?: string;
  address?: string;
}) => {
  const res = await fetch(`${API_URL}/firebase-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      idToken,
      ...userData 
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  }

  return res.json();
};

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Get ID token
    const idToken = await user.getIdToken();
    
    // Send to backend
    const userData = await firebaseAuth(idToken, {
      name: user.displayName || undefined,
      phoneNumber: user.phoneNumber || undefined,
    });
    
    return userData;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Email/Password Sign Up
export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Get ID token
    const idToken = await user.getIdToken();
    
    // Send to backend
    const userData = await firebaseAuth(idToken, {
      name,
    });
    
    return userData;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Email/Password Sign In
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Get ID token
    const idToken = await user.getIdToken();
    
    // Send to backend
    const userData = await firebaseAuth(idToken);
    
    return userData;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Keep old methods for backward compatibility
export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  }

  return res.json();
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  }

  return res.json();
};