import * as d3 from "d3";
import type { PieChartOptions } from "./types";

interface PieChartData {
  name: string;
  value: number;
}

export function createPieChart(data: PieChartData[], options: PieChartOptions = {}): string {
  // Set the dimensions and margins
  const width = options.width || 450;
  const height = options.height || 450;
  const margin = 40;
  const radius = Math.min(width, height) / 2 - margin;

  // Create color scale
  const color = d3.scaleOrdinal<string>()
    .domain(data.map(d => d.name))
    .range(d3.schemeCategory10);

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
    .attr("fill", d => color(d.data.name));

  // Add labels
  arcs.append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .text(d => d.data.name);

  return svg.node()?.outerHTML || "";
} 