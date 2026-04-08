/* ============================================================
   FORFX Marketing Dashboard — js/utils.js
   Shared utility functions used across all pages
   ============================================================ */

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
