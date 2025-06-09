// Lógica para validar sesión y acceso al endpoint seguro de insights

// Selecciona el contenedor donde mostrarás el resultado
const container = document.getElementById('metricas-container');

// Función para obtener y mostrar la validación
async function validarYMostrar() {
  const ig_id = localStorage.getItem('epm_selected_instagram_id');
  if (!ig_id) {
    container.innerHTML = `<p style="color: red;">No hay cuenta de Instagram seleccionada.</p>`;
    return;
  }

  container.innerHTML = "<p>Consultando API de reportes...</p>";

  try {
    const res = await fetch(`https://epm-app.onrender.com/api/reportes/${ig_id}/insights`, {
      method: 'GET',
      credentials: 'include', // ¡Envia la cookie de sesión!
    });
    const data = await res.json();

    if (data.ok) {
      container.innerHTML = `
        <div style="border: 1px solid green; padding: 1rem; border-radius: 8px;">
          <h3>¡Validación OK!</h3>
          <pre style="white-space: pre-wrap; word-break: break-all;">${JSON.stringify(data, null, 2)}</pre>
        </div>
      `;
    } else {
      container.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
    }
  } catch (err) {
    container.innerHTML = `<p style="color: red;">Error en fetch: ${err}</p>`;
  }
}

// Ejecuta la validación al cargar la página
validarYMostrar();