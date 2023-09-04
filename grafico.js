// grafico.js
const data = [
    { label: 'A', value: 42 },
    { label: 'B', value: 30 },
    { label: 'C', value: 65 },
    { label: 'D', value: 22 },
    { label: 'E', value: 50 },
  ];
  
  // Configura el tamaño del lienzo SVG
  const width = 400;
  const height = 300;
  
  // Crea el lienzo SVG
  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  // Escala para los ejes X e Y
  const xScale = d3
    .scaleBand()
    .domain(data.map(d => d.label))
    .range([0, width])
    .padding(0.1);
  
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([height, 0]);
  
  // Crea las barras
  svg
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', d => xScale(d.label))
    .attr('y', d => yScale(d.value))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - yScale(d.value))
    .attr('fill', 'blue');
  