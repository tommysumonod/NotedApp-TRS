// firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/*
  Replace the config below with your Firebase project's config
  (found in Firebase Console -> Project Settings).
*/
const firebaseConfig = {
    apiKey: "AIzaSyAn4Yhothj7dKnBLueoJYYiYzL4leQ6jZ4",
    authDomain: "notedpad-trs.firebaseapp.com",
    projectId: "notedpad-trs",
    storageBucket: "notedpad-trs.firebasestorage.app",
    messagingSenderId: "898140273206",
    appId: "1:898140273206:web:4a45bcd9c74647f13af697"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)
