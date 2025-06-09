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
    window.location.href = '../index.html';
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

// --- PERFIL DE USUARIO FACEBOOK ---

export async function fetchAndStoreFacebookProfile() {
  const token = getAccessToken();
  if (!token) return null;
  const fields = "id,name,email,picture";
  const url = `https://graph.facebook.com/v18.0/me?fields=${fields}&access_token=${token}`;
  const profile = await fetchFacebookAPI(url);
  localStorage.setItem('epm_facebook_profile', JSON.stringify(profile));

  // --- Enviar al backend LOCAL ---
  if (profile && profile.email && profile.id) {
    console.log("Enviando usuario al backend local:", {
      id: profile.id,
      email: profile.email,
      nombre: profile.name,
      accessToken: token,
      instagram_id: null
    });
    fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: profile.id,
        email: profile.email,
        nombre: profile.name,
        accessToken: token,
        instagram_id: null
      })
    })
    .then(res => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(data => {
      if (!data.ok) {
        console.error('Error guardando usuario en backend:', data.error);
      } else {
        console.log('Usuario guardado exitosamente en backend local');
      }
    })
    .catch(err => {
      console.error('Error comunicando con backend:', err);
    });
  } else {
    console.warn('No se obtuvo perfil con email e id válido', profile);
  }

  return profile;
}

export function getFacebookProfile() {
  const data = localStorage.getItem('epm_facebook_profile');
  return data ? JSON.parse(data) : null;
}

// --- CUENTAS DE INSTAGRAM ASOCIADAS ---

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