import { clearAccessToken, getFacebookProfile, getInstagramAccounts, getSelectedInstagramId } from './auth.js';

/**
 * Inserta el header y el footer en el body del documento.
 */
export function insertHeaderFooter(options = {}) {
  // Obtener datos del usuario de Facebook (si existen)
  const profile = getFacebookProfile();
  let userHTML = '';
  if (profile && profile.picture && profile.picture.data && profile.picture.data.url) {
    userHTML = `
      <div class="header-user">
        <img src="${profile.picture.data.url}" alt="${profile.name}" class="header-user-img">
        <span class="header-user-name">${profile.name}</span>
      </div>
    `;
  }

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
        ${userHTML}
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

/**
 * Habilita el logout desde el link del header.
 */
export function enableLogout() {
  document.addEventListener('click', function(e) {
    if (e.target.matches('#logout-link')) {
      e.preventDefault();
      clearAccessToken();
      window.location.href = '../index.html';
    }
  });
}

/**
 * Inserta el sidebar en el layout del dashboard, incluyendo el bloque de cuenta IG seleccionada.
 * @param {string} active - sección activa: "index", "metrics", "posts", "settings"
 */
export function insertSidebar(active = "") {
  const sections = [
    { id: "index", label: "Resumen", href: "index.html" },
    { id: "metrics", label: "Métricas Orgánicas", href: "metrics.html" },
    { id: "posts", label: "Publicaciones", href: "posts.html" },
    { id: "settings", label: "Configuración", href: "config.html"}
  ];

  const navLinks = sections.map(section => {
    let cls = "";
    if (section.disabled) cls += " disabled";
    if (active === section.id) cls += " active";
    return `<a href="${section.href}" class="${cls.trim()}"${section.disabled ? ' tabindex="-1" aria-disabled="true" title="Próximamente"' : ""}>${section.label}</a>`;
  }).join("\n");

  // Buscar si ya existe aside (evita duplicados si recargás la sidebar)
  let aside = document.querySelector(".dashboard-sidebar");
  if (!aside) {
    aside = document.createElement("aside");
    aside.className = "dashboard-sidebar";
    // Insertar sidebar DENTRO de .dashboard-main, antes de .dashboard-content
    const dashboardMain = document.querySelector(".dashboard-main");
    const dashboardContent = dashboardMain.querySelector(".dashboard-content");
    dashboardMain.insertBefore(aside, dashboardContent);
  }
  // Limpia el contenido antes de volver a insertar
  aside.innerHTML = "";

  // --- Bloque cuenta IG seleccionada ---
  insertIgAccountSidebar(aside);

  // --- Menú de navegación ---
  aside.innerHTML += `<nav>${navLinks}</nav>`;
}

/**
 * Inserta el bloque superior de cuenta IG seleccionada en el sidebar.
 * Si recibe el aside como parámetro, lo usa; si no, lo busca.
 */
export function insertIgAccountSidebar(aside = null) {
  const sidebar = aside || document.querySelector('.dashboard-sidebar');
  if (!sidebar) return;

  // Elimina el bloque anterior si existe
  const old = sidebar.querySelector('#ig-account-sidebar');
  if (old) old.remove();

  // Crea el bloque de cuenta
  const igAccounts = getInstagramAccounts();
  const selectedId = getSelectedInstagramId();
  const selected = igAccounts.find(acc => acc.id === selectedId);

  // Creamos el contenedor
  const div = document.createElement('div');
  div.id = "ig-account-sidebar";
  div.style.margin = "30px 0 18px 0";
  if (!selected) {
    div.innerHTML = `<div class="ig-account-header-card" style="opacity:0.7;text-align:center;">No hay cuenta IG seleccionada</div>`;
  } else {
    div.innerHTML = `
      <div class="ig-account-header-card" style="display:flex;align-items:center;gap:10px;">
        <img src="${selected.profile_picture_url || '../img/ig_default.png'}" alt="${selected.username}" class="ig-account-img" style="width:42px;height:42px;border-radius:50%;">
        <div>
          <div class="ig-account-username" style="font-weight:600;">@${selected.username}</div>
          <div class="ig-account-name" style="font-size:0.98em;color:#fffa;">${selected.name || ''}</div>
        </div>
      </div>
    `;
  }
  sidebar.appendChild(div);
}