
// firebase-init.js

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyMCOePIbciCf0yTBpIuKd1XF33lRJJUY",
  authDomain: "onlinerecruitmentsystem-87364.firebaseapp.com",
  projectId: "onlinerecruitmentsystem-87364",
  storageBucket: "onlinerecruitmentsystem-87364.firebasestorage.app",
  messagingSenderId: "882762844501",
  appId: "1:882762844501:web:91e5957d78db388372c7dc",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
firebase.auth(); 
