// firebase.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, push, set, update, remove, onValue, get } from 'firebase/database';
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Same firebaseConfig as before...
// Rest of the code remains the sameimport { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
// Comment out Analytics - it often fails in production
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
import { 
  getAuth, signInWithEmailAndPassword, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { 
  getDatabase, ref, push, set, update, remove, onValue, get 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { 
  getStorage, ref as sRef, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBgg69Tq4hqzDeGwflnoV9b8ALrVIxAYdQ",
  authDomain: "lizaz-enterprises-ltd.firebaseapp.com",
  projectId: "lizaz-enterprises-ltd",
  storageBucket: "lizaz-enterprises-ltd.firebasestorage.app",
  messagingSenderId: "465801710974",
  appId: "1:465801710974:web:0dbe9d8a91e3d8c0bff72f",
  measurementId: "G-V4R36ZYP2T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Comment out analytics initialization
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

// Update exports - remove analytics
export { 
  auth, db, storage, ref, push, set, update, remove, onValue, get, 
  signInWithEmailAndPassword, onAuthStateChanged, sRef, uploadBytes, getDownloadURL 
};
