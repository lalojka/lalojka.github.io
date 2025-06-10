// logged/js/config.js
// Configuración centralizada para elegir la URL del backend según el entorno.

// Detecta si la URL tiene dev=1 en los parámetros
const params = new URLSearchParams(window.location.search);
export const BACKEND_URL = params.has('dev')
  ? "http://localhost:4000"
  : "https://epm-app.onrender.com";