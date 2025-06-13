// Definición de columnas y helpers para formateo, filtros y columnas calculadas

export const COLUMN_DEFS = {
    // Para la tabla: mostrar solo estas columnas
    tabla: [
      { key: 'timestamp', label: 'Fecha', isDimension: true },
      { key: 'media_type', label: 'Tipo', isDimension: true },
      { key: 'permalink', label: 'Link', isDimension: true, render: v => `<a href="${v}" target="_blank">Ver</a>` },
      { key: 'reach', label: 'Reach', isMetric: true },
      { key: 'likes', label: 'Likes', isMetric: true },
      { key: 'comments', label: 'Comentarios', isMetric: true },
      { key: 'shares', label: 'Compartidos', isMetric: true },
      { key: 'saved', label: 'Guardados', isMetric: true },
      // Columna calculada
      {
        key: 'engagement_rate',
        label: 'Eng. Rate (%)',
        isMetric: true,
        calc: row => row.reach ? ((row.likes + row.comments) / row.reach * 100).toFixed(2) : ''
      }
    ],
    filtros: [
      { key: 'media_type', label: 'Tipo de publicación' },
      { key: 'timestamp', label: 'Fecha' }
      // Otros filtros
    ]
    // ...podés agregar más configuraciones según necesites
  };
  
  // Función para aplicar formato y columnas calculadas
  export function formatearPublicaciones(arr) {
    return arr.map(row => {
      // Generar columnas calculadas
      COLUMN_DEFS.tabla.forEach(col => {
        if (col.calc) row[col.key] = col.calc(row);
        if (col.render) row[col.key] = col.render(row[col.key]);
      });
      // Ejemplo: eliminar columnas que no querés mostrar (opcional, porque la tabla sólo toma las de COLUMN_DEFS.tabla)
      return row;
    });
  }