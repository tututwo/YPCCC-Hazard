// @ts-nocheck
"use client";
import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
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

const margin = { top: 10, right: 80, bottom: 50, left: 10 };
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
    const svgRef = useRef<SVGSVGElement>(null);
    const foregroundCanvasRef = useRef<HTMLCanvasElement>(null);
    const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);

    const { colorScale, updateSelectedCounties } = useMapStore();

    const xScale = useMemo(
      () =>
        d3
          .scaleLinear()
          .domain(d3.extent(data, (d) => d[xVariable]) as [number, number])
          .range([margin.left, width - margin.right]),
      [data, width, xVariable]
    );

    const yScale = useMemo(
      () =>
        d3
          .scaleLinear()
          .domain(d3.extent(data, (d) => d[yVariable]) as [number, number])
          .range([height - margin.bottom, margin.top]),
      [data, height, yVariable]
    );

    // Circle Data Refs
    const circleDataRef = useRef<any[]>([]);
    const circleDataMapRef = useRef<Map<string, any>>(new Map());

    // Build quadtree for efficient searching
    const quadtreeRef = useRef<d3.Quadtree<any> | null>(null);

    // Initialize circle data and quadtree
    useEffect(() => {
      const circles = data.map((d) => {
        const circle = {
          x: xScale(d[xVariable]),
          y: yScale(d[yVariable]),
          radius: d.radius || 3,
          baseRadius: d.radius || 3,
          color: colorScale(d[colorVariable]),
          fillColor: colorScale(d[colorVariable]),
          alpha: 0.8,
          state: "default",
          data: d,
          tween: null, // GSAP tween
        };
        return circle;
      });

      circleDataRef.current = circles;

      // Create a map for quick access
      const map = new Map();
      circles.forEach((circle) => {
        map.set(circle.data.geoid, circle);
      });
      circleDataMapRef.current = map;

      // Build quadtree
      const tree = d3
        .quadtree<any>()
        .x((d) => d.x)
        .y((d) => d.y)
        .addAll(circleDataRef.current);
      quadtreeRef.current = tree;

      // Draw background circles
      const ctxBackground = backgroundCanvasRef.current!.getContext("2d")!;
      ctxBackground.clearRect(0, 0, width, height);
      circles.forEach((circle) => {
        ctxBackground.beginPath();
        ctxBackground.arc(
          circle.x,
          circle.y,
          circle.baseRadius,
          0,
          2 * Math.PI
        );
        ctxBackground.fillStyle = circle.color;
        ctxBackground.globalAlpha = circle.alpha;
        ctxBackground.fill();
      });
    }, [
      data,
      xScale,
      yScale,
      xVariable,
      yVariable,
      colorScale,
      colorVariable,
      width,
      height,
    ]);

    // Initialize brush
    useEffect(() => {
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

        svg
          .select(".overlay")
          .attr("pointer-events", "all")
          .attr("fill", "none");
        svg.selectAll(".handle").attr("fill", "none");
      }
    }, [width, height]);

    // Brush functions
    const brushing = useRef(false);

    const { contextSafe } = useGSAP({ scope: svgRef });

    const brushed = useCallback(
      contextSafe((event: any) => {
        brushing.current = true;

        if (event.selection && quadtreeRef.current) {
          const [[x0, y0], [x1, y1]] = event.selection;
          const selected: any[] = [];

          // Perform quadtree search
          search(
            quadtreeRef.current,
            [
              [x0, y0],
              [x1, y1],
            ],
            [],
            selected
          );

          const selectedSet = new Set(selected.map((d) => d.data.geoid));

          // Update circle states
          circleDataRef.current.forEach((circle) => {
            if (selectedSet.has(circle.data.geoid)) {
              if (circle.state !== "selected") {
                circle.state = "selected";
                circle.fillColor = "red";
                if (circle.tween) circle.tween.kill();

                circle.tween = gsap.to(circle, {
                  radius: circle.baseRadius * 2,
                  duration: 0.3,
                  overwrite: true,
                  onUpdate: () => {
                    updateCircle(circle);
                  },
                });
              }
            } else {
              if (circle.state !== "default") {
                circle.state = "default";
                circle.fillColor = circle.color;
                if (circle.tween) circle.tween.kill();

                circle.tween = gsap.to(circle, {
                  radius: circle.baseRadius,
                  duration: 0.3,
                  overwrite: true,
                  onUpdate: () => {
                    updateCircle(circle);
                  },
                });
              }
            }
          });

          // Update global state with selected counties
          updateSelectedCounties(Array.from(selectedSet));
        } else {
          // No selection, reset all
          circleDataRef.current.forEach((circle) => {
            if (circle.state !== "default") {
              circle.state = "default";
              circle.fillColor = circle.color;
              if (circle.tween) circle.tween.kill();

              circle.tween = gsap.to(circle, {
                radius: circle.baseRadius,
                duration: 0.3,
                overwrite: true,
                onUpdate: () => {
                  updateCircle(circle);
                },
              });
            }
          });
          updateSelectedCounties([]);
        }
      }),
      [updateSelectedCounties, contextSafe]
    );

    const brushended = useCallback(
      contextSafe((event: any) => {
        brushing.current = false;
      }),
      [contextSafe]
    );

    const brush = useMemo(
      () =>
        d3
          .brush()
          .extent([
            [margin.left, margin.top],
            [width - margin.right, height - margin.bottom],
          ])
          .on("start brush", brushed)
          .on("end", brushended),
      [width, height, brushed, brushended]
    );

    // Update circle on animation update
    const updateCircle = useCallback((circle: any) => {
      // Only update the portion of the canvas where the circle is
      const ctx = foregroundCanvasRef.current!.getContext("2d")!;
      const padding = circle.baseRadius * 2; // Add padding to clear area around the circle
      ctx.clearRect(
        circle.x - padding,
        circle.y - padding,
        padding * 2,
        padding * 2
      );

      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
      ctx.fillStyle = circle.fillColor;
      ctx.globalAlpha = circle.alpha;
      ctx.fill();
    }, []);

    // Render loop
    useEffect(() => {
      const ctx = foregroundCanvasRef.current!.getContext("2d")!;
      ctx.clearRect(0, 0, width, height);

      // Initial draw
      circleDataRef.current.forEach((circle) => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
        ctx.fillStyle = circle.fillColor;
        ctx.globalAlpha = circle.alpha;
        ctx.fill();
      });
    }, [width, height]);

    return (
      <>
        {/* Background Canvas */}
        <canvas
          ref={backgroundCanvasRef}
          width={width}
          height={height}
          className="absolute z-10"
          style={{ top: margin.top + "px", left: margin.left + "px" }}
        ></canvas>

        {/* Foreground Canvas */}
        <canvas
          ref={foregroundCanvasRef}
          width={width}
          height={height}
          className="absolute z-20"
          style={{ top: margin.top + "px", left: margin.left + "px" }}
        ></canvas>

        {/* Brush Interface */}
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="absolute h-full z-50"
          style={{
            maxHeight: height,
            cursor: "crosshair",
          }}
        >
          <g
            id="brush-layer"
            transform={`translate(${margin.left}, ${margin.top})`}
          ></g>
        </svg>
      </>
    );
  }
);
