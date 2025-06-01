// Manejo centralizado del access token para toda la app

export function getAccessToken() {
  // 1. Buscar en el fragmento de la URL
  const hash = window.location.hash.substr(1);
  let token = null;
  hash.split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    if (key === 'access_token') token = decodeURIComponent(value ?? '');
  });
  // 2. Si no está en la URL, buscar en localStorage
  if (!token) token = localStorage.getItem('epm_access_token');
  // 3. Si está en la URL pero no en localStorage, guardalo
  if (token && !localStorage.getItem('epm_access_token')) {
    localStorage.setItem('epm_access_token', token);
  }
  return token;
}

export function clearAccessToken() {
  localStorage.removeItem('epm_access_token');
}