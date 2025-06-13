/**
 * Renderiza una tabla HTML en el div indicado.
 * @param {string} divId - id del div donde renderizar la tabla
 * @param {Array} data - array de objetos (filas)
 * @param {Array} columns - array de { key, label, render? }
 */
export function renderTable(divId, data, columns) {
    const container = document.getElementById(divId);
    if (!container) return;
  
    // Limpiar anterior
    container.innerHTML = "";
  
    // Crear tabla
    const table = document.createElement('table');
    table.className = "epm-table"; // poné tu propia clase de estilos
  
    // Header
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    for (const col of columns) {
      const th = document.createElement('th');
      th.textContent = col.label ?? col.key;
      trHead.appendChild(th);
    }
    thead.appendChild(trHead);
    table.appendChild(thead);
  
    // Body
    const tbody = document.createElement('tbody');
    for (const row of data) {
      const tr = document.createElement('tr');
      for (const col of columns) {
        const td = document.createElement('td');
        let value = row[col.key];
        // Si hay render custom, usalo
        if (col.render) {
          try {
            value = col.render(row[col.key], row);
          } catch {}
        }
        td.innerHTML = value ?? ""; // admite links, etc.
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
  
    container.appendChild(table);
  }