import { insertHeaderFooter } from '/logged/js/layout.js';
import { getAccessToken, fetchFacebookAPI, getSelectedInstagramId } from '/logged/js/auth.js';
import { renderLineChart } from '/logged/js/chartLine.js';

insertHeaderFooter();

const METRICS = [
  'views',
  'reach',
  'profile_views',
  'website_clicks',
  'likes',
  'comments',
  'shares',
  'replies',
  'accounts_engaged'
];

// Paleta de colores de la marca
const PALETTE = [
  '#083963', // --blue
  '#5DA9DD', // --light-blue
  '#EB8957', // --orange
  '#fff',    // --white
  '#1a2330'  // --text
];

// Genera un color para cada métrica usando la paleta, repitiendo si hay más métricas que colores
function getMetricColor(idx, alpha = 1) {
  const base = PALETTE[idx % PALETTE.length];
  // Si es blanco o cream y con alpha, hacé el fill más suave
  if (alpha < 1) {
    if (base.toLowerCase() === '#fff') return 'rgba(255,255,255,' + alpha + ')';
    if (base.toLowerCase() === '#5da9dd') return 'rgba(93,169,221,' + alpha + ')';
    if (base.toLowerCase() === '#eb8957') return 'rgba(235,137,87,' + alpha + ')';
    if (base.toLowerCase() === '#083963') return 'rgba(8,57,99,' + alpha + ')';
    if (base.toLowerCase() === '#1a2330') return 'rgba(26,35,48,' + alpha + ')';
  }
  return base;
}

function getSinceUntilForDay(today, i) {
  const sinceDate = new Date(today);
  sinceDate.setDate(today.getDate() - i);
  const untilDate = new Date(today);
  untilDate.setDate(today.getDate() - (i - 1));
  const pad = n => n.toString().padStart(2, '0');
  const fmt = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return {
    sinceUnix: Math.floor(sinceDate.getTime() / 1000),
    untilUnix: Math.floor(untilDate.getTime() / 1000),
    sinceStr: fmt(sinceDate),
    untilStr: fmt(untilDate)
  };
}

async function fetchInstagramInsightsForDay(instagramBusinessId, accessToken, since, until) {
  const metricParams = `metric=${METRICS.join(',')}`;
  const url =
    `https://graph.facebook.com/v22.0/${instagramBusinessId}/insights?` +
    `${metricParams}&period=day&since=${since}&until=${until}&metric_type=total_value&access_token=${accessToken}`;
  return await fetchFacebookAPI(url);
}

function updateProgressBar(current, total) {
  const barContainer = document.getElementById('progress-bar-container');
  const bar = document.getElementById('progress-bar');
  const text = document.getElementById('progress-text');
  if (barContainer && bar && text) {
    barContainer.style.display = "block";
    let percent = Math.round((current / total) * 100);
    bar.style.width = percent + "%";
    bar.textContent = percent + "%";
    text.textContent = `Días cargados: ${current} / ${total}`;
  }
}

function showApiErrorMessage(errorObj) {
  const resultsDiv = document.getElementById('results');
  const errorText = (errorObj && errorObj.error && errorObj.error.message)
    ? errorObj.error.message
    : (errorObj && errorObj.message)
      ? errorObj.message
      : JSON.stringify(errorObj, null, 2);

  resultsDiv.innerHTML = `
    <div class="error fb-api-error">
      <b>¡Ups! Hubo un error con la API de Facebook/Instagram.</b><br>
      Es probable que la aplicación necesite ser actualizada.<br>
      <br>
      Por favor, <b>haz clic en el botón para copiar el error</b> y envíamelo por DM de Instagram:<br>
      <a href="https://ig.me/m/leacouretot/" target="_blank" class="contact-link">Enviar mensaje a Leandro Couretot</a>
      <br><br>
      <button id="copy-error-btn">Copiar error</button>
      <pre id="error-message" style="max-width: 100%; white-space: pre-wrap;">${errorText}</pre>
    </div>
  `;
  setTimeout(() => {
    const btn = document.getElementById('copy-error-btn');
    const pre = document.getElementById('error-message');
    if (btn && pre) {
      btn.onclick = () => {
        navigator.clipboard.writeText(pre.textContent)
          .then(() => btn.textContent = "¡Copiado!")
          .catch(() => btn.textContent = "Error al copiar");
      };
    }
  }, 100);
}

// --- INICIO DEL PROGRAMA ---
const resultsDiv = document.getElementById('results');
const accessToken = getAccessToken();
const igBusinessId = getSelectedInstagramId();

if (!accessToken || !igBusinessId) {
  resultsDiv.innerHTML = `<span class="error">
    No se encontró el token de acceso o la cuenta de Instagram seleccionada.<br>
    Por favor, inicia sesión y selecciona una cuenta nuevamente.
  </span>`;
} else {
  resultsDiv.innerHTML = "Consultando insights diarios de Instagram...";

  (async () => {
    try {
      // Rango de días
      const daysSince = 30;
      const daysUntil = 1;
      const today = new Date();

      resultsDiv.innerHTML = `Consultando insights diarios de Instagram Business (ID: <b>${igBusinessId}</b>)...<br>La tabla se llenará en orden.<br><br>`;

      let rows = [];
      let completed = 0;

      for (let i = daysSince; i > daysUntil; i--) {
        const { sinceUnix, untilUnix, untilStr } = getSinceUntilForDay(today, i);
        try {
          const insights = await fetchInstagramInsightsForDay(igBusinessId, accessToken, sinceUnix, untilUnix);
          if (insights.error) {
            showApiErrorMessage(insights);
            return;
          }
          let row = [untilStr];
          METRICS.forEach(metricName => {
            const metricData = insights.data?.find(item => item.name === metricName);
            if (metricData && metricData.total_value && metricData.total_value.value !== undefined) {
              row.push(metricData.total_value.value);
            } else {
              row.push("");
            }
          });
          rows.push(row);
        } catch (e) {
          showApiErrorMessage(e);
          return;
        } finally {
          completed++;
          updateProgressBar(completed, daysSince - daysUntil);
        }
      }

      if (rows.length > 0) {
        initTable(METRICS);
        rows.sort((a, b) => a[0].localeCompare(b[0]));
        renderTableRows(rows);
      }
    } catch (err) {
      showApiErrorMessage(err);
    }
  })();
}

function initTable(metrics) {
  const table = document.getElementById("insights-table");
  table.innerHTML = "";
  table.style.display = "table";
  let thead = document.createElement("thead");
  let tr = document.createElement("tr");
  ["Date", ...metrics].forEach(h => {
    let th = document.createElement("th");
    th.textContent = h;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  table.appendChild(thead);
  let tbody = document.createElement("tbody");
  table.appendChild(tbody);
}

function renderTableRows(rows) {
  const table = document.getElementById("insights-table");
  let tbody = table.querySelector("tbody");
  tbody.innerHTML = "";
  rows.forEach(row => {
    let tr = document.createElement("tr");
    row.forEach(cell => {
      let td = document.createElement("td");
      td.textContent = cell !== undefined ? cell : "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  // --- Renderizar gráfico de líneas con TODAS las métricas y colores de la paleta ---
  const fechas = rows.map(row => row[0]);
  const datasets = METRICS.map((metric, i) => {
    const idx = i + 1;
    const values = rows.map(row => {
      const v = row[idx];
      return v === "" ? null : Number(v);
    });
    return {
      label: metric,
      data: values,
      borderColor: getMetricColor(i, 1),
      backgroundColor: getMetricColor(i, 0.18),
      fill: false,
      tension: 0.35,
      pointRadius: 2
    };
  });

  renderLineChart('chart-metricas', fechas, datasets, {
    plugins: { legend: { display: true, position: 'top' } },
    interaction: { mode: 'nearest', intersect: false },
    scales: {
      x: { title: { display: true, text: 'Fecha' } },
      y: { title: { display: true, text: 'Valor' }, beginAtZero: true }
    }
  });
}