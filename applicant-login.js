// commentor: killian green, date: 06/22/25
// uses similar logic as signup.js, searches for user's info in the applicants database
// logs you in if successful
document.getElementById('applicantForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  // trim inputs to avoid whitespace issues
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  if (typeof db !== 'undefined') {
    try {
      const querySnapshot = await db
        .collection('users')
        .where('email', '==', email)
        .where('password', '==', password)
        .where('role', '==', 'applicant')
        .get();
      if (!querySnapshot.empty) {
        console.log('Login successful');
        location.href = 'applicant-home.html';
      } else {
        console.error('Invalid email or password');
        alert('Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('ERROR unable to login:', err);
      alert('Login failed. Please try again.');
    }
  } else {
    console.error('Firestore db is uninitialized.');
  }
});
