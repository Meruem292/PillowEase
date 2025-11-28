import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAEDvHfoKTJWBWy3a1izSUekv-pzjtUcOM",
  authDomain: "pillowease-32001.firebaseapp.com",
  projectId: "pillowease-32001",
  storageBucket: "pillowease-32001.firebasestorage.app",
  messagingSenderId: "396099994176",
  appId: "1:396099994176:web:5a77904991a93626a415a5",
  measurementId: "G-QVDC43EHX7"
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let googleProvider: GoogleAuthProvider | undefined;

try {
  // Only initialize if the API key is present and not empty
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'undefined') {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } else {
    console.warn("Firebase configuration missing or incomplete. Authentication features will be disabled.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { auth, db, googleProvider };
