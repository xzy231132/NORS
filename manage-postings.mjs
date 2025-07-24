// firebase 
import { auth, db } from "./firebase-config.mjs";
import {
  collection, addDoc, getDocs, deleteDoc, doc, getDoc,
  query, where
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// dom refs
const listEl = document.getElementById("jobPostingsContainer");
const formEl = document.getElementById("addJobForm");

let currentUserRole = null;
let currentCompany = null;
let currentEmail = null;

// auth and role check
onAuthStateChanged(auth, async (user) => {
  if (!user) return (window.location.href = "index.html");

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    alert("User record not found.");           // just-in-case
    return (window.location.href = "index.html");
  }

  const { role, email, company } = userDoc.data();
  currentUserRole = role;
  currentCompany = company || null;
  currentEmail = email;

  if (role === "admin")      loadPosts();         // all posts
  else if (role === "hr")    loadPosts(email);    // only their posts
  else {
    alert("Access denied.");
    return (window.location.href = "index.html");
  }

  // handle new job submission
  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title        = formEl.title.value.trim();
    const location     = formEl.location.value.trim();
    const requirements = formEl.requirements.value.trim();
    const deadline     = formEl.deadline.value;
    const description  = formEl.description.value.trim();

    await addDoc(collection(db, "jobPost"), {
      title,
      company: currentCompany || "Unknown Company",
      location,
      requirements,
      deadline,
      description,
      postedBy: email,
      createdAt: new Date()
    });

    formEl.reset();
    loadPosts(role === "admin" ? null : email);
  });
});

//helpers 
async function loadPosts (emailFilter = null) {
  listEl.innerHTML = "";

  const q = emailFilter
      ? query(collection(db, "jobPost"), where("postedBy", "==", emailFilter))
      : collection(db, "jobPost");

  const snap = await getDocs(q);

  if (snap.empty) {
    listEl.innerHTML = "<p>No job posts found.</p>";
    return;
  }

  snap.forEach((docSnap) => {
    const job = docSnap.data();
    const div = document.createElement("div");
    div.className = "job-card";
    div.innerHTML = `
      <h3>${job.title}</h3>
      <p><strong>Company:</strong> ${job.company}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Deadline:</strong> ${job.deadline}</p>
      <p>${job.description}</p>
      <button onclick="deleteJob('${docSnap.id}')">Delete</button>
      <hr>
    `;
    listEl.appendChild(div);
  });
}

window.deleteJob = async function (id) {
  if (confirm("Delete this job post?")) {
    await deleteDoc(doc(db, "jobPost", id));
    loadPosts(currentUserRole === "admin" ? null : currentEmail);
  }
}

