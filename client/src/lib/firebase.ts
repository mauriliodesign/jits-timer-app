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
  // Helper to validate config
  const isValidConfig = (apiKey: string, projectId: string, appId: string) => {
    return apiKey && 
           apiKey !== 'your_firebase_api_key_here' && 
           projectId && 
           projectId !== 'your_firebase_project_id_here' &&
           appId &&
           appId !== 'your_firebase_app_id_here';
  };

  // Try import.meta.env first (for development and build time)
  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const envAppId = import.meta.env.VITE_FIREBASE_APP_ID;

  if (isValidConfig(envApiKey, envProjectId, envAppId)) {
    console.log('Firebase config from env variables');
    return {
      apiKey: envApiKey,
      authDomain: `${envProjectId}.firebaseapp.com`,
      projectId: envProjectId,
      storageBucket: `${envProjectId}.firebasestorage.app`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: envAppId,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    };
  }
  
  // Try window variables (for production runtime injection)
  if (typeof window !== 'undefined') {
    const winApiKey = (window as any).VITE_FIREBASE_API_KEY;
    const winProjectId = (window as any).VITE_FIREBASE_PROJECT_ID;
    const winAppId = (window as any).VITE_FIREBASE_APP_ID;

    if (isValidConfig(winApiKey, winProjectId, winAppId)) {
      console.log('Firebase config from window variables');
      return {
        apiKey: winApiKey,
        authDomain: `${winProjectId}.firebaseapp.com`,
        projectId: winProjectId,
        storageBucket: `${winProjectId}.firebasestorage.app`,
        messagingSenderId: (window as any).VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: winAppId,
        measurementId: (window as any).VITE_FIREBASE_MEASUREMENT_ID,
      };
    }
  }
  
  console.warn('Firebase configuration not found or invalid');
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