// Llama a esta función al cargar cada página si usas el modo dev
(function propagateDevParam() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('dev')) return;
  
    // Para todos los links internos, agrega dev=1 si no lo tienen
    document.querySelectorAll('a[href]').forEach(link => {
      // Solo para links relativos (no externos)
      if (link.hostname === window.location.hostname) {
        const url = new URL(link.href, window.location.origin);
        if (!url.searchParams.has('dev')) {
          url.searchParams.set('dev', params.get('dev'));
          link.href = url.pathname + url.search + url.hash;
        }
      }
    });
  })();