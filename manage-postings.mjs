import { auth, db } from "./firebase-config.mjs";
import {
  doc, getDoc, getDocs, collection, updateDoc, query, where
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) return window.location.href = "index.html";

  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    alert("User record not found.");
    return window.location.href = "index.html";
  }

  const role = userDoc.data().role;
  const email = userDoc.data().email;

  if (role === "admin") {
    loadAdminPosts();
  } else if (role === "hr") {
    loadHRPosts(email);
  } else {
    alert("Access denied.");
    return window.location.href = "index.html";
  }
});

async function loadAdminPosts() {
  const tableBody = document.querySelector("#postTable tbody");
  tableBody.innerHTML = "";

  const snapshot = await getDocs(collection(db, "jobPosts"));
  snapshot.forEach(docSnap => {
    const post = docSnap.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${post.title}</td>
      <td>${post.status || "Pending"}</td>
      <td>
        <button onclick="updateStatus('${docSnap.id}', 'approved')">Approve</button>
        <button onclick="updateStatus('${docSnap.id}', 'rejected')">Reject</button>
        <button onclick="flagPost('${docSnap.id}')">Flag</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

async function loadHRPosts(email) {
  const tableBody = document.querySelector("#postTable tbody");
  tableBody.innerHTML = "";

  const q = query(collection(db, "jobPosts"), where("postedBy", "==", email));
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {
    const post = docSnap.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${post.title}</td>
      <td>${post.status || "Pending"}</td>
      <td>—</td>
    `;
    tableBody.appendChild(row);
  });
}

// Admin-only actions
window.updateStatus = async function (id, status) {
  await updateDoc(doc(db, "jobPosts", id), { status });
  loadAdminPosts();
};

window.flagPost = async function (id) {
  await updateDoc(doc(db, "jobPosts", id), { flagged: true });
  loadAdminPosts();
};
