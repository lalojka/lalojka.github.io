// script.js

// Validar formato de entrada
function validarFormatoEntrada(entrada) {
    const regex = /^[^\s:]+:[\d.]+$/;
    return regex.test(entrada.trim());
}

// Calcular pagos
function calcularPagos(pagos) {
    pagos = pagos.replace(/\s/g, '');
    const pagosLista = pagos.split(",");
    const pagosObjeto = {};

    for (let pago of pagosLista) {
        if (!validarFormatoEntrada(pago)) {
            return "Error: Formato inválido. Ejemplo correcto: 'nombre1:gasto1,nombre2:gasto2'";
        }
        const [persona, monto] = pago.split(":");
        const montoFloat = parseFloat(monto);

        if (isNaN(montoFloat) || montoFloat < 0) {
            return "Error: Los montos deben ser números positivos.";
        }

        if (pagosObjeto[persona.trim()]) {
            return "Error: Nombres duplicados no están permitidos.";
        }

        pagosObjeto[persona.trim()] = montoFloat;
    }

    const totalPagado = Object.values(pagosObjeto).reduce((a, b) => a + b, 0);
    const cantidadPersonas = Object.keys(pagosObjeto).length;
    const promedio = +(totalPagado / cantidadPersonas).toFixed(2);

    const deudas = {};
    for (let persona in pagosObjeto) {
        deudas[persona] = +(promedio - pagosObjeto[persona]).toFixed(2);
    }

    const debenPagar = {};
    const debenRecibir = {};
    for (let persona in deudas) {
        if (deudas[persona] > 0) {
            debenPagar[persona] = deudas[persona];
        } else if (deudas[persona] < 0) {
            debenRecibir[persona] = -deudas[persona];
        }
    }

    const pagosPorPersona = {};
    for (let pagador in debenPagar) {
        pagosPorPersona[pagador] = [];
        let montoPagar = debenPagar[pagador];
        for (let receptor in debenRecibir) {
            const montoRecibir = debenRecibir[receptor];
            if (montoPagar >= montoRecibir) {
                pagosPorPersona[pagador].push({ receptor, monto: montoRecibir });
                montoPagar -= montoRecibir;
                delete debenRecibir[receptor];
            } else {
                pagosPorPersona[pagador].push({ receptor, monto: montoPagar });
                debenRecibir[receptor] -= montoPagar;
                break;
            }
        }
    }

    return { totalPagado, cantidadPersonas, promedio, pagosPorPersona };
}

// Manejo de eventos
document.getElementById("buttonCalcular").addEventListener("click", () => {
    const inputPagos = document.getElementById("inputPagos").value;
    const resultado = document.getElementById("resultado");

    const respuesta = calcularPagos(inputPagos);
    if (typeof respuesta === "string") {
        resultado.textContent = respuesta;
    } else {
        const { totalPagado, cantidadPersonas, promedio, pagosPorPersona } = respuesta;
        let texto = `Total gastado: ${totalPagado}\nCantidad de personas: ${cantidadPersonas}\nPromedio: ${promedio}\n\n`;
        for (let pagador in pagosPorPersona) {
            const pagos = pagosPorPersona[pagador]
                .map(pago => `${pago.monto} a ${pago.receptor}`)
                .join(", ");
            texto += `${pagador} debe pagar ${pagos}\n`;
        }
        resultado.textContent = texto;
        document.getElementById("botonCopiar").style.display = "block";
    }
});

document.getElementById("buttonProbar").addEventListener("click", () => {
    document.getElementById("inputPagos").value = "juan:50,maria:40,lea:0,laura:320";
});

document.getElementById("botonCopiar").addEventListener("click", () => {
    const resultado = document.getElementById("resultado").textContent;

    // Crear un elemento de texto temporal
    const textArea = document.createElement("textarea");
    textArea.value = resultado;
    document.body.appendChild(textArea);

    // Seleccionar el texto y copiarlo
    textArea.select();
    textArea.setSelectionRange(0, 99999); // Para móviles

    try {
        const success = document.execCommand("copy");
        if (success) {
            alert("¡Resultado copiado al portapapeles!");
        } else {
            alert("Error al copiar el texto. Intenta nuevamente.");
        }
    } catch (err) {
        alert("Tu navegador no soporta la funcionalidad de copiar al portapapeles.");
    }

    // Eliminar el elemento temporal
    document.body.removeChild(textArea);
});

