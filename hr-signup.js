document.getElementById('hrSignupForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirm = document.getElementById('confirm').value;
  if (password !== confirm) {
    alert("Passwords do not match. Please try again.");
    return;
  }
  if (typeof db !== 'undefined') {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return firebase.firestore().collection('users').doc(user.uid).set({
          fullName: fullName,
          email: user.email,
          role: 'hr',
          createdAt: new Date(),
          status: 'pending'
        });
      })
      .then(() => {
        alert('Account request created. Please wait for admin approval.');
        window.location.href = 'index.html';
      })
      .catch((error) => {
        console.error('ERROR, signup failed:', error.message);
        alert('Signup failed. Please try again!');
      });
  }
});
