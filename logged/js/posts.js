import { getAccessToken, fetchFacebookAPI, getSelectedInstagramId } from './auth.js';

export function main() {
  const cardsContainer = document.getElementById("posts-cards");
  const emptyDiv = document.getElementById("posts-empty");
  if (!cardsContainer) return;

  cardsContainer.innerHTML = "Cargando publicaciones...";
  if (emptyDiv) emptyDiv.style.display = "none";

  const accessToken = getAccessToken();
  const igBusinessId = getSelectedInstagramId();

  function showApiErrorMessage(errorObj) {
    // Oculta el mensaje de carga si hay error
    cardsContainer.innerHTML = "";
    if (emptyDiv) emptyDiv.style.display = "none";
    const errorText = (errorObj && errorObj.error && errorObj.error.message)
      ? errorObj.error.message
      : (errorObj && errorObj.message)
        ? errorObj.message
        : JSON.stringify(errorObj, null, 2);

    cardsContainer.innerHTML = `
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

  async function fetchInstagramPosts(igBusinessId, accessToken) {
    const fields = "id,permalink,timestamp,thumbnail_url,comments_count,like_count,caption,media_type,media_url";
    const url = `https://graph.facebook.com/v18.0/${igBusinessId}/media?fields=${fields}&access_token=${accessToken}`;
    return await fetchFacebookAPI(url);
  }

  (async () => {
    try {
      if (!accessToken) {
        cardsContainer.innerHTML = "No se encontró el token de acceso. Por favor inicia sesión nuevamente.";
        return;
      }
      if (!igBusinessId) {
        cardsContainer.innerHTML = "No se encontró una cuenta de Instagram Business seleccionada.";
        return;
      }

      const postsData = await fetchInstagramPosts(igBusinessId, accessToken);

      if (postsData.error) {
        showApiErrorMessage(postsData);
        return;
      }

      if (!postsData.data || postsData.data.length === 0) {
        cardsContainer.innerHTML = "";
        if (emptyDiv) emptyDiv.style.display = "";
        return;
      } else if (emptyDiv) {
        emptyDiv.style.display = "none";
      }

      // Renderizado de las cards
      cardsContainer.innerHTML = "";

      postsData.data.forEach(post => {
        const {
          id,
          permalink,
          timestamp,
          thumbnail_url,
          comments_count,
          like_count,
          caption,
          media_type,
          media_url
        } = post;

        const date = timestamp ? new Date(timestamp).toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" }) : "";

        // Si es VIDEO y tiene thumbnail_url, mostrar thumbnail_url; si es IMAGE mostrar thumbnail_url, si es CAROUSEL_ALBUM mostrar thumbnail_url; si ningún thumbnail_url, usar media_url si es imagen; si no, placeholder.
        let imgSrc = thumbnail_url || (media_type === "IMAGE" ? media_url : "") || "https://placehold.co/600x400?text=Sin+imagen";

        const card = document.createElement("div");
        card.className = "epm-post-card";

        card.innerHTML = `
          <a href="${permalink}" target="_blank" rel="noopener" class="epm-post-link">
            <img src="${imgSrc}" alt="Post thumbnail">
          </a>
          <div class="epm-post-card-content">
            <div class="epm-post-date">${date}</div>
            <div class="epm-post-stats">
              <span>👍 ${like_count ?? 0}</span>
              <span>💬 ${comments_count ?? 0}</span>
            </div>
            <div class="epm-post-id">ID: ${id}</div>
            <div class="epm-post-caption">${caption ? caption.substring(0, 120) + (caption.length > 120 ? "..." : "") : ""}</div>
            <a href="${permalink}" target="_blank" rel="noopener" class="epm-post-link">Ver en Instagram &rarr;</a>
          </div>
        `;
        cardsContainer.appendChild(card);
      });

    } catch (err) {
      showApiErrorMessage(err);
    }
  })();
}