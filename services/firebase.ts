import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Helper to safely get env vars without crashing if import.meta.env is undefined
const getEnv = (key: string): string => {
  try {
    // @ts-ignore
    return import.meta.env?.[key] || '';
  } catch (e) {
    console.warn(`Failed to load environment variable: ${key}`);
    return '';
  }
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID')
};

// Singleton pattern to prevent multiple initializations
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
const googleProvider = new GoogleAuthProvider();

try {
  if (!getApps().length) {
    // Only initialize if config is valid to avoid immediate crash
    if (firebaseConfig.apiKey) {
      app = initializeApp(firebaseConfig);
    } else {
      console.warn("Firebase Config missing. App will run in UI-only mode.");
      // Create a dummy app object if needed or let the individual exports fail gracefully
      // For now, we allow the app to be undefined, and we'll check it in hooks
    }
  } else {
    app = getApps()[0];
  }
  
  if (app) {
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

export { auth, db, googleProvider };