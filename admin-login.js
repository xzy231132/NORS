document.getElementById('adminForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    // Sign in using Firebase Auth
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Check if this user has admin privileges in Firestore
    const doc = await db.collection('users').doc(user.uid).get();

    if (doc.exists && doc.data().role === 'admin') {
      console.log('Admin login successful');
      localStorage.setItem('adminLoggedIn', 'true');
      location.href = 'admin-dashboard.html';
    } else {
      console.error('Not an admin');
      alert('You do not have admin privileges.');
      await firebase.auth().signOut(); // Logout unauthorized user
    }

  } catch (err) {
    console.error('ERROR during admin login:', err.message);
    alert('Invalid email or password. Please try again.');
  }
});
