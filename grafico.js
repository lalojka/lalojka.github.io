// Importa el archivo JSON usando fetch
fetch('datos.json')
    .then(response => response.json())
    .then(data => {
        // Configura las dimensiones del gráfico
        const width = 400;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };

        // Crea un contenedor SVG para el gráfico
        const svg = d3.select('#grafico-container')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Calcula el rango del eje X
        const x = d3.scaleBand()
            .domain(data.map(d => d.label))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        // Calcula el rango del eje Y
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Agrega las barras al gráfico
        svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', d => x(d.label))
            .attr('y', d => y(d.value))
            .attr('width', x.bandwidth())
            .attr('height', d => height - margin.bottom - y(d.value))
            .attr('fill', 'steelblue');

        // Agrega ejes X e Y
        svg.append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y));
    })
    .catch(error => {
        console.error('Error al cargar el archivo JSON', error);
    });
