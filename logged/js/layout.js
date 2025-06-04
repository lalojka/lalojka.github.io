import { clearAccessToken, getFacebookProfile } from './auth.js';

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

export function enableLogout() {
  document.addEventListener('click', function(e) {
    if (e.target.matches('#logout-link')) {
      e.preventDefault();
      clearAccessToken();
      window.location.href = '../index.html';
    }
  });
}

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

  const aside = document.createElement("aside");
  aside.className = "dashboard-sidebar";
  aside.innerHTML = `<nav>${navLinks}</nav>`;

  // Insertar sidebar DENTRO de .dashboard-main, antes de .dashboard-content
  const dashboardMain = document.querySelector(".dashboard-main");
  const dashboardContent = dashboardMain.querySelector(".dashboard-content");
  dashboardMain.insertBefore(aside, dashboardContent);
}