import { auth, signInWithEmailAndPassword, onAuthStateChanged } from '../firebase.js';

const loginBtn = document.getElementById('loginBtn');
const emailEl = document.getElementById('email');
const passEl = document.getElementById('password');
const msg = document.getElementById('msg');

// When user logs in or is already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User logged in:', user.email);
    // Use relative path correctly from inside /renderer/
    window.location.href = './dashboard.html';
  } else {
    console.log('No user logged in');
  }
});

// When login button is clicked
loginBtn.addEventListener('click', async () => {
  const email = emailEl.value.trim();
  const pass = passEl.value.trim();
  if (!email || !pass) {
    msg.textContent = 'Enter email and password.';
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, pass);
    msg.textContent = 'Login successful... Redirecting';
    // Redirect after short delay (smoother UX)
    setTimeout(() => (window.location.href = './dashboard.html'), 500);
  } catch (error) {
    msg.textContent = 'Login failed: ' + error.message;
    console.error(error);
  }
});
