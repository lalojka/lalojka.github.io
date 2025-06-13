// chart.js - Wrapper para inicializar y actualizar gráficos Chart.js

let charts = {}; // Si querés varios gráficos por página

//grafico para linechart
export function renderLineChart(ctxOrId, labels, datasets, options = {}) {
  // ctxOrId: puede ser un <canvas> o un string con el id del canvas
  const ctx = typeof ctxOrId === "string"
    ? document.getElementById(ctxOrId).getContext("2d")
    : ctxOrId.getContext("2d");

  if (!ctx) throw new Error("No se encontró el canvas para el gráfico");

  // Si ya existe un gráfico en ese canvas, destruirlo
  if (charts[ctxOrId]) {
    charts[ctxOrId].destroy();
  }

  charts[ctxOrId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      ...options
    }
  });

  return charts[ctxOrId];
}