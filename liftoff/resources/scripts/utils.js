function agregarReloj() {
    var reloj = document.createElement('p');
    reloj.setAttribute('id', 'reloj'); // Añade un identificador al elemento <p> para estilizarlo con CSS
    
    // Busca el contenedor por su clase y agrega el reloj como hijo del contenedor
    var container = document.querySelector('.container');
    container.appendChild(reloj);

    // Función para actualizar el reloj cada segundo
    function actualizarReloj() {
        var ahora = new Date();
        var horas = ahora.getHours();
        var minutos = ahora.getMinutes();
        var segundos = ahora.getSeconds();

        // Formatear los números para que siempre tengan dos dígitos
        horas = horas < 10 ? '0' + horas : horas;
        minutos = minutos < 10 ? '0' + minutos : minutos;
        segundos = segundos < 10 ? '0' + segundos : segundos;

        // Actualizar el texto del reloj con la hora actual
        reloj.textContent = horas + ':' + minutos + ':' + segundos;
    }

    // Llamar a la función actualizarReloj cada segundo
    setInterval(actualizarReloj, 1000);
}
