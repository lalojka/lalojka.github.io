document.addEventListener('DOMContentLoaded', function() {
    // Iniciar la función para alternar las imágenes cada 10 segundos
    setInterval(alternarImagenes, 10000);
});

function alternarImagenes() {
    var imagen = document.querySelector('.container img');
    var imagenActual = imagen.src;
    var nuevaImagen;

    // Verificar la imagen actual y asignar la nueva imagen
    if (imagenActual.includes('320x480_AON_Ofertas.jpg')) {
        nuevaImagen = 'resources/images/320x480_AON_carrito.jpg';
    } else {
        nuevaImagen = 'resources/images/320x480_AON_Ofertas.jpg';
    }

    // Cambiar la fuente de la imagen
    imagen.src = nuevaImagen;
}
