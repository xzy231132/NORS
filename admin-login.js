document.getElementById('adminForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (typeof db !== 'undefined') {
    try {
      const querySnapshot = await db
        .collection('users')
        .where('email', '==', email)
        .where('password', '==', password)
        .where('role', '==', 'admin')
        .get();

      if (!querySnapshot.empty) {
            console.log('Admin login successful');
            localStorage.setItem("adminLoggedIn", "true");
            location.href = 'admin-dashboard.html';
      } else {
        console.error('Invalid admin credentials');
        alert('Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('ERROR during admin login:', err);
      alert('Login failed. Please try again.');
    }
  } else {
    console.error('Firestore db is uninitialized.');
  }
});
