

// Obtener referencia a los selectores de mes
const mesesSelects = document.querySelectorAll('select');

// Array de meses
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Llenar cada select con las opciones de meses
mesesSelects.forEach(select => {
  meses.forEach(mes => {
    const option = document.createElement('option');
    option.textContent = mes;
    option.value = mes;
    select.appendChild(option);
  });
});


function calcularPlan() {
  const salario = parseFloat(document.getElementById('salario').value.replace(',', '')) || 0;
  const gastoFijo = parseFloat(document.getElementById('gastoFijo').value.replace(',', '')) || 0;
  const gastoVariable = parseFloat(document.getElementById('gastoVariable').value.replace(',', '')) || 0;
  const inversiones = parseFloat(document.getElementById('inversiones').value.replace(',', '')) || 0;
  const ingresoExtra1 = parseFloat(document.getElementById('ingresoExtra1').value.replace(',', '')) || 0;
  const ingresoExtra2 = parseFloat(document.getElementById('ingresoExtra2').value.replace(',', '')) || 0;
  const ingresoExtra3 = parseFloat(document.getElementById('ingresoExtra3').value.replace(',', '')) || 0;
  const ingresoExtra4 = parseFloat(document.getElementById('ingresoExtra4').value.replace(',', '')) || 0;
  const ingresoExtra5 = parseFloat(document.getElementById('ingresoExtra5').value.replace(',', '')) || 0;
  const gastoExtra1 = parseFloat(document.getElementById('gastoExtra1').value.replace(',', '')) || 0;
  const gastoExtra2 = parseFloat(document.getElementById('gastoExtra2').value.replace(',', '')) || 0;
  const gastoExtra3 = parseFloat(document.getElementById('gastoExtra3').value.replace(',', '')) || 0;
  const gastoExtra4 = parseFloat(document.getElementById('gastoExtra4').value.replace(',', '')) || 0;
  const gastoExtra5 = parseFloat(document.getElementById('gastoExtra5').value.replace(',', '')) || 0;

  const mesIngresoExtra1 = document.getElementById('mesIngresoExtra1').value;
  const mesIngresoExtra2 = document.getElementById('mesIngresoExtra2').value;
  const mesIngresoExtra3 = document.getElementById('mesIngresoExtra3').value;
  const mesIngresoExtra4 = document.getElementById('mesIngresoExtra4').value;
  const mesIngresoExtra5 = document.getElementById('mesIngresoExtra5').value;
  const mesGastoExtra1 = document.getElementById('mesGastoExtra1').value;
  const mesGastoExtra2 = document.getElementById('mesGastoExtra2').value;
  const mesGastoExtra3 = document.getElementById('mesGastoExtra3').value;
  const mesGastoExtra4 = document.getElementById('mesGastoExtra4').value;
  const mesGastoExtra5 = document.getElementById('mesGastoExtra5').value;

  // Validar que los valores ingresados sean mayores o iguales a cero
  if (salario < 0 || gastoFijo < 0 || gastoVariable < 0 || inversiones < 0 ||
    ingresoExtra1 < 0 || ingresoExtra2 < 0 || ingresoExtra3 < 0 || ingresoExtra4 < 0 || ingresoExtra5 < 0 ||
    gastoExtra1 < 0 || gastoExtra2 < 0 || gastoExtra3 < 0 || gastoExtra4 < 0 || gastoExtra5 < 0) {
  // Mostrar un mensaje de error utilizando SweetAlert2
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'Por favor, asegúrate de ingresar valores mayores o iguales a cero.',
    confirmButtonColor: '#3085d6', // Cambia el color del botón "OK" a azul
  });
  // Detener la ejecución de la función
  return;
}



  const subtotalAhorro = salario - gastoFijo - gastoVariable - inversiones;

  const parametros = ['Salario Neto de impuestos', 'Gastos fijos', 'Gastos variables', 'Inversiones', 'Subtotal ahorro',
                      'Ingreso Extra 1', 'Ingreso Extra 2', 'Ingreso Extra 3', 'Ingreso Extra 4', 'Ingreso Extra 5',
                      'Gasto Extra 1', 'Gasto Extra 2', 'Gasto Extra 3', 'Gasto Extra 4', 'Gasto Extra 5'];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const tablaBody = document.querySelector('tbody');

  // Limpiar tabla antes de agregar nuevos resultados
  tablaBody.innerHTML = '';

  // Calcular y mostrar resultados por mes
  parametros.forEach(parametro => {
    const fila = document.createElement('tr');
    const columnaParametro = document.createElement('td');
    columnaParametro.textContent = parametro;
    fila.appendChild(columnaParametro);

    meses.forEach(mes => {
      let valor;
      switch (parametro) {
        case 'Salario Neto de impuestos':
          valor = formatoNumero(salario);
          break;
        case 'Gastos fijos':
          valor = formatoNumero(gastoFijo);
          break;
        case 'Gastos variables':
          valor = formatoNumero(gastoVariable);
          break;
        case 'Inversiones':
          valor = formatoNumero(inversiones);
          break;
        case 'Subtotal ahorro':
          valor = formatoNumero(subtotalAhorro);
          break;
        case 'Ingreso Extra 1':
          valor = mes === mesIngresoExtra1 ? formatoNumero(ingresoExtra1) : 0;
          break;
        case 'Ingreso Extra 2':
          valor = mes === mesIngresoExtra2 ? formatoNumero(ingresoExtra2) : 0;
          break;
        case 'Ingreso Extra 3':
          valor = mes === mesIngresoExtra3 ? formatoNumero(ingresoExtra3) : 0;
          break;
        case 'Ingreso Extra 4':
          valor = mes === mesIngresoExtra4 ? formatoNumero(ingresoExtra4) : 0;
          break;
        case 'Ingreso Extra 5':
          valor = mes === mesIngresoExtra5 ? formatoNumero(ingresoExtra5) : 0;
          break;
        case 'Gasto Extra 1':
          valor = mes === mesGastoExtra1 ? formatoNumero(gastoExtra1) : 0;
          break;
        case 'Gasto Extra 2':
          valor = mes === mesGastoExtra2 ? formatoNumero(gastoExtra2) : 0;
          break;
        case 'Gasto Extra 3':
          valor = mes === mesGastoExtra3 ? formatoNumero(gastoExtra3) : 0;
          break;
        case 'Gasto Extra 4':
          valor = mes === mesGastoExtra4 ? formatoNumero(gastoExtra4) : 0;
          break;
        case 'Gasto Extra 5':
          valor = mes === mesGastoExtra5 ? formatoNumero(gastoExtra5) : 0;
          break;
        default:
          valor = 0;
          break;
      }

      const columnaMes = document.createElement('td');
      columnaMes.textContent = valor;
      fila.appendChild(columnaMes);
    });

    tablaBody.appendChild(fila);
  });

  // Calcular y agregar la fila de Total ahorro
  const filaTotalAhorro = document.createElement('tr');
  const columnaTotalAhorro = document.createElement('td');
  columnaTotalAhorro.textContent = 'Total ahorro';
  filaTotalAhorro.appendChild(columnaTotalAhorro);

  meses.forEach(mes => {
    let totalMes = subtotalAhorro; // Iniciar con el subtotal de ahorro
    if (mes === mesIngresoExtra1) totalMes += ingresoExtra1 ;
    if (mes === mesIngresoExtra2) totalMes += ingresoExtra2;
    if (mes === mesIngresoExtra3) totalMes += ingresoExtra3;
    if (mes === mesIngresoExtra4) totalMes += ingresoExtra4;
    if (mes === mesIngresoExtra5) totalMes += ingresoExtra5;
    if (mes === mesGastoExtra1) totalMes -= gastoExtra1;
    if (mes === mesGastoExtra2) totalMes -= gastoExtra2;
    if (mes === mesGastoExtra3) totalMes -= gastoExtra3;
    if (mes === mesGastoExtra4) totalMes -= gastoExtra4;
    if (mes === mesGastoExtra5) totalMes -= gastoExtra5;
    const columnaMes = document.createElement('td');
    columnaMes.textContent = formatoNumero(totalMes);
    filaTotalAhorro.appendChild(columnaMes);
  });

  tablaBody.appendChild(filaTotalAhorro);

  // Aplicar el estilo de color rojo si el total ahorro es negativo
  const valorTotalAhorro = parseFloat(filaTotalAhorro.lastElementChild.textContent.replace(',', ''));
  if (valorTotalAhorro < 0) {
    filaTotalAhorro.querySelectorAll('td').forEach(celda => {
      celda.style.color = 'red';
    });
  }

}

function calcularTotalAhorroAcumuladoPorMes() {
  const tablaBody = document.querySelector('tbody');
  const filas = tablaBody.querySelectorAll('tr');
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // Calcular y agregar la fila de Total ahorro acumulado por mes
  const filaTotalAhorroAcumulado = document.createElement('tr');
  const columnaTotalAhorroAcumulado = document.createElement('td');
  columnaTotalAhorroAcumulado.textContent = 'Total ahorro acumulado';
  filaTotalAhorroAcumulado.appendChild(columnaTotalAhorroAcumulado);

  meses.forEach((mes, index) => {
    let totalAhorroAcumulado = 0;
    for (let i = 0; i <= index; i++) {
      const valorMes = filas[filas.length - 1].querySelector(`td:nth-child(${i + 2})`).textContent;
      if (valorMes.includes('M')) {
        totalAhorroAcumulado += parseFloat(valorMes.replace(/[,M]/g, '')) * 1000000; // Convertir millones a su equivalente numérico
      } else {
        totalAhorroAcumulado += parseFloat(valorMes.replace(/[,]/g, '')); // Eliminar comas y convertir a número
      }
    }
    const columnaMes = document.createElement('td');
    columnaMes.textContent = formatoNumero(totalAhorroAcumulado);
    filaTotalAhorroAcumulado.appendChild(columnaMes);
  });

  tablaBody.appendChild(filaTotalAhorroAcumulado);
}


function agregarColumnaTotal() {
  const tablaBody = document.querySelector('tbody');

  // Recorremos cada fila en la tabla
  tablaBody.querySelectorAll('tr').forEach(fila => {
    let total = 0;
    
    // Sumamos los valores de cada celda en la fila (excepto la primera que es el nombre del parámetro)
    fila.querySelectorAll('td:not(:first-child)').forEach(celda => {
      let valor = celda.textContent.trim(); // Obtener el contenido de la celda sin espacios al inicio o al final
      
      if (valor.includes('M')) {
        total += parseFloat(valor.replace(/[,M]/g, '')) * 1000000; // Convertir millones a su equivalente numérico
      } else {
        total += parseFloat(valor.replace(/[,]/g, '')) || 0; // Convertir el texto de la celda a número y sumar
      }
    });

    // Creamos una nueva celda para mostrar el total y la agregamos al final de la fila
    const columnaTotal = document.createElement('td');
    columnaTotal.textContent = formatoNumero(total);
    fila.appendChild(columnaTotal);

    // Verificar si el total es igual a 0 y eliminar la fila si es necesario
    if (total === 0) {
      fila.remove();
    }
  });
}



function aplicarFormatoAhorro() {
  const tablaBody = document.querySelector('tbody');
  const filas = tablaBody.querySelectorAll('tr');

  // Encontrar la fila del "Subtotal ahorro" por su nombre
  let filaAhorro;
  filas.forEach(fila => {
    const nombreParametro = fila.querySelector('td:first-child').textContent.trim(); // Obtener el nombre del parámetro de la primera celda de la fila
    if (nombreParametro === 'Subtotal ahorro') {
      filaAhorro = fila;
    }
  });

  // Verificar si se encontró la fila del "Subtotal ahorro"
  if (filaAhorro) {
    // Aplicar el formato de borde doble a todas las celdas de la fila del "Subtotal ahorro"
    filaAhorro.querySelectorAll('td').forEach(celda => {
      celda.style.borderTop = '2px double black';
    });
  } else {
    console.log('No se encontró la fila del "Subtotal ahorro"');
  }

  // Aplicar formato de color de texto rojo a las filas específicas
  const filasRojo = ['Gastos fijos', 'Gastos variables', 'Gasto Extra 1', 'Gasto Extra 2', 'Gasto Extra 3', 'Gasto Extra 4', 'Gasto Extra 5'];
  filas.forEach(fila => {
    const nombreParametro = fila.querySelector('td:first-child').textContent.trim(); // Obtener el nombre del parámetro de la primera celda de la fila
    if (filasRojo.includes(nombreParametro)) {
      fila.querySelectorAll('td').forEach(celda => {
        celda.style.color = 'red';
      });
    }
  });
}

// Array para almacenar los mensajes por mes
let mensajesPorMes = [];

let alertaMostrada = false;

function verificarAhorroSuficientePorMes() {
  const tablaBody = document.querySelector('tbody');
  const filaTotalAhorroAcumulado = tablaBody.querySelector('tr:last-child');
  const valoresAhorroAcumulado = Array.from(filaTotalAhorroAcumulado.querySelectorAll('td')).slice(1); // Obtener los valores de ahorro acumulado por mes
  
  // Verificar si ya se ha mostrado la alerta
  if (!alertaMostrada) {
    let primerMesNegativo = '';
    
    valoresAhorroAcumulado.forEach((valor, index) => {
      const mes = meses[index];
      const valorAhorro = parseFloat(valor.textContent.replace(',', ''));
      
      if (valorAhorro < 0 && !primerMesNegativo) {
        primerMesNegativo = mes;
      }
    });
    
    // Mostrar mensaje de alerta solo si se encontró un mes con valor negativo
    if (primerMesNegativo) {
      alertaMostrada = true; // Establecer la variable de control como verdadera para evitar mostrar más alertas
      
      Swal.fire({
        icon: 'error',
        title: 'El dinero no te alcanzará',
        html: `El dinero no te alcanzará en ${primerMesNegativo}.<br>Debes modificar algunas variables para poder cumplir con tus objetivos financieros`,
        confirmButtonColor: '#3085d6', // Cambia el color del botón "OK" a azul
      });
    }
    // Restablecer la variable alertaMostrada a false
    alertaMostrada = false;


  }
}





// Función para formatear números con separador de miles y sin decimales
function formatoNumero(numero) {
  // Convertir el número a formato abreviado si es mayor o igual a 1000
  if (Math.abs(numero) >= 1000000) {
    const millones = (numero / 1000000).toFixed(1);
    return millones % 1 === 0 ? millones.slice(0, -2) + 'M' : millones + 'M'; // Representar en millones
  } else {
    return numero.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Formato con comas para números menores a 1000
  }
}
