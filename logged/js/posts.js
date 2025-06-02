import { getAccessToken, fetchFacebookAPI } from './auth.js';

export function main() {
  const cardsContainer = document.getElementById("posts-cards");
  const emptyDiv = document.getElementById("posts-empty");
  if (!cardsContainer) return;

  cardsContainer.innerHTML = "Cargando publicaciones...";

  const accessToken = getAccessToken();

  if (!accessToken) {
    cardsContainer.innerHTML = "No se encontró el token de acceso. Por favor inicia sesión nuevamente.";
    return;
  }

  async function fetchFacebookAccounts(accessToken) {
    const endpoint = `https://graph.facebook.com/v23.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${accessToken}`;
    return await fetchFacebookAPI(endpoint);
  }

  async function fetchInstagramPosts(igBusinessId, accessToken) {
    const fields = "id,permalink,timestamp,thumbnail_url,comments_count,like_count";
    const url = `https://graph.facebook.com/v18.0/${igBusinessId}/media?fields=${fields}&access_token=${accessToken}`;
    return await fetchFacebookAPI(url);
  }

  (async () => {
    try {
      const fbData = await fetchFacebookAccounts(accessToken);

      if (fbData.error) {
        cardsContainer.innerHTML = `<span style="color:red">${fbData.error.message}</span>`;
        return;
      }

      const account = (fbData.data && fbData.data.length > 0) ? fbData.data[0] : null;
      const igBusinessId = account && account.instagram_business_account && account.instagram_business_account.id;

      if (!igBusinessId) {
        cardsContainer.innerHTML = "No se encontró una cuenta de Instagram Business vinculada a tu página.";
        return;
      }

      const postsData = await fetchInstagramPosts(igBusinessId, accessToken);

      if (!postsData.data || postsData.data.length === 0) {
        cardsContainer.innerHTML = "";
        emptyDiv.style.display = "";
        return;
      } else {
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
          like_count
        } = post;

        const date = timestamp ? new Date(timestamp).toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" }) : "";

        const card = document.createElement("div");
        card.className = "epm-post-card";

        card.innerHTML = `
          <a href="${permalink}" target="_blank" rel="noopener" class="epm-post-link">
            <img src="${thumbnail_url || 'https://placehold.co/600x400?text=Sin+imagen'}" alt="Post thumbnail">
          </a>
          <div class="epm-post-card-content">
            <div class="epm-post-date">${date}</div>
            <div class="epm-post-stats">
              <span>👍 ${like_count ?? 0}</span>
              <span>💬 ${comments_count ?? 0}</span>
            </div>
            <div class="epm-post-id">ID: ${id}</div>
            <a href="${permalink}" target="_blank" rel="noopener" class="epm-post-link">Ver en Instagram &rarr;</a>
          </div>
        `;
        cardsContainer.appendChild(card);
      });

    } catch (err) {
      cardsContainer.innerHTML = `<span style="color:red">${err.message}</span>`;
    }
  })();
}