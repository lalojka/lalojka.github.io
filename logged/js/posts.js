import { getAccessToken, fetchFacebookAPI } from './auth.js';

export function main() {
  const pre = document.getElementById("posts-json");
  pre.textContent = "Cargando publicaciones...";

  const accessToken = getAccessToken();

  if (!accessToken) {
    pre.textContent = "No se encontró el token de acceso. Por favor inicia sesión nuevamente.";
    return;
  }

  async function fetchFacebookAccounts(accessToken) {
    const endpoint = `https://graph.facebook.com/v23.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${accessToken}`;
    return await fetchFacebookAPI(endpoint);
  }

  async function fetchInstagramPosts(igBusinessId, accessToken) {
    const fields = "id,media_type,media_url,permalink,timestamp,comments_count,like_count,caption";
    const url = `https://graph.facebook.com/v23.0/${igBusinessId}/media?fields=${fields}&access_token=${accessToken}`;
    return await fetchFacebookAPI(url);
  }

  (async () => {
    try {
      // 1. Obtener las cuentas de Facebook del usuario
      const fbData = await fetchFacebookAccounts(accessToken);

      if (fbData.error) {
        pre.textContent = `Error al consultar la API:\n${JSON.stringify(fbData.error, null, 2)}`;
        return;
      }

      const account = (fbData.data && fbData.data.length > 0) ? fbData.data[0] : null;
      const igBusinessId = account && account.instagram_business_account && account.instagram_business_account.id;

      if (!igBusinessId) {
        pre.textContent = "No se encontró una cuenta de Instagram Business vinculada a tu página.";
        return;
      }

      // 2. Obtener los posts del Instagram Business Account
      const postsData = await fetchInstagramPosts(igBusinessId, accessToken);

      pre.textContent = JSON.stringify(postsData, null, 2);

    } catch (err) {
      pre.textContent = `Error inesperado:\n${err.message}`;
    }
  })();
}