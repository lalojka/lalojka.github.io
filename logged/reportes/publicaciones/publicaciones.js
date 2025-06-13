import { insertHeaderFooter } from '/logged/js/layout.js';
import { fetchPublicaciones } from '/lalojka.github.io/logged/reportes/publicaciones/APIpublicaciones.js';
import { formatearPublicaciones, COLUMN_DEFS } from './formato-publicaciones.js';
import { renderTable } from '/logged/js/chartTable.js';

insertHeaderFooter();

async function main() {
  // 1. Obtener los datos crudos (fetch + cache)
  let datosCrudos = [];
  try {
    datosCrudos = await fetchPublicaciones();
  } catch (err) {
    document.getElementById('publicaciones-container').innerHTML =
      '<div class="error">No se pudieron obtener los datos de publicaciones.</div>';
    console.error(err);
    return;
  }
  // 2. Formatear los datos (columnas, links, cálculos, etc)
  const datosFormateados = formatearPublicaciones(datosCrudos);

  // 3. Definir columnas de la tabla (desde formato-publicaciones.js)
  const columnasTabla = COLUMN_DEFS.tabla;

  // 4. Renderizar la tabla en el div correspondiente
  renderTable('publicaciones-container', datosFormateados, columnasTabla);

  // (Opcional) Podrías agregar filtros, gráficos, etc aquí
}


main();