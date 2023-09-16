import fetchData from './WDI_inflacion.mjs';

$(document).ready(function() {
    let selectedCountries = ['Argentina']; // Países predeterminados, puedes cambiarlos
    let startYear = 1965; // Año de inicio predeterminado, puedes cambiarlo
    let endYear = 2022; // Año de fin predeterminado, puedes cambiarlo

    // Función para generar las casillas de verificación de los países
    function generateCountryCheckboxes(data) {
        const countrySelection = document.getElementById('countrySelection');
        const uniqueCountries = [...new Set(data.structuredData.map(row => row.Country))];

        uniqueCountries.forEach(country => {
            const checkboxLabel = document.createElement('label');
            checkboxLabel.classList.add('checkbox-label'); // Agregar la clase de estilo
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `country_${country}`;
            checkbox.value = country;
            checkbox.checked = selectedCountries.includes(country); // Marcar las casillas seleccionadas
            const label = document.createElement('label');
            label.textContent = country;
            label.setAttribute('for', `country_${country}`);

            checkboxLabel.appendChild(checkbox);
            checkboxLabel.appendChild(label);
            countrySelection.appendChild(checkboxLabel);
        });
    }

    // Función para obtener los países seleccionados
    function getSelectedCountries() {
        const checkboxes = document.querySelectorAll('.checkbox-label input[type="checkbox"]:checked');
        return Array.from(checkboxes, checkbox => checkbox.value);
    }

    // Función para generar las opciones del menú de selección de años
    function generateYearOptions() {
        const selectStartYear = document.getElementById('selectStartYear');
        const selectEndYear = document.getElementById('selectEndYear');

        for (let year = 1960; year <= 2022; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            selectStartYear.appendChild(option);

            const endYearOption = option.cloneNode(true);
            selectEndYear.appendChild(endYearOption);
        }
        // Establecer el valor predeterminado del select "selectEndYear"
          $('#selectEndYear').val(endYear); // Puedes ajustar el año predeterminado aquí

    }

    // Función para filtrar los países según el texto de búsqueda
    function filterCountries(searchText) {
        const checkboxes = document.querySelectorAll('.checkbox-label');

        checkboxes.forEach(checkboxLabel => {
            const countryName = checkboxLabel.textContent.toLowerCase();
            if (countryName.includes(searchText.toLowerCase())) {
                checkboxLabel.style.display = 'block'; // Mostrar casilla si coincide
            } else {
                checkboxLabel.style.display = 'none'; // Ocultar casilla si no coincide
            }
        });
    }

    // Función para actualizar el gráfico cuando se cambian los países o las fechas
    function updateChart(countries, start, end) {
        fetchData().then(data => {
            const filteredData = data.structuredData.filter(row =>
                countries.includes(row.Country) && row.Year >= start && row.Year <= end
            );

            const traces = countries.map(country => {
                const countryData = filteredData.filter(row => row.Country === country);
                const years = countryData.map(row => row.Year);
                const values = countryData.map(row => row.Value);

                return {
                    x: years,
                    y: values,
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: country, // Nombre del país en la leyenda
                    showlegend: true,
                    
                };
            });

            const layout = {
                title: 'Cómo impacta la inflación en tu vida?',
                xaxis: {
                    title: 'Año',
                    // Configurar el modo de las marcas de los ticks en 'auto'
                    tickmode: 'auto',
                    tickformat: 'd',
                    // Establecer la cantidad de intervalos en el eje X en 1
                },
                yaxis: {
                    title: 'Inlfation',
                    automargin: true,

                },
                width: 800, // Set the width of the chart in pixels
                height: 600, // Set the height of the chart in pixels
                
            };

            Plotly.newPlot('chart1', traces, layout);
        });
    }

    // Llamar a la función para cargar las casillas de verificación
    fetchData().then(data => {
        generateCountryCheckboxes(data);
        generateYearOptions();
        updateChart(selectedCountries, startYear, endYear);
    });

    // Manejar el evento de cambio en las casillas de verificación de países
    $(document).on('change', '.checkbox-label input[type="checkbox"]', function() {
        selectedCountries = getSelectedCountries();
        updateChart(selectedCountries, startYear, endYear);
    });

    // Manejar el evento de entrada en el cuadro de búsqueda
    $('#countrySearch').on('input', function() {
        const searchText = $(this).val();
        filterCountries(searchText);
    });

    // Manejar el evento de clic en el botón de filtro
    $('#filterButton').click(function() {
        startYear = parseInt($('#selectStartYear').val());
        endYear = parseInt($('#selectEndYear').val());

        // Validar que EndYear no sea menor que StartYear
        if (endYear < startYear) {
            alert('End Year should be later than Start Year.');
        } else {
            updateChart(selectedCountries, startYear, endYear);
        }
    });

        // JavaScript code for the #fullscreen-button click event
    // JavaScript code to toggle full-screen mode and apply the centering class

    $('#fullscreen-button').click(function () {
        var chartContainer = document.getElementById('debate_1');
        var overlay = document.querySelector('.overlay');
        
        if (chartContainer.requestFullscreen) {
            chartContainer.requestFullscreen();
            chartContainer.classList.add('center-content'); // Apply centering class
        } else if (chartContainer.mozRequestFullScreen) { // Firefox
            chartContainer.mozRequestFullScreen();
            chartContainer.classList.add('center-content'); // Apply centering class
        } else if (chartContainer.webkitRequestFullscreen) { // Chrome, Safari, and Opera
            chartContainer.webkitRequestFullscreen();
            chartContainer.classList.add('center-content'); // Apply centering class
        } else if (chartContainer.msRequestFullscreen) { // IE/Edge
            chartContainer.msRequestFullscreen();
            chartContainer.classList.add('center-content'); // Apply centering class
        }
        
        overlay.style.display = 'block'; // Show the overlay
        $('#debate_1').toggle(); // Toggle the visibility of #debate_1
    });

    // JavaScript code to exit full-screen mode and remove the centering class

    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }

    // Add an event listener to exit full-screen mode
    document.addEventListener('fullscreenchange', function () {
        var chartContainer = document.getElementById('debate_1');
        if (!document.fullscreenElement) {
            chartContainer.classList.remove('center-content'); // Remove centering class when exiting full-screen
        }
    });




// Event listener for the "Reset" button
$('#resetButton').click(function() {
    selectedCountries = ['Argentina']; // Set default countries
    updateChart(selectedCountries, startYear, endYear);
    // Uncheck the corresponding checkboxes
    const checkboxes = document.querySelectorAll('.checkbox-label input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectedCountries.includes(checkbox.value);
    });
});

// ... The rest of your existing code ...


    // Llamar a la función para cargar el gráfico inicial
    updateChart(selectedCountries, startYear, endYear);
});
