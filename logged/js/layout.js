// Inserta header y footer, y habilita el logout

import { clearAccessToken } from './auth.js';

export function insertHeaderFooter(options = {}) {
  // Header
  document.body.insertAdjacentHTML('afterbegin', `
    <header class="header">
      <div class="container header-content">
        <img src="../img/logo.png" alt="EPM APP Logo" class="logo">
        <nav>
          <a href="../index.html">Home</a>
          <a href="index.html">Dashboard</a>
          <a href="#logout" id="logout-link">Logout</a>
        </nav>
      </div>
    </header>
  `);
  // Footer
  document.body.insertAdjacentHTML('beforeend', `
    <footer class="footer">
      <div class="container footer-content">
        <img src="../img/logo.png" alt="EPM APP Logo" class="logo-footer">
        <div>
          <a href="../terms.html" target="_blank">Terms of Service</a> | 
          <a href="../privacy-policy.html" target="_blank">Privacy Policy</a>
        </div>
        <div class="footer-note">© 2025 EPM APP</div>
      </div>
    </footer>
  `);
}

export function enableLogout() {
  document.addEventListener('click', function(e) {
    if (e.target.matches('#logout-link')) {
      e.preventDefault();
      clearAccessToken();
      window.location.href = '../index.html';
    }
  });
}