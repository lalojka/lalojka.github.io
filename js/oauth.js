// js/oauth.js

// Parámetros de tu app
const APP_ID = '493451440039423';
const REDIRECT_URI = encodeURIComponent('https://app.epm-marketing.com/logged/');
const SCOPE = [
  'pages_show_list',
  'ads_management',
  'ads_read',
  'email',
  'instagram_content_publish',
  'pages_read_engagement',
  'instagram_basic',
  'business_management',
  'instagram_manage_insights'
].join(',');

// Construcción de la URL de login (¡simple y efectiva!)
function buildFacebookLoginUrl() {
  return `https://www.facebook.com/v23.0/dialog/oauth?client_id=${APP_ID}` +
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