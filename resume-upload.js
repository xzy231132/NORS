document.getElementById('applicantInfoForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const file = document.getElementById('resumeInput').files[0];
  const status = document.getElementById('uploadStatus');

  if (!file) {
    status.textContent = "Please select a file.";
    return;
  }

  if (typeof db !== 'undefined' && firebase.auth().currentUser) {
    try {
      const user = firebase.auth().currentUser;

      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`resumes/${user.uid}/${file.name}`);
      await fileRef.put(file);
      const downloadURL = await fileRef.getDownloadURL();

      await db.collection('users').doc(user.uid).set({
        name: name,
        email: email,
        phone: phone,
        resumeUrl: downloadURL,
        updatedAt: new Date(),
        role: "applicant"
      }, { merge: true });

      status.textContent = "Resume uploaded and profile updated successfully!";
      document.getElementById('resumeLink').href = downloadURL;
      document.getElementById('resumeLink').textContent = "View Resume";

    } catch (error) {
      console.error("Upload failed:", error);
      status.textContent = "Upload failed. Try again.";
    }
  } else {
    console.error("User not authenticated or DB unavailable.");
    status.textContent = "Authentication error. Please log in again.";
  }
});
