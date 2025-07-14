import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { firebaseConfig } from './firebase-config.mjs';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("addJobForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const company = document.getElementById("company").value.trim();
  const location = document.getElementById("location").value.trim();
  const requirements = document.getElementById("requirements").value.trim();
  const description = document.getElementById("description").value.trim();
  const deadline = document.getElementById("deadline").value;

  try {
    await addDoc(collection(db, "jobPosts"), {
      title,
      company,
      location,
      requirements,
      description,
      deadline,
      postedBy: "admin",
      status: "Approved",
      timestamp: serverTimestamp()
    });

    alert("Job successfully added.");
    document.getElementById("addJobForm").reset();
  } catch (err) {
    console.error("Error adding job:", err);
    alert("Failed to add job post.");
  }
});
