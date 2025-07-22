document.getElementById('adminForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  try {
    const userCredentials = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredentials.user;
    const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
    
    if (userDoc.exists && userDoc.data().role === 'admin') {
      console.log('Admin login successful');
      localStorage.setItem("adminLoggedIn", "true");
      location.href = 'admin-dashboard.html';
    } else {
      console.error('No admin with your credentials found. This could be due to incorrect credentials or your account may not be an admin.');
      alert('No admin with your credentials found. Please try again.');
      // to prevent shenanigans sign out the user if they try and fail to log in as an admin
      await firebase.auth().signOut();
    }
  } catch (error) {
    console.error('Login failed:', error);
    alert('Invalid email or password. Please try again.');
  }
});
