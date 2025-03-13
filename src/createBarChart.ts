import * as d3 from "d3";
import type { BarChartOptions, TextData } from "./types";

interface BarChartData {
  name: string;
  value: number;
}

interface BarChartResult {
  svg: string;
  texts: TextData[];
}

export function createBarChart(data: BarChartData[], options: BarChartOptions = {}): BarChartResult {
  // Set the dimensions and margins
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = (options.width || 600) - margin.left - margin.right;
  const height = (options.height || 400) - margin.top - margin.bottom;

  // Create SVG
  const svg = d3.create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // Add a group element for the chart content
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create color scale
  const colorScale = d3.scaleOrdinal<string>()
    .domain(data.map(d => d.name))
    .range(options.colorScheme || d3.schemeTableau10);

  // Create the scales
  const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value) || 0])
    .nice()
    .range([height, 0]);

  // Add the bars
  g.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", d => x(d.name) || 0)
    .attr("y", d => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.value))
    .attr("fill", d => colorScale(d.name));

  // Add the x-axis (keeping D3's text rendering)
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Add the y-axis (keeping D3's text rendering)
  g.append("g")
    .call(d3.axisLeft(y));

  // Create array for text elements
  const texts: TextData[] = [];

  // Add value labels on top of each bar
  data.forEach(d => {
    texts.push({
      content: d.value.toString(),
      x: margin.left + (x(d.name) || 0) + x.bandwidth()/2,
      y: margin.top + y(d.value) - 5, // Position slightly above the bar
      align: 'center',
      fontSize: "12px",
      fontFamily: "Work Sans",
      fills: [{ fillColor: "#666666", fillOpacity: 1 }]
    });
  });

  return {
    svg: svg.node()?.outerHTML || "",
    texts
  };
}


