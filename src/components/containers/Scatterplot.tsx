// @ts-nocheck
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Delaunay } from "d3-delaunay";
import { scaleThreshold } from "d3-scale";

// Add these constants for your color scales
const redColors = [
  "#67000d",
  "#a50f15",
  "#cb181d",
  "#ef3b2c",
  "#fb6a4a",
  "#fc9272",
  "#fcbba1",
  "#fee0d2",
  "#fff5f0",
];
const grayColors = [
  "#252525",
  "#525252",
  "#737373",
  "#969696",
  "#bdbdbd",
  "#d9d9d9",
  "#f0f0f0",
  "#ffffff",
];

function calculateSlope(x1, y1, x2, y2) {
  return (y2 - y1) / (x2 - x1);
}

function distanceFromLine(x, y, x1, y1, x2, y2) {
  const numerator = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1);
  const denominator = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
  return numerator / denominator;
}

const x_variable = "L_cc_heatscore";
const y_variable = "R_heat_worry";
const scaleSizeOfCircles = 6;
const Scatterplot = ({ data }) => {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    const container = document.getElementById("scatterplot-container");
    if (container) {
      resizeObserver.observe(container);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (
      !data ||
      data.length === 0 ||
      dimensions.width === 0 ||
      dimensions.height === 0
    )
      return;

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    //   NOTE: Scales
    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.L_cc_heatscore))
      .range([0, width])
      .nice();

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.R_heat_worry))
      .range([height, 0])
      .nice();

    // NOTE: Color scales

    // Replace the existing slope calculation with this
    const slope = calculateSlope(0, height, width, 0);
    const intercept = height; // The line now starts at (0, height)
    // Color scales
    const maxDistance = Math.max(
      ...data.map((d) =>
        distanceFromLine(
          x(d[x_variable]),
          y(d[y_variable]),
          0,
          height,
          width,
          0
        )
      )
    );

    const grayScale = scaleThreshold()
      .domain(
        d3
          .range(1, grayColors.length)
          .map((i) => (i / grayColors.length) * maxDistance)
      )
      .range(grayColors.reverse()); // Reverse the order to make farther points darker

    const redScale = scaleThreshold()
      .domain(
        d3
          .range(1, redColors.length)
          .map((i) => (i / redColors.length) * maxDistance)
      )
      .range(redColors.reverse()); // Reverse the order to make farther points darker red

    // Add color property to data
    const coloredData = data.map((d) => {
      const xPos = x(d[x_variable]);
      const yPos = y(d[y_variable]);
      const distance = distanceFromLine(xPos, yPos, 0, height, width, 0);
      const isAbove = yPos < -slope * xPos + intercept;
      return {
        ...d,
        color:  redScale(distance),
      };
    });

    // NOTE: Add axes

    const delaunay = Delaunay.from(
      data,
      (d) => x(d.L_cc_heatscore),
      (d) => y(d.R_heat_worry)
    );
    const voronoi = delaunay.voronoi([0, 0, width, height]);

    const brush = d3
      .brush()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("start brush end", brushed);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("pointer-events", "none");

    const dots = g
      .append("g")
      .selectAll("circle")
      .data(coloredData)
      .join("circle")
      .attr("cx", (d) => x(d[x_variable]))
      .attr("cy", (d) => y(d[y_variable]))
      .attr("r", 3)
      .attr("fill", (d) => d.color);
    // Add this after creating the dots
    g.append("line")
      .attr("x1", 0)
      .attr("y1", height)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "5,5");
    const brushGroup = g.append("g").attr("class", "brush").call(brush).lower(); // Ensure brush is below other interactive elements

    let storedSelection = null;

    // Update brushed function
    function brushed(event) {
      const selection = event.selection;
      const isBrushing = event.type === "brush";

      brushGroup.select(".selection").style("fill", isBrushing ? null : "none");

      if (selection) {
        storedSelection = selection;
        updateCircles(selection);
      } else if (event.type === "end" && !selection) {
        updateCircles(null);
        storedSelection = null;
      }
    }

    function updateCircles(selection) {
      dots
        .transition()
        .duration(50)
        .attr("r", (d) =>
          selection &&
          x(d[x_variable]) >= selection[0][0] &&
          x(d[x_variable]) <= selection[1][0] &&
          y(d[y_variable]) >= selection[0][1] &&
          y(d[y_variable]) <= selection[1][1]
            ? scaleSizeOfCircles
            : 3
        )
        .attr("stroke", (d) =>
          selection &&
          x(d[x_variable]) >= selection[0][0] &&
          x(d[x_variable]) <= selection[1][0] &&
          y(d[y_variable]) >= selection[0][1] &&
          y(d[y_variable]) <= selection[1][1]
            ? "black"
            : "none"
        )
        .attr("stroke-width", "1");
    }

    // Update mousemove handler
    g.on("mousemove", (event) => {
      if (!storedSelection) {
        const [mx, my] = d3.pointer(event);
        const i = delaunay.find(mx, my);
        if (i !== -1) {
          const d = coloredData[i];
          tooltip
            .style("opacity", 1)
            .html(
              `${d.county}, ${d.state}<br/>X: ${d[x_variable]}<br/>Y: ${d[y_variable]}`
            )
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px");
          dots.attr("r", (j, index) => (index === i ? scaleSizeOfCircles : 3));
        } else {
          tooltip.style("opacity", 0);
          //   dots.attr("r", 3);
        }
      }
    });

    g.on("mouseleave", () => {
      tooltip.style("opacity", 0);
      //   dots.attr("r", 3);
    });
  }, [data, dimensions]);

  return <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />;
};

export default Scatterplot;
