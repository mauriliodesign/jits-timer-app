import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';

// Check if Firebase config is available
const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_API_KEY !== 'your_firebase_api_key_here' &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_APP_ID;

let app: any = null;
let auth: any = null;
let googleProvider: any = null;
let analytics: any = null;

if (hasFirebaseConfig) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    
    // Initialize Analytics only in production
    if (!isDevelopment) {
      analytics = getAnalytics(app);
    }

    // Configure Google provider
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
} else {
  if (isDevelopment) {
    // Mock Firebase for development only
    console.log('Firebase disabled for development - using mock auth');
    auth = {
      onAuthStateChanged: (callback: (user: User | null) => void) => {
        // Return a mock user for development
        callback({
          uid: 'dev-user',
          email: 'dev@example.com',
          displayName: 'Development User',
        } as User);
        return () => {}; // Return unsubscribe function
      }
    };
    googleProvider = null;
  } else {
    console.error('Firebase configuration missing for production');
  }
}

// Auth functions
export const signInWithGoogle = () => {
  if (!auth || !googleProvider) {
    throw new Error('Firebase not initialized');
  }
  return signInWithPopup(auth, googleProvider);
};

export const logout = () => {
  if (!auth) {
    throw new Error('Firebase not initialized');
  }
  return signOut(auth);
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    if (isDevelopment) {
      // Return mock user for development
      callback({
        uid: 'dev-user',
        email: 'dev@example.com',
        displayName: 'Development User',
      } as User);
      return () => {}; // Return unsubscribe function
    } else {
      // In production, return null if Firebase is not available
      callback(null);
      return () => {};
    }
  }
  return onAuthStateChanged(auth, callback);
};

// Analytics function
export const logEvent = (eventName: string, parameters?: any) => {
  if (analytics && !isDevelopment) {
    // Import and use analytics here if needed
    console.log('Analytics event:', eventName, parameters);
  }
};