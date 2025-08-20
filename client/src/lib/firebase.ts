import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy, limit } from "firebase/firestore";

// Extend Window interface for Firebase config
declare global {
  interface Window {
    VITE_FIREBASE_API_KEY?: string;
    VITE_FIREBASE_PROJECT_ID?: string;
    VITE_FIREBASE_APP_ID?: string;
    VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
    VITE_FIREBASE_MEASUREMENT_ID?: string;
  }
}

// Check if Firebase config is available (runtime check)
const getFirebaseConfig = () => {
  // Try import.meta.env first (for development)
  if (import.meta.env.VITE_FIREBASE_API_KEY && 
      import.meta.env.VITE_FIREBASE_API_KEY !== 'your_firebase_api_key_here' &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID &&
      import.meta.env.VITE_FIREBASE_APP_ID) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    };
  }
  
  // Try window variables (for production)
  if (window.VITE_FIREBASE_API_KEY && 
      window.VITE_FIREBASE_PROJECT_ID &&
      window.VITE_FIREBASE_APP_ID) {
    return {
      apiKey: window.VITE_FIREBASE_API_KEY,
      authDomain: `${window.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: window.VITE_FIREBASE_PROJECT_ID,
      storageBucket: `${window.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
      messagingSenderId: window.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: window.VITE_FIREBASE_APP_ID,
      measurementId: window.VITE_FIREBASE_MEASUREMENT_ID,
    };
  }
  
  return null;
};

const firebaseConfig = getFirebaseConfig();
const hasFirebaseConfig = !!firebaseConfig;

let app: any = null;
let auth: any = null;
let db: any = null;
let googleProvider: any = null;
let analytics: any = null;

if (hasFirebaseConfig && firebaseConfig) {

  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    
    // Initialize Analytics
    analytics = getAnalytics(app);

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
  console.error('Firebase configuration missing');
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
    // Return null if Firebase is not available
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

// Analytics function
export const logEvent = (eventName: string, parameters?: any) => {
  if (analytics) {
    // Import and use analytics here if needed
    console.log('Analytics event:', eventName, parameters);
  }
};

// Firestore functions
export const createDocument = async (collectionName: string, data: any, id?: string) => {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  
  const docRef = id ? doc(db, collectionName, id) : doc(collection(db, collectionName));
  await setDoc(docRef, {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return { id: docRef.id, ...data };
};

export const getDocument = async (collectionName: string, id: string) => {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  
  return null;
};

export const updateDocument = async (collectionName: string, id: string, data: any) => {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date()
  });
  
  return { id, ...data };
};

export const deleteDocument = async (collectionName: string, id: string) => {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
  
  return true;
};

export const getDocuments = async (collectionName: string, orderByField?: string, limitCount?: number) => {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  
  let q: any = collection(db, collectionName);
  
  if (orderByField) {
    q = query(q, orderBy(orderByField, 'desc'));
  }
  
  if (limitCount) {
    q = query(q, limit(limitCount));
  }
  
  const querySnapshot = await getDocs(q);
  const documents: any[] = [];
  
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...(doc.data() as any) });
  });
  
  return documents;
};

export const getLatestDocument = async (collectionName: string) => {
  const documents = await getDocuments(collectionName, 'createdAt', 1);
  return documents.length > 0 ? documents[0] : null;
};