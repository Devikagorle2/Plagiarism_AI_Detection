import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Check if all required Firebase config is present
const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

let app;
let auth;
let db;

if (hasValidConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  console.warn('Firebase credentials not found. Please set up your .env file. Running in mock mode.');
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = async () => {
  if (!auth) {
    // Mock mode for development
    console.warn('Using mock authentication in development mode');
    return {
      uid: 'mock-user-123',
      email: 'demo@example.com',
      displayName: 'Demo User',
      photoURL: '',
      getIdToken: async () => 'mock-id-token-' + Date.now()
    };
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  if (!auth) {
    // Mock mode for development
    console.warn('Using mock authentication in development mode');
    return {
      uid: 'mock-user-123',
      email: email,
      displayName: email.split('@')[0],
      photoURL: '',
      getIdToken: async () => 'mock-id-token-' + Date.now()
    };
  }
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Email sign-in error:', error);
    throw error;
  }
};

export const signUpWithEmail = async (email, password, displayName) => {
  if (!auth) {
    // Mock mode for development
    console.warn('Using mock authentication in development mode');
    return {
      uid: 'mock-user-123',
      email: email,
      displayName: displayName || email.split('@')[0],
      photoURL: '',
      getIdToken: async () => 'mock-id-token-' + Date.now()
    };
  }
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await result.user.updateProfile({ displayName });
    return result.user;
  } catch (error) {
    console.error('Email sign-up error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  if (!auth) {
    // Mock mode - just return success
    console.warn('Using mock authentication in development mode');
    return;
  }
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  if (!auth) {
    // Mock mode - return null
    return null;
  }
  return auth?.currentUser || null;
};

export { auth, db, hasValidConfig };
