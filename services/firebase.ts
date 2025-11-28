import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID
// };

const firebaseConfig = {
  apiKey: "AIzaSyAEDvHfoKTJWBWy3a1izSUekv-pzjtUcOM",
  authDomain: "pillowease-32001.firebaseapp.com",
  projectId: "pillowease-32001",
  storageBucket: "pillowease-32001.firebasestorage.app",
  messagingSenderId: "396099994176",
  appId: "1:396099994176:web:5a77904991a93626a415a5",
  measurementId: "G-QVDC43EHX7"
};

// Defensive check to avoid crash if env vars are missing during development
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.projectId;

let app;
let authInstance;
let dbInstance;

if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  console.warn("Firebase environment variables are missing.");
}

export const auth = authInstance as import('firebase/auth').Auth;
export const db = dbInstance as import('firebase/firestore').Firestore;
export const googleProvider = new GoogleAuthProvider();