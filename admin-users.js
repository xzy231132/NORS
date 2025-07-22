import { collection, getDocs, deleteDoc, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";


// having firebase initialization issues, trying it inline

const firebaseConfig = {
  apiKey: "AIzaSyAyMCOePIbciCf0yTBpIuKd1XF33lRJJUY",
  authDomain: "onlinerecruitmentsystem-87364.firebaseapp.com",
  projectId: "onlinerecruitmentsystem-87364",
  storageBucket: "onlinerecruitmentsystem-87364.firebasestorage.app",
  messagingSenderId: "882762844501",
  appId: "1:882762844501:web:91e5957d78db388372c7dc",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
  if (typeof db === "undefined") return alert("Firestore not initialized.");
  // select table body then fetch users + loop through each
  const tableBody = document.querySelector("#usersTable tbody");
  snapshot.forEach(docSnap => {
    const user = docSnap.data();
    if (user.role === "applicant") {
      const row = document.createElement("tr");
      // table definition below with save/delete functionality
      row.innerHTML = `
        <td><input type="text" value="${user.email}" data-id="${docSnap.id}" class="email-input"/></td>
        <td><input type="text" value="${user.name}" data-id="${docSnap.id}" class="name-input"/></td>
        <td>
          <button onclick="saveUser('${docSnap.id}')">Save</button>
          <button onclick="deleteUser('${docSnap.id}', '${user.email}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    }
  });
});

// called by Save button, pushes updates to user email and names in Firestore
// based off the user ID you supply
window.saveUser = async function(id) {
  const email = document.querySelector(`input.email-input[data-id="${id}"]`).value;
  const name = document.querySelector(`input.name-input[data-id="${id}"]`).value;
  await updateDoc(doc(db, "users", id), { email, name });
  alert("User updated.");
}

// called by Delete button, prompts for confirmation then pushes to FireStore
window.deleteUser = async function(id, email) {
  if (confirm(`Are you sure you want to delete user ${email}?`)) {
    await deleteDoc(doc(db, "users", id));
    location.reload();
  }
}

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

window.approveRequest = async (id, email, password, fullName, company) => {
  const userRef = doc(db, "users", id);
  await setDoc(userRef, {
    fullName,
    email,
    password,
    role: "hr",
    approved: true,
    company: company
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
