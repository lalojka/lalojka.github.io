// logged/js/auth.js

import { BACKEND_URL } from '/logged/js/config.js';

// Manejo centralizado del access token y datos del usuario para toda la app

// --- ACCESS TOKEN ---

export function getAccessToken() {
  const hash = window.location.hash.substring(1);
  let token = null;
  let longLivedToken = null;

  hash.split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    if (key === 'long_lived_token') longLivedToken = decodeURIComponent(value ?? '');
    if (key === 'access_token') token = decodeURIComponent(value ?? '');
  });

  // Prioriza el token de larga duración si está presente
  if (longLivedToken) {
    token = longLivedToken;
  }

  if (!token) token = localStorage.getItem('epm_access_token');
  if (token && !localStorage.getItem('epm_access_token')) {
    localStorage.setItem('epm_access_token', token);
  }
  return token;
}

export function clearAccessToken() {
  localStorage.removeItem('epm_access_token');
  localStorage.removeItem('epm_facebook_profile');
  localStorage.removeItem('epm_instagram_accounts');
  localStorage.removeItem('epm_selected_instagram_id');
  localStorage.removeItem('epm_instagram_profile');
}

// --- FETCH CON MANEJO DE TOKEN EXPIRADO ---

function showPopup(message) {
  let popup = document.getElementById('fb-expired-popup');
  if (!popup) {
    // Crear el popup si no existe
    popup = document.createElement('div');
    popup.id = 'fb-expired-popup';
    popup.style.display = 'none';
    popup.innerHTML = `
      <div class="fb-popup-content">
        <h2>Sesión expirada</h2>
        <p>${message}</p>
        <button id="fb-popup-ok">Aceptar</button>
      </div>
    `;
    document.body.appendChild(popup);
  }
  popup.style.display = 'flex';
  popup.querySelector('p').innerText = message;
  const okBtn = document.getElementById('fb-popup-ok');
  okBtn.onclick = function() {
    popup.style.display = 'none';
    window.location.href = '/index.html';
  };
}

export async function fetchFacebookAPI(url) {
  const response = await fetch(url);
  const data = await response.json();
  if (data.error && data.error.code === 190) {
    clearAccessToken();
    showPopup('Tu sesión de Facebook expiró. Por favor, vuelve a iniciar sesión.');
    throw new Error('Token expirado');
  }
  return data;
}

// --- PERFIL DE USUARIO FACEBOOK + INSTAGRAM ---

export async function fetchAndStoreFacebookAndInstagramProfile() {
  const token = getAccessToken();
  if (!token) return null;

  // 1. Traer perfil de Facebook
  const fbFields = "id,name,email,picture";
  const fbUrl = `https://graph.facebook.com/v23.0/me?fields=${fbFields}&access_token=${token}`;
  const fbProfile = await fetchFacebookAPI(fbUrl);
  localStorage.setItem('epm_facebook_profile', JSON.stringify(fbProfile));

  // 2. Traer cuentas de Instagram asociadas
  const pagesUrl = `https://graph.facebook.com/v23.0/me/accounts?fields=id,name,instagram_business_account&access_token=${token}`;
  const pagesResult = await fetchFacebookAPI(pagesUrl);
  let igProfile = null;

  if (pagesResult.data && Array.isArray(pagesResult.data)) {
    // Tomar la primera cuenta de Instagram asociada (puedes adaptar para enviar varias)
    const igAccount = pagesResult.data.find(
      page => page.instagram_business_account && page.instagram_business_account.id
    );
    if (igAccount) {
      const igId = igAccount.instagram_business_account.id;
      const igUrl = `https://graph.facebook.com/v23.0/${igId}?fields=id,username,profile_picture_url,name&access_token=${token}`;
      igProfile = await fetchFacebookAPI(igUrl);
    }
  }

  if (igProfile) {
    localStorage.setItem('epm_instagram_profile', JSON.stringify(igProfile));
  } else {
    localStorage.removeItem('epm_instagram_profile');
  }

  // 3. Enviar ambos al backend
  if (fbProfile && fbProfile.id) {
    const payload = {
      fb_id: fbProfile.id,
      fb_email: fbProfile.email,
      fb_name: fbProfile.name,
      fb_picture: fbProfile.picture?.data?.url || null,
      accessToken: token,
      // Si hay IG asociado, guarda info, si no, deja null
      ig_id: igProfile ? igProfile.id : null,
      ig_username: igProfile ? igProfile.username : null,
      ig_name: igProfile ? igProfile.name : null,
      ig_picture: igProfile ? igProfile.profile_picture_url : null
    };

    console.log("Enviando usuario+instagram al backend:", payload);

    fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(data => {
        if (!data.ok) {
          console.error('Error guardando en backend:', data.error);
        } else {
          console.log('Guardado OK en backend');
        }
      })
      .catch(err => {
        console.error('Error comunicando con backend:', err);
      });
  }
  return { fbProfile, igProfile };
}

export function getFacebookProfile() {
  const data = localStorage.getItem('epm_facebook_profile');
  return data ? JSON.parse(data) : null;
}

export function getInstagramProfile() {
  const data = localStorage.getItem('epm_instagram_profile');
  return data ? JSON.parse(data) : null;
}

// --- CUENTAS DE INSTAGRAM ASOCIADAS (varias) ---

export async function fetchAndStoreInstagramAccounts() {
  const token = getAccessToken();
  if (!token) return [];
  // Primero obtenemos todas las pages administradas
  const pagesUrl = `https://graph.facebook.com/v23.0/me/accounts?fields=id,name,instagram_business_account&access_token=${token}`;
  const pagesResult = await fetchFacebookAPI(pagesUrl);
  const accounts = [];
  if (pagesResult.data && Array.isArray(pagesResult.data)) {
    for (const page of pagesResult.data) {
      const ig = page.instagram_business_account;
      if (ig && ig.id) {
        // Traemos datos de la cuenta de IG (username y foto)
        const igUrl = `https://graph.facebook.com/v23.0/${ig.id}?fields=id,username,profile_picture_url,name&access_token=${token}`;
        const igData = await fetchFacebookAPI(igUrl);
        accounts.push({
          id: igData.id,
          username: igData.username,
          name: igData.name,
          profile_picture_url: igData.profile_picture_url
        });
      }
    }
  }
  localStorage.setItem('epm_instagram_accounts', JSON.stringify(accounts));
  return accounts;
}

export function getInstagramAccounts() {
  const data = localStorage.getItem('epm_instagram_accounts');
  return data ? JSON.parse(data) : [];
}

// --- SELECCIÓN DE CUENTA DE INSTAGRAM ---

export function setSelectedInstagramId(igId) {
  localStorage.setItem('epm_selected_instagram_id', igId);
}

export function getSelectedInstagramId() {
  return localStorage.getItem('epm_selected_instagram_id') || null;
}