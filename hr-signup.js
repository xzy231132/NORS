import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import { firebaseConfig } from './firebase-config.mjs'; // adjust if needed

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("hrSignupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim(); // Ideally hash or store securely

  try {
    await addDoc(collection(db, "accountRequests"), {
      fullName,
      email,
      password,
      role: "hr",
      status: "pending",
      timestamp: serverTimestamp()
    });

    alert("Signup submitted. Please wait for admin approval.");
    window.location.href = "index.html"; // or login page
  } catch (error) {
    console.error("Error submitting signup:", error);
    alert("Signup failed. Please try again.");
  }
});
