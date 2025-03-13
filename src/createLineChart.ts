import * as d3 from "d3";
import type { LineChartOptions, TextData } from "./types";

interface LineData {
  x: string;
  series: { [key: string]: number };
}

interface LineChartResult {
  svg: string;
  texts: TextData[];
}

export function createLineChart(data: LineData[], options: LineChartOptions = {}): LineChartResult {
  // Set the dimensions and margins
  const margin = { top: 20, right: 60, bottom: 30, left: 50 };
  const width = (options.width || 600) - margin.left - margin.right;
  const height = (options.height || 400) - margin.top - margin.bottom;

  // Create SVG
  const svg = d3.create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // Add a group element
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Get all series keys
  const seriesKeys = Object.keys(data[0]?.series || {}).sort();

  // Create color scale for different series
  const colorScale = d3.scaleOrdinal<string>()
    .domain(seriesKeys)
    .range(options.colorScheme || d3.schemeTableau10);

  // Create scales
  const x = d3.scalePoint<string>()
    .domain(data.map(d => d.x))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([
      0,
      d3.max(data, d => d3.max(seriesKeys, key => d.series[key])) || 0
    ])
    .nice()
    .range([height, 0]);

  // Create line generator
  const line = d3.line<[string, number]>()
    .x(d => x(d[0]) || 0)
    .y(d => y(d[1]));

  // Create area generator
  const area = d3.area<[string, number]>()
    .x(d => x(d[0]) || 0)
    .y0(height)  // baseline at the bottom
    .y1(d => y(d[1]));  // top of the area

  // Add grid if enabled
  if (options.showGrid) {
    // Add vertical grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .attr("transform", `translate(0,${height})`)
      .call(
        d3.axisBottom(x)
          .tickSize(-height)
          .tickFormat(() => "")
      );

    // Add horizontal grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(
        d3.axisLeft(y)
          .tickSize(-width)
          .tickFormat(() => "")
      );
  }

  // Add lines and areas for each series
  seriesKeys.forEach(key => {
    const seriesData = data.map(d => [d.x, d.series[key]] as [string, number]);
    const seriesColor = colorScale(key);

    if (options.showArea) {
      // Add the area
      g.append("path")
        .datum(seriesData)
        .attr("fill", seriesColor)
        .attr("fill-opacity", 0.2)
        .attr("stroke", "none")
        .attr("d", area);
    }

    // Add the line path
    g.append("path")
      .datum(seriesData)
      .attr("fill", "none")
      .attr("stroke", seriesColor)
      .attr("stroke-width", 1.5)
      .attr("d", line);

    // Add dots if enabled
    if (options.showDots) {
      g.selectAll(`circle-${key}`)
        .data(seriesData)
        .join("circle")
        .attr("cx", d => x(d[0]) || 0)
        .attr("cy", d => y(d[1]))
        .attr("r", 4)
        .attr("fill", seriesColor);
    }
  });

  // Add the x-axis
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Add the y-axis
  g.append("g")
    .call(d3.axisLeft(y));

  // Add legend
  const legend = g.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "start")
    .selectAll("g")
    .data(seriesKeys)
    .join("g")
    .attr("transform", (_, i) => `translate(${width + 10},${i * 20})`);

  legend.append("rect")
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", colorScale);


  // legend.append("text")
  //   .attr("x", 20)
  //   .attr("y", 7.5)
  //   .attr("dy", "0.32em")
  //   .text(d => `Series ${d.replace('y', '')}`);

  // Create array for text elements
  const texts: TextData[] = [];

  // // Add axis labels
  // data.forEach((d, i) => {
  //   texts.push({
  //     content: d.x,
  //     x: margin.left + (x(d.x) || 0),
  //     y: height + margin.top + 20, // Below x-axis
  //     align: 'center',
  //     fontSize: "12px",
  //     fontFamily: "Work Sans",
  //     fills: [{ fillColor: "#1A1A1A", fillOpacity: 1 }]
  //   });
  // });

  // // Add y-axis labels
  // y.ticks(5).forEach(tick => {
  //   texts.push({
  //     content: tick.toString(),
  //     x: margin.left - 10,
  //     y: margin.top + y(tick),
  //     align: 'right',
  //     fontSize: "12px",
  //     fontFamily: "Work Sans",
  //     fills: [{ fillColor: "#1A1A1A", fillOpacity: 1 }]
  //   });
  // });

  // Add legend texts
  seriesKeys.forEach((key, i) => {
    texts.push({
      content: `Series ${key.replace('y', '')}`,
      x: width + margin.left + 30,
      y: margin.top + (i * 20),
      align: 'left',
      fontSize: "12px",
      fontFamily: "Work Sans",
      fills: [{ fillColor: "#1A1A1A", fillOpacity: 1 }]
    });
  });

  return {
    svg: svg.node()?.outerHTML || "",
    texts
  };
} 