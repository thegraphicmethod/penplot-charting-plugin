import * as d3 from "d3";
import type { RadarChartOptions, TextData } from "./types";

interface LineData {
  x: string;
  series: { [key: string]: number };
}

interface RadarChartResult {
  svg: string;
  texts: TextData[];
}

export function createRadarChart(data: LineData[], options: RadarChartOptions = {}): RadarChartResult {
  const width = options.width || 450;
  const height = options.height || 450;
  const margin = 40;
  const radius = Math.min(width, height) / 2 - margin;

  // Default colors
  const gridColor = options.gridColor || "#E2E8F0";

  // Get all series keys
  const seriesKeys = Object.keys(data[0]?.series || {}).sort();

  // Create color scale for different series
  const colorScale = d3
    .scaleOrdinal<string>()
    .domain(seriesKeys)
    .range(options.colorScheme || d3.schemeTableau10);

  // Create SVG
  const svg = d3.create("svg").attr("width", width).attr("height", height);

  // Create chart group and center it
  const g = svg
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // Scale for the radius
  const rScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, (d) => d3.max(seriesKeys, (key) => d.series[key])) || 0,
    ])
    .range([0, radius]);

  // Calculate angles for each point (uniform distribution)
  const angleStep = (2 * Math.PI) / data.length;
  const getAngle = (i: number) => i * angleStep - Math.PI / 2;

  // Create background circles and lines
  const levels = 5;
  const levelRadius = radius / levels;

  // Add circles for each level
  for (let i = 1; i <= levels; i++) {
    g.append("circle")
      .attr("r", levelRadius * i)
      .attr("fill", "none")
      .attr("stroke", gridColor)
      .attr("opacity", 0.8);
  }

  // Add axis lines
  data.forEach((_, i) => {
    const angle = getAngle(i);
    g.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", radius * Math.cos(angle))
      .attr("y2", radius * Math.sin(angle))
      .attr("stroke", gridColor)
      .attr("opacity", 0.8);
  });

  // Create line generator
  const lineGenerator = d3
    .line<[number, number]>()
    .x((d) => d[0])
    .y((d) => d[1]);

  // Draw each series
  seriesKeys.forEach((key) => {
    // Create points for this series
    const points = data.map((d, i) => {
      const value = rScale(d.series[key]);
      const angle = getAngle(i);
      return [value * Math.cos(angle), value * Math.sin(angle)] as [
        number,
        number,
      ];
    });

    // Close the path by adding the first point again
    points.push(points[0]);

    const seriesColor = colorScale(key);

    // Add fill if enabled
    if (options.showFill) {
      g.append("path")
        .attr("d", lineGenerator(points))
        .attr("fill", seriesColor)
        .attr("fill-opacity", 0.2)
        .attr("stroke", "none");
    }

    // Add the line path
    g.append("path")
      .attr("d", lineGenerator(points))
      .attr("fill", "none")
      .attr("stroke", seriesColor)
      .attr("stroke-width", 1.5);

    // Add dots at data points
    g.selectAll(`circle.data-point-${key}`)
      .data(points.slice(0, -1))
      .join("circle")
      .attr("class", `data-point-${key}`)
      .attr("cx", (d) => d[0])
      .attr("cy", (d) => d[1])
      .attr("r", 4)
      .attr("fill", seriesColor);
  });

//   // Add debug circles at text anchor points
//   g.selectAll("circle.debug-text-anchor")
//     .data(data)
//     .join("circle")
//     .attr("class", "debug-text-anchor")
//     .attr("cx", (_, i) => {
//       const angle = getAngle(i);
//       return (radius + 20) * Math.cos(angle);
//     })
//     .attr("cy", (_, i) => {
//       const angle = getAngle(i);
//       return  (radius + 20) * Math.sin(angle);
//     })
//     .attr("r", 2)
//     .attr("fill", "red");


  // Update the texts array to use the new interface
  const texts: TextData[] = data.map((d, i) => {
    const angle = getAngle(i);
    const x = (radius + 20) * Math.cos(angle);
    const y = (radius + 20) * Math.sin(angle);

    // Determine text alignment based on angle
    let align: "left" | "center" | "right" = "center";
    if (Math.abs(angle) < Math.PI / 2) align = "left";
    if (Math.abs(angle) > Math.PI / 2) align = "right";

    return {
      content: d.x,
      x: width / 2 + x,
      y: height / 2 + y,
      align,
      fontSize: "12",
      fontFamily: "Work Sans",
      fills: [{ fillColor: "#000000", fillOpacity: 1 }],
    };
  });

  // Update legend texts
  seriesKeys.forEach((key, i) => {
    texts.push({
      content: `Series ${key.replace("y", "")}`,
      x: width - 40,
      y: 20 + i * 20,
      align: "left",
      fontSize: "12",
      fontFamily: "Work Sans",
      fills: [{ fillColor: "#1A1A1A", fillOpacity: 1 }],
    });
  });

  // Add legend
  const legend = g
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "start")
    .selectAll("g")
    .data(seriesKeys)
    .join("g")
    .attr(
      "transform",
      (_, i) => `translate(${width / 2 - 60},${-height / 2 + 20 + i * 20})`
    );

  legend
    .append("rect")
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", colorScale);

  return {
    svg: svg.node()?.outerHTML || "",
    texts,
  };
} 