import * as d3 from "d3";
import type { LineChartOptions } from "./types";

interface LineChartData {
  name: string;
  value: number;
}

export function createLineChart(data: LineChartData[], options: LineChartOptions = {}): string {
  // Set the dimensions and margins
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = (options.width || 600) - margin.left - margin.right;
  const height = (options.height || 400) - margin.top - margin.bottom;

  // Create SVG
  const svg = d3.create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // Add a group element
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create scales
  const x = d3.scalePoint<string>()
    .domain(data.map(d => d.name))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value) || 0])
    .nice()
    .range([height, 0]);

  // Create line generator
  const line = d3.line<LineChartData>()
    .x(d => x(d.name) || 0)
    .y(d => y(d.value));

  // Add the line path
  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  // Add dots
  g.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.name) || 0)
    .attr("cy", d => y(d.value))
    .attr("r", 4)
    .attr("fill", "steelblue");

  // Add the x-axis
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Add the y-axis
  g.append("g")
    .call(d3.axisLeft(y));

  return svg.node()?.outerHTML || "";
} 