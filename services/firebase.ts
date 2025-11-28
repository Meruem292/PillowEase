import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAEDvHfoKTJWBWy3a1izSUekv-pzjtUcOM",
  authDomain: "pillowease-32001.firebaseapp.com",
  projectId: "pillowease-32001",
  storageBucket: "pillowease-32001.firebasestorage.app",
  messagingSenderId: "396099994176",
  appId: "1:396099994176:web:5a77904991a93626a415a5",
  measurementId: "G-QVDC43EHX7"
};
// Initialize Firebase only if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();