import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// still using inline firebase
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

// very similar logic to user management utils
document.addEventListener("DOMContentLoaded", async () => {
  if (typeof db === "undefined") return alert("Firestore not initialized.");
  const tableBody = document.querySelector("#postsTable tbody");
  const snapshot = await getDocs(collection(db, "jobPostRequests"));
  snapshot.forEach((docSnap) => {
    const post = docSnap.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${post.title || ''}</td>
      <td>${post.company || ''}</td>
      <td>${post.location || ''}</td>
      <td>${post.status || 'Pending'}</td>
      <td>
        <button onclick="approvePost('${docSnap.id}')">Approve</button>
        <button onclick="rejectPost('${docSnap.id}')">Reject</button>
        <button onclick="deletePost('${docSnap.id}', '${post.title || 'Untitled'}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
});

window.approvePost = async function(id) {
  const docRef = doc(db, "jobPostRequests", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    alert("Job post not found.");
    return;
  }
  const postData = docSnap.data();
  // copy to jobPosts
  await setDoc(doc(db, "jobPost", id), {
    ...postData,
    status: "Approved"
  });
  // delete original
  await deleteDoc(docRef);
  alert("Post approved and published.");
  location.reload();
}

window.rejectPost = async function(id) {
  await updateDoc(doc(db, "jobPostRequests", id), { status: "Rejected" });
  alert("Post rejected.");
  location.reload();
}

window.deletePost = async function(id, title) {
  if (confirm(`Are you sure you want to delete the post "${title}" (ID: ${id})?`)) {
    console.log(`Deleting post "${title}" with ID: ${id}`);
    await deleteDoc(doc(db, "jobPostRequests", id));
    location.reload();
  }
}
