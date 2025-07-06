import { auth, db } from "./firebase-config.mjs";
import {
  doc, getDoc, getDocs, collection, updateDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) return window.location.href = "index.html";

  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists() || userDoc.data().role !== 'admin') {
    alert("Access denied.");
    return window.location.href = "index.html";
  }

  loadUsers();
});

async function loadUsers() {
  const tableBody = document.querySelector("#userTable tbody");
  tableBody.innerHTML = "";

  const snapshot = await getDocs(collection(db, "users"));
  snapshot.forEach(docSnap => {
    const user = docSnap.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name || "N/A"}</td>
      <td>${user.email}</td>
      <td>${user.active ? "Active" : "Inactive"}</td>
      <td>
        <button onclick="toggleUser('${docSnap.id}', ${user.active})">${user.active ? "Deactivate" : "Activate"}</button>
        <button onclick="editUser('${docSnap.id}')">Edit</button>
        <button onclick="deleteUser('${docSnap.id}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

window.toggleUser = async function (uid, active) {
  await updateDoc(doc(db, "users", uid), { active: !active });
  loadUsers();
};

window.editUser = async function (uid) {
  const newName = prompt("Enter new name:");
  if (newName) {
    await updateDoc(doc(db, "users", uid), { name: newName });
    loadUsers();
  }
};

window.deleteUser = async function (uid) {
  if (confirm("Are you sure?")) {
    await deleteDoc(doc(db, "users", uid));
    loadUsers();
  }
};
