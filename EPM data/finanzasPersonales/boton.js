function abrirPlanFinanciero() {
  // Selecciona el contenedor del plan financiero
  const planFinanciero = document.querySelector('.container');

  // Quita la clase 'hidden' para mostrar el contenedor
  planFinanciero.classList.remove('hidden');

  // Verifica si el navegador admite el modo de pantalla completa
  if (planFinanciero.requestFullscreen) {
    // Solicita abrir en pantalla completa
    planFinanciero.requestFullscreen();
  } else if (planFinanciero.mozRequestFullScreen) { /* Firefox */
    planFinanciero.mozRequestFullScreen();
  } else if (planFinanciero.webkitRequestFullscreen) { /* Chrome, Safari y Opera */
    planFinanciero.webkitRequestFullscreen();
  } else if (planFinanciero.msRequestFullscreen) { /* Internet Explorer / Edge */
    planFinanciero.msRequestFullscreen();
  }
}
