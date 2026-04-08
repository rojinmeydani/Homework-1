/* ============================================================
   FORFX Marketing Dashboard — script.js
   Handles: auth simulation, login, signup, dashboard UI
   ============================================================ */

// ──────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────

function getUsers() {
  return JSON.parse(localStorage.getItem('forfx_users') || '[]');
}

function saveUsers(users) {
  localStorage.setItem('forfx_users', JSON.stringify(users));
}

function getSession() {
  return JSON.parse(localStorage.getItem('forfx_session') || 'null');
}

function saveSession(user) {
  localStorage.setItem('forfx_session', JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem('forfx_session');
}

function initials(name) {
  return name
    .split(' ')
    .map(p => p[0] || '')
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ──────────────────────────────────────────
// PAGE DETECTION
// ──────────────────────────────────────────

const page = (function () {
  const path = window.location.pathname;
  if (path.includes('signup')) return 'signup';
  if (path.includes('dashboard')) return 'dashboard';
  return 'login';
})();

// ──────────────────────────────────────────
// LOGIN PAGE
// ──────────────────────────────────────────

if (page === 'login') {
  // If already logged in, go straight to dashboard
  if (getSession()) {
    window.location.replace('dashboard.html');
  }

  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMsg = document.getElementById('errorMsg');
  const loginBtn = document.getElementById('loginBtn');

  form && form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorMsg.style.display = 'none';

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!email || !password) {
      showError('Please enter your email and password.');
      return;
    }

    loginBtn.textContent = 'Signing in…';
    loginBtn.disabled = true;

    // Simulate async auth
    setTimeout(function () {
      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        saveSession(user);
        loginBtn.textContent = '✓ Success! Redirecting…';
        setTimeout(() => window.location.replace('dashboard.html'), 600);
      } else {
        loginBtn.textContent = 'Sign In →';
        loginBtn.disabled = false;
        showError('Invalid email or password. Please try again.');
      }
    }, 700);
  });

  function showError(msg) {
    errorMsg.textContent = '⚠ ' + msg;
    errorMsg.style.display = 'block';
  }
}

// ──────────────────────────────────────────
// SIGN UP PAGE
// ──────────────────────────────────────────

if (page === 'signup') {
  const form = document.getElementById('signupForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMsg = document.getElementById('errorMsg');
  const successMsg = document.getElementById('successMsg');
  const registerBtn = document.getElementById('registerBtn');

  form && form.addEventListener('submit', function (e) {
    e.preventDefault();

    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

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
    registerBtn.disabled = true;

    setTimeout(function () {
      const newUser = { name, email, password };
      users.push(newUser);
      saveUsers(users);

      successMsg.style.display = 'block';
      registerBtn.textContent = '✓ Account Created!';

      setTimeout(() => window.location.replace('index.html'), 1500);
    }, 700);
  });

  function showError(msg) {
    errorMsg.textContent = '⚠ ' + msg;
    errorMsg.style.display = 'block';
  }
}

// ──────────────────────────────────────────
// DASHBOARD PAGE
// ──────────────────────────────────────────

if (page === 'dashboard') {
  const session = getSession();

  // Guard: require login
  if (!session) {
    window.location.replace('index.html');
  } else {
    initDashboard(session);
  }

  function initDashboard(user) {
    // Populate name / avatar throughout
    const userInitials = initials(user.name);
    const firstName = user.name.split(' ')[0];

    setTextIfExists('headerName', user.name);
    setTextIfExists('headerInitials', userInitials);
    setTextIfExists('sidebarName', user.name);
    setTextIfExists('sidebarInitials', userInitials);
    setTextIfExists('welcomeName', firstName);

    // Greeting
    const hour = new Date().getHours();
    const greetingEl = document.getElementById('greeting');
    if (greetingEl) {
      if (hour < 12) greetingEl.textContent = 'morning';
      else if (hour < 17) greetingEl.textContent = 'afternoon';
      else greetingEl.textContent = 'evening';
    }

    // Header date
    const dateEl = document.getElementById('headerDate');
    if (dateEl) {
      const now = new Date();
      dateEl.textContent = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    // Animate progress bars after a short delay
    setTimeout(animateBars, 300);
  }

  function setTextIfExists(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function animateBars() {
    // Progress bars: read the target width from inline style, reset to 0, then animate
    document.querySelectorAll('.progress-fill').forEach(function (bar) {
      const target = bar.style.width;
      bar.style.width = '0%';
      requestAnimationFrame(() => {
        setTimeout(() => { bar.style.width = target; }, 50);
      });
    });

    // Lead bars
    document.querySelectorAll('.lb-fill').forEach(function (bar) {
      const target = bar.style.width;
      bar.style.width = '0%';
      requestAnimationFrame(() => {
        setTimeout(() => { bar.style.width = target; }, 50);
      });
    });
  }
}

// ──────────────────────────────────────────
// GLOBAL DASHBOARD FUNCTIONS
// ──────────────────────────────────────────

function logout() {
  clearSession();
  window.location.replace('index.html');
}

function setActive(el, title) {
  // Remove active from all nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');

  // Update page title
  const titleEl = document.getElementById('pageTitle');
  if (titleEl) titleEl.textContent = title;

  showToast('📂 ' + title + ' opened');
}

let toastTimer = null;

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
