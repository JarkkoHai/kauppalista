import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCPFPGPWEej3edgSJWSPsszxXTMgYtmawE",
  authDomain: "kauppalista-pro.firebaseapp.com",
  projectId: "kauppalista-pro",
  storageBucket: "kauppalista-pro.firebasestorage.app",
  messagingSenderId: "112921751444",
  appId: "1:112921751444:web:07e885a284a4f38b34e981"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const APP_ID = 'kauppalista-pro-v1';
export const COLLECTION_PATH = 'shared_shopping_lists';