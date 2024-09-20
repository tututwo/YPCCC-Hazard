// @ts-nocheck
"use client";
import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
// NOTE: D3
import * as d3 from "d3";
import { Delaunay } from "d3-delaunay";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { useMapStore } from "@/lib/store";
// NOTE: VISX
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";

import { withTooltip } from "@visx/tooltip";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";
import { voronoi, VoronoiPolygon } from "@visx/voronoi";
import { localPoint } from "@visx/event";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
import Brush from "./brush-components/Brush";

import Tooltip from "@/components/ui/tooltip";
import {
  raise,
  twoSigFigFormatter,
  drawBackgroundPoints,
  drawForegroundPoints,
  nodes,
  search,
} from "@/lib/utils";
// Add these constants for your color scales

const tickLabelProps = {
  fill: "#222",
  fontFamily: "Roboto",
  fontSize: 14,
  textAnchor: "middle",
  fillOpacity: 0.5,
};
let tooltipTimeout: number;

const margin = { top: 10, right: 80, bottom: 50, left: 60 };
gsap.registerPlugin(useGSAP);

export const Scatterplot = withTooltip<DotsProps, PointsRange>(
  ({
    data,
    xVariable,
    yVariable,
    colorVariable,
    width,
    height,
    showControls = true,
    hideTooltip,
    showTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft,
    tooltipTop,
  }: DotsProps & WithTooltipProvidedProps<PointsRange>) => {
    const svgRef = useRef(null);
    const foregroundCanvasRef = useRef(null);
    const backgroundCanvasRef = useRef(null);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xMax = width - margin.left;
    const yMax = height - margin.bottom;
    // const [isBrushing, setIsBrushing] = useState(false);

    // const [brushedCircles, setBrushedCircles] = useState(new Set<string>());
    // const [currentBrushSelection, setCurrentBrushSelection] = useState<Set<string>>(new Set());
    // // FIXME: This is really slow. Improve it
    // const [hoveredPointId, setHoveredPointId] = useState(false);
    const {
      selectedState,
      setSelectedState,
      colorScale,
      selectedCounties,
      updateSelectedCounties,
    } = useMapStore();
    colorScale; // 0 -> 1
    const store = useRef({}).current; // stable ref object;
    Object.assign(store, {
      selectedState,
      setSelectedState,
      colorScale, // 1
      selectedCounties,
      updateSelectedCounties,
    });

    const brush = useMemo(
      () => {
     
        const x = scaleLinear<number>({
          domain: d3.extent(data, (d) => d[xVariable]) as [number, number],
          range: [margin.left, width - margin.right],
          clamp: false,
        });

        const y = scaleLinear<number>({
          domain: d3.extent(data, (d) => d[yVariable]) as [number, number],
          range: [height - margin.bottom, margin.top],
          clamp: false,
        });

        const coloredData = data.map((d) => ({
          ...d,
          color: store.colorScale(d[colorVariable]),
        }));

        // let result = coloredData;
        // const coloredAndRaisedData = (() => {
        //   if (hoveredPointId) {
        //     const index = result.findIndex((d) => d.geoid === hoveredPointId);
        //     if (index !== -1) {
        //       result = raise(result, index);
        //     }
        //   }
        // })();

        const brushed = (event) => {
          if (event.selection) {
            const [[x0, y0], [x1, y1]] = event.selection;
            const selected = [];
            search(
              quadtree,
              [
                [x0, y0],
                [x1, y1],
              ],
              [],
              selected
            );

            console.log(selected);
            drawForegroundPoints(
              foregroundCanvasRef.current,
              selected,
              store.selectedCounties,
              xVariable,
              yVariable,
              colorVariable,
              x,
              y,
              store.colorScale
            );

            // Update the global state
            store.updateSelectedCounties(selected.map(([a, b, d]) => d.geoid));
          }
        };

        const brushended = (event) => {
          if (!event.selection) {
            const ctx = foregroundCanvasRef.current.getContext("2d");
            ctx.clearRect(0, 0, width, height);
          }
        };

        const brush = d3
          .brush()
          .extent([
            [margin.left, margin.top],
            [width - margin.right, height - margin.bottom],
          ])
          .on("start brush", brushed)
          .on("end", brushended);

        const quadtree = d3
          .quadtree()
          .extent([
            [margin.left, margin.top],
            [width + margin.left, height + margin.top],
          ])
          .addAll(
            // x,y,data point, z index
            data.map((d) => [x(d[xVariable]), y(d[yVariable]), d, Math.random()])
          );

        setTimeout(() => {
          drawBackgroundPoints(
            backgroundCanvasRef.current,
            data,
            store.selectedCounties,
            xVariable,
            yVariable,
            colorVariable,
            x,
            y,
            store.colorScale
          );

          if (svgRef.current) {
            const svg = d3.select(svgRef.current);
            svg.select("g#brush-layer").call(brush);

            svg
              .select(".selection")
              .attr("fill", "#A7BDD3")
              .attr("fill-opacity", 0.08)
              .attr("stroke", "#12375A")
              .attr("stroke-width", 1)
              .attr("stroke-opacity", 0.8);

            svg.selectAll(".handle").attr("fill", "#000").attr("fill-opacity", 0.2);

            svg.select(".overlay").attr("pointer-events", "all").attr("fill", "none");
            svg.selectAll(".handle").attr("fill", "none");
          }
        }, 5000);

        return brush;
      },

      [
        /*empty*/
      ]
    );

    return (
      <>
        <canvas
          ref={backgroundCanvasRef}
          width={width * window.devicePixelRatio - margin.left}
          height={height * window.devicePixelRatio - margin.top}
          className="absolute z-10"
          style={{ top: margin.top + "px", left: margin.left + "px" }}
        ></canvas>
        <canvas
          ref={foregroundCanvasRef}
          width={width * window.devicePixelRatio - margin.left}
          height={height * window.devicePixelRatio - margin.top}
          className="absolute z-10"
          style={{ top: margin.top + "px", left: margin.left + "px" }}
        ></canvas>

        {/* Brush Interface */}
        <svg
          ref={svgRef}
          width={width}
          className="absolute h-full z-50"
          style={{
            maxHeight: height,
           
          }}
        >
          <g id="brush-layer" transform={`translate(${margin.left}, ${margin.top})`}></g>
        </svg>
      </>
    );
  }
);
