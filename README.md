# Proyecto Facebook Métricas

Este repositorio contiene el flujo completo para la autenticación y consulta de métricas de Facebook mediante OAuth y la API Graph.

## Descripción

- Login con Facebook OAuth2 (token en front-end)
- Obtención del token y manejo seguro en sessionStorage
- Consultas básicas a la API Graph
- Ejemplo funcional con página estática en GitHub Pages

## Estructura

- `index.html`: página de inicio y login
- `redirect.html`: página de redirección y procesamiento del token
- `js/oauth.js`: lógica de OAuth y llamadas a la API
- `css/styles.css`: estilos básicos

## Cómo usar

1. Abrir `index.html` desde GitHub Pages
2. Hacer login con Facebook
3. La página de redirección guarda el token y permite hacer consultas
