    document.getElementById('applicantSignupForm').addEventListener('submit', async function (event) {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const name = document.getElementById('name').value;
      const password = document.getElementById('password').value;
      const confirm = document.getElementById('confirm').value;
      if (password !== confirm) {
        alert("Passwords do not match. Please try again.");
        return;
      }
      if (typeof db !== 'undefined') {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        // create user and promise to initialize their info, then redirect them home if successful
        // or log and output that there was an error
        // note: we don't store passwords anymore, firebase hashes them for us
        .then((userCredential) => {
                const user = userCredential.user;
                return db.collection('users').doc(user.uid).set({
                  email: user.email,
                  name: name,
                  role: "applicant",
                  createdAt: new Date()
                });
              })
          .then(() => { 
              console.log('Applicant successfully recorded to Firestore db. Please log in now.');
              location.href = 'applicant-login.html';
          })
        .catch ((error) => {
          console.error('ERROR, unable to add applicant:', error.message);
          alert('Submission of user unsuccessful. Please try again!');
        });
    else {
        console.error('Firestore db is uninitialized.');
    }
});

