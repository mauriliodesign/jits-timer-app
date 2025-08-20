import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy, limit } from "firebase/firestore";

// Check if Firebase config is available - use both VITE_ and direct env vars
const hasFirebaseConfig = (process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY) && 
  (process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID) &&
  (process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID);

let app: any = null;
let db: any = null;

if (hasFirebaseConfig) {
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
    authDomain: `${process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
    storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID,
  };

  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('Server Firebase initialized successfully');
  } catch (error) {
    console.error('Error initializing server Firebase:', error);
  }
} else {
  console.error('Firebase configuration missing for server');
  console.error('Available env vars:', {
    VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY ? 'SET' : 'MISSING',
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ? 'SET' : 'MISSING',
    VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID ? 'SET' : 'MISSING',
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? 'SET' : 'MISSING',
    VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID ? 'SET' : 'MISSING',
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID ? 'SET' : 'MISSING',
    NODE_ENV: process.env.NODE_ENV
  });
}

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
