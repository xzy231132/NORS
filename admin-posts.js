// very similar logic to user management utils
document.addEventListener("DOMContentLoaded", async () => {
  if (typeof db === "undefined") return alert("Firestore not initialized.");
  const tableBody = document.querySelector("#postsTable tbody");
  const snapshot = await db.collection("jobPostRequests").get();

  snapshot.forEach((doc) => {
    const post = doc.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${post.title || ''}</td>
      <td>${post.company || ''}</td>
      <td>${post.location || ''}</td>
      <td>${post.status || 'Pending'}</td>
      <td>
        <button onclick="approvePost('${doc.id}')">Approve</button>
        <button onclick="rejectPost('${doc.id}')">Reject</button>
        <button onclick="deletePost('${doc.id}', '${post.title || 'Untitled'}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
});

async function approvePost(id) {
  const docRef = db.collection("jobPostRequests").doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    alert("Job post not found.");
    return;
  }

  const postData = docSnap.data();

  // copy to jobPosts
  await db.collection("jobPosts").doc(id).set({
    ...postData,
    status: "Approved"
  });

  // delete original
  await docRef.delete();

  alert("Post approved and published.");
  location.reload();
}

async function rejectPost(id) {
  await db.collection("jobPostRequests").doc(id).update({ status: "Rejected" });
  alert("Post rejected.");
  location.reload();
}

async function deletePost(id, title) {
  if (confirm(`Are you sure you want to delete the post "${title}" (ID: ${id})?`)) {
    console.log(`Deleting post "${title}" with ID: ${id}`);
    await db.collection("jobPostRequests").doc(id).delete();
    location.reload();
  }
}

