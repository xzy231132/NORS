// commentor: killian green, date: 06/22/25
// script handles the submission of a user to firestore. records name, email, and pwd.
// uses an async function for syntax simplicity
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
      // TODO: encrypt password in some regard (probably hash it?)
      if (typeof db !== 'undefined') {
        try {
          await db.collection('users').add({
            email: email,
            password: password,
            name: name,
            role: "applicant"
            status: "inactive"
          });
          console.log('Applicant successfully recorded to Firestore db');
          location.href = 'applicant-home.html';
        } catch (err) {
          console.error('ERROR, unable to add applicant:', err);
          alert('Submission of user unsuccessful. Please try again!');
        }
      } else {
        console.error('Firestore db is uninitialized.')
      }

    });
