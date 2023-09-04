// Tamaño del lienzo del gráfico
const width = 400;
const height = 300;

// Crea un lienzo SVG en el cuerpo del documento
const svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

// Lee los datos desde el archivo JSON
d3.json('datos.json').then(data => {
    // Configura las escalas para el eje X y el eje Y
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height, 0]);

    // Crea las barras en el gráfico
    svg.selectAll('rect')
        .data(data)
        .enter().append('rect')
        .attr('x', d => xScale(d.label))
        .attr('y', d => yScale(d.value))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.value))
        .attr('fill', 'steelblue');

    // Agrega etiquetas en el eje X
    svg.selectAll('text')
        .data(data)
        .enter().append('text')
        .text(d => d.label)
        .attr('x', d => xScale(d.label) + xScale.bandwidth() / 2)
        .attr('y', height + 15)
        .attr('text-anchor', 'middle');

    // Agrega etiquetas en el eje Y
    svg.selectAll('text.value')
        .data(data)
        .enter().append('text')
        .text(d => d.value)
        .attr('x', d => xScale(d.label) + xScale.bandwidth() / 2)
        .attr('y', d => yScale(d.value) - 5)
        .attr('text-anchor', 'middle')
        .attr('class', 'value');

    // Agrega un menú desplegable para el filtro interactivo
    const select = d3.select('body').append('select')
        .attr('id', 'category-select');

    select.selectAll('option')
        .data(data)
        .enter().append('option')
        .attr('value', d => d.label)
        .text(d => d.label);

    // Función de actualización del gráfico en función de la selección
    function updateChart(selectedCategory) {
        const filteredData = data.filter(d => d.label === selectedCategory);

        // Actualiza las barras y etiquetas
        svg.selectAll('rect')
            .data(filteredData, d => d.label)
            .attr('y', d => yScale(d.value))
            .attr('height', d => height - yScale(d.value));

        svg.selectAll('text.value')
            .data(filteredData, d => d.label)
            .text(d => d.value)
            .attr('y', d => yScale(d.value) - 5);
    }

    // Configura el evento de cambio en el menú desplegable
    select.on('change', function () {
        const selectedCategory = d3.select(this).property('value');
        updateChart(selectedCategory);
    });
});