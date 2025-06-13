/**
 * Obtiene los datos de publicaciones de Instagram usando la API Graph
 * y los cachea en localStorage para evitar requests innecesarios.
 * Devuelve un array de objetos: [{...}, ...]
 */

const FIELDS = [
    'id',
    'thumbnail_url',
    'permalink',
    'timestamp',
    'media_type',
    'media_product_type',
    'is_shared_to_feed'
  ];
  const METRICS = [
    'views',
    'reach',
    'comments',
    'likes',
    'shares',
    'ig_reels_avg_watch_time',
    'saved'
  ];
  
  // Cache key (incluye user y cuenta)
  function makeCacheKey(accessToken, instagramId) {
    return `epm_api_publicaciones_${instagramId}_${accessToken.slice(0, 8)}`;
  }
  
  /**
   * Lee datos cacheados si están frescos (menos de 1h)
   */
  function getCachedData(cacheKey) {
    try {
      const cache = JSON.parse(localStorage.getItem(cacheKey));
      if (!cache) return null;
      const now = Date.now();
      // 1 hora de validez (podés ajustar)
      if (now - cache.timestamp < 3600 * 1000 && Array.isArray(cache.rows)) {
        return cache.rows;
      }
    } catch (e) {}
    return null;
  }
  
  /**
   * Guarda los datos en cache
   */
  function setCachedData(cacheKey, rows) {
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      rows
    }));
  }
  
  /**
   * Devuelve el accessToken de localStorage
   */
  function getAccessToken() {
    return localStorage.getItem('epm_access_token') || '';
  }
  
  /**
   * Devuelve el Instagram Business ID de localStorage
   */
  function getInstagramId() {
    return localStorage.getItem('epm_selected_instagram_id') || '';
  }
  
  /**
   * Obtiene todas las publicaciones y sus métricas, cacheando el resultado.
   * @returns {Promise<Array>} Array de objetos (un objeto por posteo)
   */
  export async function fetchPublicaciones() {
    const accessToken = getAccessToken();
    const instagramId = getInstagramId();
    if (!accessToken || !instagramId) throw new Error('Faltan credenciales');
  
    const cacheKey = makeCacheKey(accessToken, instagramId);
  
    // 1. Intentar cache
    const cached = getCachedData(cacheKey);
    if (cached) {
      return cached;
    }
  
    // 2. GET /media
    const urlMedia = `https://graph.facebook.com/v18.0/${instagramId}/media?fields=${FIELDS.join(',')}&limit=200&access_token=${accessToken}`;
    const resMedia = await fetch(urlMedia);
    if (!resMedia.ok) throw new Error('Error obteniendo publicaciones');
    const dataMedia = (await resMedia.json()).data || [];
  
    // 3. Recorrer cada publicación y obtener métricas
    const rows = [];
    for (const item of dataMedia) {
      if (!item.is_shared_to_feed) continue; // Filtra solo las posteadas
  
      // Info base
      const mediaData = {};
      for (const f of FIELDS) mediaData[f] = item[f] ?? '';
  
      // GET /insights para ese post
      const urlInsights = `https://graph.facebook.com/v18.0/${item.id}/insights?metric=${METRICS.join(',')}&period=day&metric_type=total_value&access_token=${accessToken}`;
      let insightsData = [];
      try {
        const resInsights = await fetch(urlInsights);
        if (resInsights.ok) {
          insightsData = (await resInsights.json()).data || [];
        }
      } catch (e) {}
  
      for (const metric of insightsData) {
        let metricValue = metric.values?.[0]?.value ?? 0;
        // Si es ig_reels_avg_watch_time, convertir ms a segundos
        if (metric.name === 'ig_reels_avg_watch_time') {
          try {
            metricValue = Math.round(Number(metricValue) / 1000 * 100) / 100;
          } catch (e) {
            metricValue = 0;
          }
        }
        mediaData[metric.name] = metricValue;
      }
  
      // Fecha de consulta
      mediaData['fecha_consulta'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
      rows.push(mediaData);
    }
  
    // 4. Guardar en cache y devolver
    setCachedData(cacheKey, rows);
    return rows;
  }