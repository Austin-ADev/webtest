// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBzVYrsnc8NAE-tr9XTEVbSeRY9GL2yHVg",
  authDomain: "webtest-4943a.firebaseapp.com",
  projectId: "webtest-4943a",
  storageBucket: "webtest-4943a.firebasestorage.app",
  messagingSenderId: "84924124626",
  appId: "1:84924124626:web:73098a19326ed1a4ec8c0b",
  measurementId: "G-9MNX5MX0Z2"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export const db = getFirestore(app);

export {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
};
