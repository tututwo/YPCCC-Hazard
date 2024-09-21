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
// Add these constants for your color scales

const tickLabelProps = {
  fill: "#222",
  fontFamily: "Roboto",
  fontSize: 14,
  textAnchor: "middle",
  fillOpacity: 0.5,
};
let tooltipTimeout: number;
const twoSigFigFormatter = d3.format(".2r");
function raise<T>(items: T[], raiseIndex: number) {
  const array = [...items];
  const lastIndex = array.length - 1;
  const [raiseItem] = array.splice(raiseIndex, 1);
  array.splice(lastIndex, 0, raiseItem);
  return array;
}

const margin = { top: 10, right: 80, bottom: 50, left: 60 };
gsap.registerPlugin(useGSAP);
function drawPoints(
  canvas,
  dataset,
  selectedCounties,
  xVariable,
  yVariable,
  colorVariable,
  xScale,
  yScale,
  colorScale
) {
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dataset.forEach((d) => {
    const isHighlighted = d.isBrushed || selectedCounties.includes(d.geoid);

    // NOTE: Larger circle
    if (isHighlighted) {
      ctx.beginPath();
      // circle merge?
      ctx.arc(
        xScale(d[xVariable]),
        yScale(d[yVariable]),
        d.radius * 1.4,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.strokeStyle = colorScale(d[colorVariable]);
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    // NOTE: Smaller circle

    // ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = isHighlighted ? 1 : 0.8;
    ctx.beginPath();
    ctx.arc(
      xScale(d[xVariable]),
      yScale(d[yVariable]),
      d.radius,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = colorScale(d[colorVariable]);
    ctx.fill();
    // FIXME: This produce a merging effect
    // ctx.fillStyle = "white";
    // ctx.fill();
    // ctx.strokeStyle = "black";
    // ctx.lineWidth = 2;
    // ctx.stroke();
  });
}
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
          width={width - margin.left}
          height={height - margin.top}
          className="absolute z-10"
          style={{ top: margin.top + "px", left: margin.left + "px" }}
        ></canvas>
        <canvas
          ref={foregroundCanvasRef}
          width={width - margin.left}
          height={height - margin.top}
          className="absolute z-10"
          style={{ top: margin.top + "px", left: margin.left + "px" }}
        ></canvas>
        <svg
          width={width}
          className="absolute  h-full"
          style={{
            maxHeight: height,
          }}
        >
          <Group left={margin.left} top={margin.top}>
            <GridRows
              scale={y}
              width={xMax}
              height={yMax}
              stroke="#F2F2F2"
              strokeWidth={1.5}
              className="z-0"
            />
            <GridColumns
              scale={x}
              width={xMax}
              height={yMax}
              stroke="#F2F2F2"
              strokeWidth={1.5}
              className="z-0"
            />

            <AxisBottom
              top={yMax}
              scale={x}
              numTicks={width > 520 ? 10 : 5}
              hideTicks
              hideZero
              hideAxisLine
              label="Rating"
              labelClassName="text-base font-bold text-gray-500 "
              tickLabelProps={tickLabelProps}
            />
            <AxisLeft
              scale={y}
              hideTicks
              hideZero
              hideAxisLine
              label="Worry"
              labelClassName="text-base font-bold text-gray-500"
              tickLabelProps={tickLabelProps}
            />
          </Group>
        </svg>
        <svg
          ref={svgRef}
          width={width}
          className="absolute  h-full z-50"
          style={{
            maxHeight: height,
           
          }}
        >
          <g id="brush-layer" transform={`translate(${margin.left}, ${margin.top})`}></g>
        </svg>
        {/* FIXME: This is expensive calculation */}
        {tooltipOpen &&
          tooltipData &&
          tooltipLeft != null &&
          tooltipTop != null && (
            <Tooltip
              left={tooltipLeft + margin.left}
              top={tooltipTop + margin.top}
              county={tooltipData.County_name}
              state={tooltipData.state}
              gap={twoSigFigFormatter(tooltipData[colorVariable])}
              worry={twoSigFigFormatter(tooltipData[yVariable])}
              rating={twoSigFigFormatter(tooltipData[xVariable])}
            />
          )}
      </>
    );
  }
);
