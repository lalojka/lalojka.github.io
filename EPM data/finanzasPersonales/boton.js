// Función que se ejecuta al hacer clic en el botón "Armar Plan Financiero"
function abrirPlanEnPantallaCompleta() {
    // Solicitar el modo de pantalla completa para el elemento raíz del documento
    document.documentElement.requestFullscreen();
  }
  
  // Obtener el botón "Armar Plan Financiero" por su ID
  const botonArmarPlan = document.getElementById('botonArmarPlan');
  
  // Agregar un event listener al botón para ejecutar la función al hacer clic
  botonArmarPlan.addEventListener('click', abrirPlanEnPantallaCompleta);
  