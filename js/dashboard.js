/* ============================================================
   FORFX Marketing Dashboard — js/dashboard.js
   Handles dashboard page initialization and interactions
   ============================================================ */

// ──────────────────────────────────────────
// INIT — guard & boot
// ──────────────────────────────────────────

(function () {
  const session = getSession();

  if (!session) {
    window.location.replace('index.html');
    return;
  }

  initDashboard(session);

  function initDashboard(user) {
    const userInitials = initials(user.name);
    const firstName    = user.name.split(' ')[0];

    setTextIfExists('headerName',     user.name);
    setTextIfExists('headerInitials', userInitials);
    setTextIfExists('sidebarName',    user.name);
    setTextIfExists('sidebarInitials', userInitials);
    setTextIfExists('welcomeName',    firstName);

    // Time-based greeting
    const hour       = new Date().getHours();
    const greetingEl = document.getElementById('greeting');
    if (greetingEl) {
      if (hour < 12)      greetingEl.textContent = 'morning';
      else if (hour < 17) greetingEl.textContent = 'afternoon';
      else                greetingEl.textContent = 'evening';
    }

    // Header date
    const dateEl = document.getElementById('headerDate');
    if (dateEl) {
      dateEl.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month:   'short',
        day:     'numeric',
        year:    'numeric'
      });
    }

    setTimeout(animateBars, 300);
  }

  function setTextIfExists(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function animateBars() {
    document.querySelectorAll('.progress-fill, .lb-fill').forEach(function (bar) {
      const target   = bar.style.width;
      bar.style.width = '0%';
      requestAnimationFrame(() => {
        setTimeout(() => { bar.style.width = target; }, 50);
      });
    });
  }
})();

// ──────────────────────────────────────────
// GLOBAL DASHBOARD FUNCTIONS
// (called from inline onclick attributes in the HTML)
// ──────────────────────────────────────────

function logout() {
  clearSession();
  window.location.replace('index.html');
}

function setActive(el, title) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');

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
