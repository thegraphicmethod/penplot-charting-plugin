import * as d3 from "d3";
import type { PieChartOptions, TextData } from "./types";

interface PieChartData {
  name: string;
  value: number;
}

interface PieChartResult {
  svg: string;
  texts: TextData[];
}

export function createPieChart(data: PieChartData[], options: PieChartOptions = {}): PieChartResult {
  // Set the dimensions and margins
  const width = options.width || 450;
  const height = options.height || 450;
  const margin = 40;
  const radius = Math.min(width, height) / 2 - margin;

  console.log('createpiechart',options)
  // Create color scale
  const colorScale = d3.scaleOrdinal<string>()
    .domain(data.map(d => d.name))
    .range(options.colorScheme || d3.schemeTableau10);

  // Create SVG
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);

  // Create chart group
  const g = svg.append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // Generate the pie
  const pie = d3.pie<PieChartData>()
    .value(d => d.value);

  // Generate the arcs
  const arc = d3.arc<d3.PieArcDatum<PieChartData>>()
    .innerRadius(options.innerRadius ? radius * options.innerRadius : 0)
    .outerRadius(radius);

  // Add the arcs
  const arcs = g.selectAll("arc")
    .data(pie(data))
    .enter()
    .append("g");

  // Add path elements
  arcs.append("path")
    .attr("d", arc)
    .attr("fill", d => colorScale(d.data.name));

  // Create array for text elements
  const texts: TextData[] = [];

  // Calculate positions for labels
  pie(data).forEach(d => {
    const centroid = arc.centroid(d);
    const x = width/2 + centroid[0];
    const y = height/2 + centroid[1];
    
    texts.push({
      content: d.data.name,
      x,
      y,
      align: 'center',
      fontSize: "12",
      fontFamily: "Work Sans",
      fills: [{ fillColor: "#000000", fillOpacity: 1 }]
    });

    // Add value labels below the name
    texts.push({
      content: d.data.value.toString(),
      x,
      y: y + 15,
      align: 'center',
      fontSize: "10",
      fontFamily: "Work Sans",
      fills: [{ fillColor: "#000000", fillOpacity: 1 }]
    });
  });

  return {
    svg: svg.node()?.outerHTML || "",
    texts
  };
} 