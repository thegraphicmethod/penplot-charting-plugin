import * as d3 from "d3";
import type { BarChartOptions } from "./types";

interface barChartData {
  name: string;
  value: number;
}

export function createBarChart(data: barChartData[], options: BarChartOptions = {}): string {
  // Set the dimensions and margins of the graph
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = (options.width || 600) - margin.left - margin.right;
  const height = (options.height || 400) - margin.top - margin.bottom;

  // Create a new SVG element
  const svg = d3.create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // Add a group element for the chart content
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

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
    .attr("fill", "steelblue");

  // Add the x-axis
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Add the y-axis
  g.append("g")
    .call(d3.axisLeft(y));

  // Convert the SVG to a string and return it
  return svg.node()?.outerHTML || "";
}


