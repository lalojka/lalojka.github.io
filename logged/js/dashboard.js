import { insertHeaderFooter, insertSidebar, enableLogout } from './layout.js';
import { getInstagramAccounts, getSelectedInstagramId } from './auth.js';

insertHeaderFooter();
insertSidebar("dashboard");
enableLogout();

// Mostrar nombre y foto IG seleccionada arriba del dashboard
const igId = getSelectedInstagramId();
const allAccounts = getInstagramAccounts();
const selected = allAccounts.find(acc => acc.id === igId);

if (!igId || !selected) {
  window.location.href = "index.html";
} else {
  document.getElementById('welcome-title').textContent = `¡Bienvenido, @${selected.username}!`;
}

async function renderProductos() {
  const container = document.getElementById("dashboard-cards");
  container.innerHTML = "<p>Cargando productos...</p>";

  try {
    const res = await fetch("https://app.epm-marketing.com/api/productos");
    const data = await res.json();
    if (!data.ok) throw new Error("Error del backend");

    // Rutas a donde va cada producto (ajusta los archivos HTML según tu estructura)
    const rutas = {
      reportes: "reportes.html",
      mentoria: "mentoria.html",
      estrategia: "estrategia.html",
      configuracion: "config.html"
    };

    // Iconos SVG simples para cada producto (puedes mejorar luego)
    const iconos = {
      reportes: `<svg height="32" width="32" fill="var(--blue)" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 8h14v-2H7v2zm0-4h14v-2H7v2zm0-6v2h14V7H7z"/></svg>`,
      mentoria: `<svg height="32" width="32" fill="var(--orange)" viewBox="0 0 24 24"><path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z"/></svg>`,
      estrategia: `<svg height="32" width="32" fill="var(--light-blue)" viewBox="0 0 24 24"><path d="M21 3h-6.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H3v2h18V3zM3 21v-2h18v2c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2z"/></svg>`,
      configuracion: `<svg height="32" width="32" fill="var(--cream)" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 00.11-.64l-1.92-3.32a.5.5 0 00-.61-.22l-2.39.96a7.007 7.007 0 00-1.63-.94l-.36-2.53A.486.486 0 0014 2h-4a.5.5 0 00-.5.42l-.36 2.53c-.58.22-1.13.51-1.63.94l-2.39-.96a.5.5 0 00-.61.22l-1.92 3.32a.5.5 0 00.11.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 00-.11.64l1.92 3.32c.14.24.44.32.68.22l2.39-.96c.5.42 1.05.77 1.63.94l.36 2.53c.05.28.28.42.5.42h4c.22 0 .45-.14.5-.42l.36-2.53c.58-.17 1.13-.52 1.63-.94l2.39.96c.24.1.54.02.68-.22l1.92-3.32a.5.5 0 00-.11-.64l-2.03-1.58zM12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>`
    };

    container.innerHTML = "";
    data.productos.forEach(prod => {
      const card = document.createElement("div");
      card.className = "dashboard-card";
      card.innerHTML = `
        <div class="dashboard-card-icon">${iconos[prod.id] || ""}</div>
        <h3>${prod.nombre}</h3>
        <p>${getDescripcion(prod.id)}</p>
        <a class="dashboard-btn" href="${rutas[prod.id] || '#'}">Ver más &rarr;</a>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = "<p>Error cargando productos.</p>";
  }
}

function getDescripcion(id) {
  switch (id) {
    case "reportes": return "Accedé a todos los reportes de tu cuenta de Instagram.";
    case "mentoria": return "Solicitá mentoría personalizada para tu estrategia digital.";
    case "estrategia": return "Recibí sugerencias y planes de contenido para tu marca.";
    case "configuracion": return "Configurá tus cuentas y preferencias de la app.";
    default: return "";
  }
}

renderProductos();