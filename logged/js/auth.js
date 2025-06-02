// Manejo centralizado del access token para toda la app

export function getAccessToken() {
  const hash = window.location.hash.substring(1);
  let token = null;
  hash.split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    if (key === 'access_token') token = decodeURIComponent(value ?? '');
  });
  if (!token) token = localStorage.getItem('epm_access_token');
  if (token && !localStorage.getItem('epm_access_token')) {
    localStorage.setItem('epm_access_token', token);
  }
  return token;
}

export function clearAccessToken() {
  localStorage.removeItem('epm_access_token');
}

// NUEVO: función fetch con manejo de token expirado
export async function fetchFacebookAPI(url) {
  const response = await fetch(url);
  const data = await response.json();
  if (data.error && data.error.code === 190) {
    clearAccessToken();
    alert('Tu sesión de Facebook expiró. Por favor, vuelve a iniciar sesión.');
    window.location.href = '../index.html';
    throw new Error('Token expirado');
  }
  return data;
}