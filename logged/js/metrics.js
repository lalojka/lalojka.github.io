import { getAccessToken, fetchFacebookAPI } from './auth.js';

export function main() {
  const METRICS = [
    'views',
    'profile_views',
    'reach',
    'website_clicks',
    'likes',
    'comments',
    'shares',
    'replies',
    'accounts_engaged'
  ];

  function getSinceUntilForDay(today, i) {
    const sinceDate = new Date(today);
    sinceDate.setDate(today.getDate() - i);
    const untilDate = new Date(today);
    untilDate.setDate(today.getDate() - (i - 1));
    const pad = n => n.toString().padStart(2, '0');
    const fmt = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    return {
      sinceUnix: Math.floor(sinceDate.getTime() / 1000),
      untilUnix: Math.floor(untilDate.getTime() / 1000),
      sinceStr: fmt(sinceDate),
      untilStr: fmt(untilDate)
    };
  }

  async function fetchFacebookAccounts(accessToken) {
    const endpoint = `https://graph.facebook.com/v23.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${accessToken}`;
    return await fetchFacebookAPI(endpoint);
  }

  async function fetchInstagramInsightsForDay(instagramBusinessId, accessToken, since, until) {
    const metricParams = `metric=${METRICS.join(',')}`;
    const url =
      `https://graph.facebook.com/v20.0/${instagramBusinessId}/insights?` +
      `${metricParams}&period=day&since=${since}&until=${until}&metric_type=total_value&access_token=${accessToken}`;
    return await fetchFacebookAPI(url);
  }

  function initTable(metrics) {
    const table = document.getElementById("insights-table");
    table.innerHTML = "";
    table.style.display = "table";
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    ["From", "Fecha", ...metrics].forEach(h => {
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
  }

  function updateProgressBar(current, total) {
    const barContainer = document.getElementById('progress-bar-container');
    const bar = document.getElementById('progress-bar');
    const text = document.getElementById('progress-text');
    barContainer.style.display = "block";
    let percent = Math.round((current / total) * 100);
    bar.style.width = percent + "%";
    bar.textContent = percent + "%";
    text.textContent = `Días cargados: ${current} / ${total}`;
  }

  // --- INICIO DEL PROGRAMA ---
  const resultsDiv = document.getElementById('results');
  const accessToken = getAccessToken();

  if (!accessToken) {
    resultsDiv.innerHTML = `<span class="error">
      No se encontró el token de acceso en la URL ni en tu sesión.<br>
      Por favor, inicia sesión nuevamente.
    </span>`;
    return;
  }

  resultsDiv.innerHTML = "Consultando páginas y cuentas de Instagram Business...";

  (async () => {
    try {
      const data = await fetchFacebookAccounts(accessToken);

      if (data.error) {
        resultsDiv.innerHTML = `<span class="error">Error al consultar la API:</span>
        <pre>${JSON.stringify(data.error, null, 2)}</pre>`;
        return;
      }

      const account = (data.data && data.data.length > 0) ? data.data[0] : null;
      const igBusinessId = account && account.instagram_business_account && account.instagram_business_account.id;

      if (!igBusinessId) {
        resultsDiv.innerHTML = `<span class="error">No se encontró una cuenta de Instagram Business vinculada.</span>`;
        return;
      }

      // Rango de días
      const daysSince = 30;
      const daysUntil = 1;
      const today = new Date();
      const totalDays = daysSince - daysUntil;

      resultsDiv.innerHTML = `Consultando insights diarios de Instagram Business (ID: <b>${igBusinessId}</b>)...<br>La tabla se llenará en orden.<br><br>`;

      initTable(METRICS);

      let rows = [];
      let completed = 0;

      let promises = [];
      for (let i = daysSince; i > daysUntil; i--) {
        const { sinceUnix, untilUnix, sinceStr, untilStr } = getSinceUntilForDay(today, i);

        promises.push(
          (async () => {
            try {
              const insights = await fetchInstagramInsightsForDay(igBusinessId, accessToken, sinceUnix, untilUnix);
              let row = [sinceStr, untilStr];
              if (insights.error) {
                row = row.concat(METRICS.map(() => "Error"));
              } else {
                METRICS.forEach(metricName => {
                  const metricData = insights.data?.find(item => item.name === metricName);
                  if (metricData && metricData.total_value && metricData.total_value.value !== undefined) {
                    row.push(metricData.total_value.value);
                  } else {
                    row.push("");
                  }
                });
              }
              rows.push(row);
            } catch (e) {
              let row = [sinceStr, untilStr].concat(METRICS.map(() => "Error"));
              rows.push(row);
            } finally {
              completed++;
              updateProgressBar(completed, totalDays);
            }
          })()
        );
      }
      await Promise.all(promises);

      // ORDENAR por fecha ASC (columna 0, "From")
      rows.sort((a, b) => a[0].localeCompare(b[0]));
      renderTableRows(rows);

    } catch (err) {
      resultsDiv.innerHTML = `<span class="error">Error de red o inesperado:</span>
      <pre>${err.message}</pre>`;
    }
  })();
}