import {
  clearAccessToken,
  getFacebookProfile,
  getInstagramAccounts,
  getSelectedInstagramId
} from '/logged/js/auth.js';

export function insertHeaderFooter(options = {}) {
  // 1. Datos IG seleccionada (prioridad IG sobre FB)
  const igAccounts = getInstagramAccounts();
  const igId = getSelectedInstagramId();
  const igSelected = igAccounts.find(acc => acc.id === igId);
  const fbProfile = getFacebookProfile();

  // 2. Foto y nombre preferentemente de IG, si no FB
  let userImg = igSelected?.profile_picture_url || fbProfile?.picture?.data?.url || "/img/ig_default.png";
  let userName = igSelected?.username ? `@${igSelected.username}` : (fbProfile?.name || "Usuario");

  // 3. Header HTML
  document.body.insertAdjacentHTML('afterbegin', `
    <header class="header">
      <div class="header-container">
        <a href="/logged/dashboard.html" class="logo-link">
          <img src="/img/logo.png" alt="EPM APP Logo" class="logo">
        </a>
        <nav class="main-nav">
            <a href="/logged/dashboard.html">Dashboard</a>
            <a href="/logged/reportes/reportes.html">Reportes</a>
            <a href="/logged/mentoria.html">Mentoría</a>
            <a href="/logged/estrategia.html">Estrategia</a>
            <a href="/logged/config.html">Configuración</a>
        </nav>
        <div class="header-user">
          <img src="${userImg}" alt="${userName}" class="header-user-img">
          <span class="header-user-name">${userName}</span>
          <button class="header-user-menu-btn" id="user-menu-btn" title="Opciones">&#x25BC;</button>
          <div class="header-user-menu" id="user-menu">
            <a href="#" id="logout-link">Cerrar sesión</a>
          </div>
        </div>
        <button class="nav-toggle" id="nav-toggle" aria-label="Abrir menú">&#9776;</button>
      </div>
    </header>
  `);

  // Footer igual que antes
  document.body.insertAdjacentHTML('beforeend', `
    <footer class="footer">
      <div class="container footer-content">
        <img src="/img/logo.png" alt="EPM APP Logo" class="logo-footer">
        <div>
          <a href="/terms.html" target="_blank">Terms of Service</a> | 
          <a href="/privacy-policy.html" target="_blank">Privacy Policy</a>
        </div>
        <div class="footer-note">© 2025 EPM APP</div>
      </div>
    </footer>
  `);

  // --- Lógica del menú usuario desplegable ---
  document.addEventListener('click', function(e) {
    const btn = document.getElementById('user-menu-btn');
    const menu = document.getElementById('user-menu');
    if (!btn || !menu) return;
    if (e.target === btn) {
      menu.classList.toggle('open');
      e.stopPropagation();
    } else if (!menu.contains(e.target)) {
      menu.classList.remove('open');
    }
  });

  // --- Menú hamburguesa para mobile ---
  document.getElementById('nav-toggle').onclick = function() {
    document.querySelector('.main-nav').classList.toggle('nav-open');
  };

  // --- Logout (incluido aquí) ---
  document.addEventListener('click', function(e) {
    if (e.target.matches('#logout-link')) {
      e.preventDefault();
      clearAccessToken();
      // Cierra el menú usuario si existe
      const menu = document.getElementById('user-menu');
      if (menu) menu.classList.remove('open');
      window.location.href = '/index.html';
    }
  });
}