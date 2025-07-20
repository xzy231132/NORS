document.getElementById('hrForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  // trim inputs to avoid whitespace issues
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  try {
    const userCredentials = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredentials.user;
    const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
    if (userDoc.exists && userDoc.data().role === 'hr') {
      console.log('Login successful');
      location.href = 'hr-home.html';
    } else {
      console.error('No employee with your credentials found. This could be due to incorrect credentials or your account may not be under HR.');
      alert('No employee with your credentials found. Please try again.');
    }
  } catch (error) {
    console.error('Login failed:', error);
    alert('Invalid email or password. Please try again.');
  }
});
