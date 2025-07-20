document.getElementById('applicantInfoForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const file = document.getElementById('resumeInput').files[0];
  const status = document.getElementById('uploadStatus');

  if (!file) {
    status.textContent = "Please select a file.";
    return;
  }

  try {
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(`resumes/${email}/${file.name}`);
    await fileRef.put(file);
    const downloadURL = await fileRef.getDownloadURL();

    const snapshot = await db.collection('applicants').where('email', '==', email).get();
    if (!snapshot.empty) {
      const docId = snapshot.docs[0].id;
      await db.collection('applicants').doc(docId).update({
        name,
        resumeUrl: downloadURL
      });
      status.textContent = "Resume uploaded successfully!";
      document.getElementById('resumeLink').href = downloadURL;
      document.getElementById('resumeLink').textContent = "View Resume";
    } else {
      await db.collection('applicants').add({ name, email, resumeUrl: downloadURL });
      status.textContent = "Resume uploaded and applicant created.";
      document.getElementById('resumeLink').href = downloadURL;
      document.getElementById('resumeLink').textContent = "View Resume";
    }
  } catch (error) {
    console.error("Upload failed:", error);
    status.textContent = "Upload failed. Try again.";
  }
});
