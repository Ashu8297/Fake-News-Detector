// Firebase Web SDK Configuration for TruthLens AI Real Google OAuth
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup,
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from 'firebase/auth';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const isValidKey = apiKey && !apiKey.includes('DemoApiKey');

let auth = null;
let googleProvider = null;
let facebookProvider = null;

if (isValidKey) {
  const firebaseConfig = {
    apiKey: apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "truthlens-ai.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "truthlens-ai-project",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "truthlens-ai.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abc123def456"
  };

  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
  facebookProvider = new FacebookAuthProvider();
}

export { auth, googleProvider, facebookProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber };
