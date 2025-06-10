export function insertHead({
    title = "EPM APP Dashboard",
    description = "Accedé a tus métricas y reportes de Instagram con EPM APP.",
    ogTitle = "EPM APP Dashboard",
    ogDescription = "Accedé a tus métricas y reportes de Instagram con EPM APP.",
    ogImage = "https://app.epm-marketing.com/img/logo.png",
    ogUrl = window.location.href,
    ogType = "website"
  } = {}) {
    document.head.innerHTML = `
      <meta charset="UTF-8">
      <title>${title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="${description}">
      <meta property="og:title" content="${ogTitle}" />
      <meta property="og:description" content="${ogDescription}" />
      <meta property="og:image" content="${ogImage}" />
      <meta property="og:url" content="${ogUrl}" />
      <meta property="og:type" content="${ogType}" />
      <meta property="fb:app_id" content="493451440039423" />
      <link rel="icon" href="/img/favicon.ico" type="image/x-icon">
      <link rel="stylesheet" href="/styles.css">
      <link rel="stylesheet" href="/css/dashboard.css">
    `;
  }