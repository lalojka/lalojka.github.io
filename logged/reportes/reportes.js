import { insertHeaderFooter } from '/logged/js/layout.js';
insertHeaderFooter();


const reportes = [
    {
      id: "metrica_general",
      titulo: "Métricas generales últimos 30 días",
      descripcion: "Resumen de alcance, impresiones, seguidores y más.",
      icono: "📊",
      pagina: "metrica_general/metrica_general.html"
    },
    {
      id: "publicaciones",
      titulo: "Performance por publicación",
      descripcion: "Analiza el rendimiento individual de cada post.",
      icono: "📈",
      pagina: "publicaciones/publicaciones.html"
    }
    // Puedes agregar más reportes aquí
  ];
  
  const container = document.getElementById("reportes-cards");
  reportes.forEach(rep => {
    const card = document.createElement("div");
    card.className = "dashboard-card";
    card.innerHTML = `
      <div class="dashboard-card-icon">${rep.icono}</div>
      <h3>${rep.titulo}</h3>
      <p>${rep.descripcion}</p>
      <a class="dashboard-btn" href="${rep.pagina}">Ver reporte &rarr;</a>
    `;
    container.appendChild(card);
  });