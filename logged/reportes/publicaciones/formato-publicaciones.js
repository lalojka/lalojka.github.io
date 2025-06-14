// Definición de columnas y helpers para formateo, filtros y columnas calculadas

export const COLUMN_DEFS = {
    tabla: [
      { key: 'timestamp', label: 'Fecha', isDimension: true },
      { key: 'media_type', label: 'Tipo', isDimension: true },
      { 
        key: 'permalink', 
        label: 'Link', 
        isDimension: true, 
        render: (v, row) => `<a href="${row.permalink}" target="_blank">Ver</a>`
      },
      { key: 'reach', label: 'Reach', isMetric: true },
      { key: 'likes', label: 'Likes', isMetric: true },
      { key: 'comments', label: 'Comentarios', isMetric: true },
      { key: 'shares', label: 'Compartidos', isMetric: true },
      { key: 'saved', label: 'Guardados', isMetric: true },
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
  };
  
  // Solo columnas calculadas en el formateador
  export function formatearPublicaciones(arr) {
    return arr.map(row => {
      COLUMN_DEFS.tabla.forEach(col => {
        if (col.calc) row[col.key] = col.calc(row);
      });
      return row;
    });
  }