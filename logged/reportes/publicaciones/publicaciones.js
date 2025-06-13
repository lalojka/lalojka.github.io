import { BACKEND_URL } from '/logged/js/config.js';
import { insertHeaderFooter } from '/logged/js/layout.js';
import { fetchPublicaciones } from '/logged/reportes/publicaciones/APIpublicaciones.js';

insertHeaderFooter();
// Aquí iría la lógica para obtener y mostrar la performance por publicación
document.getElementById('publicaciones-container').innerHTML = `
  <p>Cargando publicaciones...</p>
`;

// Ejemplo de fetch (ajusta endpoint y lógica a tu backend real)
async function cargarPublicaciones() {
  try {
    const ig_id = localStorage.getItem('epm_selected_instagram_id');
    const accessToken = localStorage.getItem('epm_access_token');
    const res = await fetch(`${BACKEND_URL}/api/reportes/${ig_id}/performance?accessToken=${accessToken}`);
    const data = await res.json();
    // Actualiza la UI con los datos reales
    document.getElementById('publicaciones-container').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (e) {
    document.getElementById('publicaciones-container').innerText = "Error al cargar publicaciones.";
  }
}
cargarPublicaciones();



const publicaciones = await fetchPublicaciones();
console.log(publicaciones); // Array con los objetos traídos (o cacheados)