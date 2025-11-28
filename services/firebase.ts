import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Helper to handle both Vite and standard process.env scenarios if needed
const getEnv = (key: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  return process.env[key.replace('VITE_', '')];
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY') || "YOUR_API_KEY_HERE",
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN') || "pillow-ease.firebaseapp.com",
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID') || "pillow-ease",
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET') || "pillow-ease.appspot.com",
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || "123456789",
  appId: getEnv('VITE_FIREBASE_APP_ID') || "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);