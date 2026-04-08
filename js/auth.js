/* ============================================================
   FORFX Marketing Dashboard — js/auth.js
   Handles login and sign-up page logic
   ============================================================ */

const page = (function () {
  const path = window.location.pathname;
  if (path.includes('signup')) return 'signup';
  return 'login';
})();

// ──────────────────────────────────────────
// LOGIN PAGE
// ──────────────────────────────────────────

if (page === 'login') {
  if (getSession()) {
    window.location.replace('dashboard.html');
  }

  const form        = document.getElementById('loginForm');
  const emailInput  = document.getElementById('email');
  const passInput   = document.getElementById('password');
  const errorMsg    = document.getElementById('errorMsg');
  const loginBtn    = document.getElementById('loginBtn');

  form && form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorMsg.style.display = 'none';

    const email    = emailInput.value.trim().toLowerCase();
    const password = passInput.value;

    if (!email || !password) {
      showError('Please enter your email and password.');
      return;
    }

    loginBtn.textContent = 'Signing in…';
    loginBtn.disabled    = true;

    setTimeout(function () {
      const users = getUsers();
      const user  = users.find(u => u.email === email && u.password === password);

      if (user) {
        saveSession(user);
        loginBtn.textContent = '✓ Success! Redirecting…';
        setTimeout(() => window.location.replace('dashboard.html'), 600);
      } else {
        loginBtn.textContent = 'Sign In →';
        loginBtn.disabled    = false;
        showError('Invalid email or password. Please try again.');
      }
    }, 700);
  });

  function showError(msg) {
    errorMsg.textContent   = '⚠ ' + msg;
    errorMsg.style.display = 'block';
  }
}

// ──────────────────────────────────────────
// SIGN UP PAGE
// ──────────────────────────────────────────

if (page === 'signup') {
  const form        = document.getElementById('signupForm');
  const nameInput   = document.getElementById('name');
  const emailInput  = document.getElementById('email');
  const passInput   = document.getElementById('password');
  const errorMsg    = document.getElementById('errorMsg');
  const successMsg  = document.getElementById('successMsg');
  const registerBtn = document.getElementById('registerBtn');

  form && form.addEventListener('submit', function (e) {
    e.preventDefault();

    errorMsg.style.display   = 'none';
    successMsg.style.display = 'none';

    const name     = nameInput.value.trim();
    const email    = emailInput.value.trim().toLowerCase();
    const password = passInput.value;

    if (!name || !email || !password) {
      showError('Please fill in all fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters.');
      return;
    }

    const users = getUsers();

    if (users.find(u => u.email === email)) {
      showError('An account with this email already exists. Sign in instead.');
      return;
    }

    registerBtn.textContent = 'Creating account…';
    registerBtn.disabled    = true;

    setTimeout(function () {
      users.push({ name, email, password });
      saveUsers(users);

      successMsg.style.display = 'block';
      registerBtn.textContent  = '✓ Account Created!';

      setTimeout(() => window.location.replace('index.html'), 1500);
    }, 700);
  });

  function showError(msg) {
    errorMsg.textContent   = '⚠ ' + msg;
    errorMsg.style.display = 'block';
  }
}
