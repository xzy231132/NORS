document.addEventListener("DOMContentLoaded", async () => {
  if (typeof db === "undefined") return alert("Firestore not initialized.");
  // select table body then fetch users + loop through each
  const tableBody = document.querySelector("#usersTable tbody");
  const snapshot = await db.collection("users").get();
  // TODO: this logic should be copied almost directly for HR users when implemented, as
  // well as admins being able to view other admins, but not delete them 
  // TODO: MUST add a Firestore rule that only allows write perms if
  // user's role == 'admin'.
  snapshot.forEach(doc => {
    const user = doc.data();
    if (user.role === "applicant") {
      const row = document.createElement("tr");
      // table definition below with save/delete functionality
      row.innerHTML = `
        <td><input type="text" value="${user.email}" data-id="${doc.id}" class="email-input"/></td>
        <td><input type="text" value="${user.name}" data-id="${doc.id}" class="name-input"/></td>
        <td>
          <button onclick="saveUser('${doc.id}')">Save</button>
          <button onclick="deleteUser('${doc.id}', '${user.email}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    }
  });
});
// called by Save button, pushes updates to user email and names in Firestore
// based off the user ID you supply
async function saveUser(id) {
  const email = document.querySelector(`input.email-input[data-id="${id}"]`).value;
  const name = document.querySelector(`input.name-input[data-id="${id}"]`).value;
  await db.collection("users").doc(id).update({ email, name });
  alert("User updated.");
}
// called by Delete button, prompts for confirmation then pushes to FireStore
async function deleteUser(id, email) {
  if (confirm(`Are you sure you want to delete user ${email}?`)) {
    await db.collection("users").doc(id).delete();
    location.reload();
  }
}
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import { firebaseConfig } from './firebase-config.mjs';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const listEl = document.getElementById("accountRequestsList");

async function loadAccountRequests() {
  const snapshot = await getDocs(collection(db, "accountRequests"));
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${data.fullName}</strong> (${data.email}) - ${data.role}
      <button onclick="approveRequest('${docSnap.id}', '${data.email}', '${data.password}', '${data.fullName}')">✅ Approve</button>
      <button onclick="rejectRequest('${docSnap.id}')">❌ Reject</button>
    `;
    listEl.appendChild(li);
  });
}

window.approveRequest = async (id, email, password, fullName) => {
  const userRef = doc(db, "users", id);
  await setDoc(userRef, {
    fullName,
    email,
    password,
    role: "hr",
    approved: true
  });
  await deleteDoc(doc(db, "accountRequests", id));
  alert("HR account approved.");
  location.reload();
};

window.rejectRequest = async (id) => {
  await deleteDoc(doc(db, "accountRequests", id));
  alert("HR account rejected.");
  location.reload();
};

loadAccountRequests();
