// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// JobPilot Italia 1 এর configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8YP8yurdpHdLVZzi1MJQBzXf3Q2vQ9aA",
  authDomain: "jobpilot-italia-1.firebaseapp.com",
  projectId: "jobpilot-italia-1",
  storageBucket: "jobpilot-italia-1.appspot.com",
  messagingSenderId: "273453116522",
  appId: "1:273453116522:web:5183b8ef1152b4a4c8a4b9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
