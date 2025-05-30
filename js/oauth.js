// js/oauth.js

// Parámetros de tu app
const APP_ID = '493451440039423';
const REDIRECT_URI = encodeURIComponent('https://app.epm-marketing.com/logged/');
const SCOPE = [
  'instagram_basic',
  'instagram_manage_insights',
  'pages_show_list',
  'pages_read_engagement'
].join(',');

// El parámetro "extras" debe ir URI encoded y entrecomillado
const EXTRAS = encodeURIComponent('{"setup":{"channel":"IG_API_ONBOARDING"}}');

// Construcción de la URL de login
function buildFacebookLoginUrl() {
  return `https://www.facebook.com/v23.0/dialog/oauth?client_id=${APP_ID}` +
    `&display=page` +
    `&extras=${EXTRAS}` +
    `&redirect_uri=${REDIRECT_URI}` +
    `&response_type=token` +
    `&scope=${SCOPE}`;
}

// Asigna la URL al botón cuando cargue la página
window.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('fb-login-btn');
  if (loginBtn) {
    loginBtn.setAttribute('href', buildFacebookLoginUrl());
  }
});