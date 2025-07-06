// firebase-config.mjs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAyMCOePIbciCf0yTBpIuKd1XF33lRJJUY",
  authDomain: "onlinerecruitmentsystem-87364.firebaseapp.com",
  projectId: "onlinerecruitmentsystem-87364",
  storageBucket: "onlinerecruitmentsystem-87364.firebasestorage.app",
  messagingSenderId: "882762844501",
  appId: "1:882762844501:web:91e5957d78db388372c7dc",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
