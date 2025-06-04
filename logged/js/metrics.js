import { getAccessToken, fetchFacebookAPI, getSelectedInstagramId } from './auth.js';

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

  async function fetchInstagramInsightsForDay(instagramBusinessId, accessToken, since, until) {
    const metricParams = `metric=${METRICS.join(',')}`;
    const url =
      `https://graph.facebook.com/v22.0/${instagramBusinessId}/insights?` +
      `${metricParams}&period=day&since=${since}&until=${until}&metric_type=total_value&access_token=${accessToken}`;
    return await fetchFacebookAPI(url);
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
    return;
  }

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
        const { sinceUnix, untilUnix, sinceStr, untilStr } = getSinceUntilForDay(today, i);
        try {
          const insights = await fetchInstagramInsightsForDay(igBusinessId, accessToken, sinceUnix, untilUnix);
          if (insights.error) {
            // Si hay error de API, mostramos mensaje y detenemos todo
            showApiErrorMessage(insights);
            return;
          }
          let row = [sinceStr, untilStr];
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
          // Error de red u otro
          showApiErrorMessage(e);
          return;
        } finally {
          completed++;
          updateProgressBar(completed, daysSince - daysUntil);
        }
      }

      // Si no hubo error, mostrar la tabla
      if (rows.length > 0) {
        initTable(METRICS);
        // ORDENAR por fecha ASC (columna 0, "From")
        rows.sort((a, b) => a[0].localeCompare(b[0]));
        renderTableRows(rows);
      }
    } catch (err) {
      showApiErrorMessage(err);
    }
  })();
}

// Autoejecutar al importar
main();