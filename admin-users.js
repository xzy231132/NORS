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
