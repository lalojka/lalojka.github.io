document.addEventListener('DOMContentLoaded', function() {
    // Asegúrate de que el DOM está completamente cargado
    
    var ctaButton = document.getElementById('cta-button'); // Obtiene el botón por su ID

    ctaButton.addEventListener('click', function() {
        // Añade un evento de clic al botón
        var destinationUrl = "appcoppel://coppel/producto/pm/1076483"; // URL de destino a la que quieres dirigir a los usuarios
        
        // Intenta usar mraid.open() si está en un entorno compatible con MRAID
        if (typeof mraid !== 'undefined' && mraid.open) {
            mraid.open(destinationUrl);
        } else {
            // Si no es un entorno MRAID, usa window.open() como alternativa
            window.open(destinationUrl, '_blank');
        }
    });
});
