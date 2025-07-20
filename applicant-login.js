document.getElementById('applicantForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  // trim inputs to avoid whitespace issues
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  try {
    const userCredentials = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredentials.user;
    const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
    if (userDoc.exists && userDoc.data().role === 'applicant') {
      console.log('Login successful');
      location.href = 'applicant-home.html';
    } else {
      console.error('No applicant with your credentials found. This could be due to incorrect credentials or your account may not be an applicant.');
      alert('No applicant with your credentials found. Please try again.');
    }
  } catch (error) {
    console.error('Login failed:', error);
    alert('Invalid email or password. Please try again.');
  }
});
