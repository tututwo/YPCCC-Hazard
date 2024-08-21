// @ts-nocheck
"use client";
import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import * as d3 from "d3";
import { Delaunay } from "d3-delaunay";
import { scaleThreshold } from "d3-scale";
import { regressionLinear } from "d3-regression";
import { pointToLineDistance } from "@turf/point-to-line-distance";
import { lineString, point } from "@turf/helpers";

// NOTE: VISX
import { Group } from "@visx/group";
import { Circle, Line } from "@visx/shape";
import { withTooltip, Tooltip } from "@visx/tooltip";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";
import { voronoi, VoronoiPolygon } from "@visx/voronoi";
import { localPoint } from "@visx/event";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
// Add these constants for your color scales
const redColors = ["#b91c1c", "#dc2626", "#ef4444", "#f87171", "#fca5a5"];
const grayColors = ["#374151", "#4b5563", "#6b7280", "#9ca3af", "lightgray"];
let tooltipTimeout: number;
function distanceFromPointToLine(pointCoord, linePoint1, linePoint2) {
  // Calculate the numerator of the distance formula

  const pt = point(pointCoord);
  const line = lineString([linePoint1, linePoint2]);

  const distance = pointToLineDistance(pt, line, { units: "miles" });
  // Return the distance
  return distance;
}
function distanceFromLine(x, y, x1, y1, x2, y2) {
  const numerator = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1);
  const denominator = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
  return numerator / denominator;
}
const x_variable = "L_cc_heatscore";
const y_variable = "R_heat_worry";
const scaleSizeOfCircles = 6;
const margin = { top: 20, right: 30, bottom: 30, left: 40 };

export default withTooltip<DotsProps, PointsRange>(
  ({
    data,
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
    const x = useMemo(
      () =>
        d3
          .scaleLinear()
          .domain(d3.extent(data, (d) => d[x_variable]) as [number, number])
          .range([0, width - margin.left - margin.right])
          .nice(),
      [data, width]
    );

    const y = useMemo(
      () =>
        d3
          .scaleLinear()
          .domain(d3.extent(data, (d) => d[y_variable]) as [number, number])
          .range([height - margin.top - margin.bottom, 0])
          .nice(),
      [data, height]
    );
    // Memoize the regression calculation
    const regressionDatum = useMemo(
      () =>
        regressionLinear()
          .x((d) => d[x_variable])
          .y((d) => d[y_variable])
          .domain([20, 100])(data),
      [data]
    );

    // Memoize color value calculations
    const dataWithColorValue = useMemo(() => {
      return data.map((d) => ({
        ...d,
        colorValue: distanceFromPointToLine(
          [x(d[x_variable]), y(d[y_variable])],
          regressionDatum[0].map(x),
          regressionDatum[1].map(y)
        ),
      }));
    }, [data, x, y, regressionDatum]);

    // Memoize max distance calculation
    const maxDistance = useMemo(() => {
      return d3.extent(dataWithColorValue, (d) => d.colorValue)[1];
    }, [dataWithColorValue]);

    // Memoize gray scale
    const grayScale = useMemo(() => {
      return scaleThreshold()
        .domain(
          d3
            .range(1, grayColors.length)
            .map((i) => (i / grayColors.length) * maxDistance)
        )
        .range(grayColors.reverse());
    }, [maxDistance]);

    // Memoize red scale
    const redScale = useMemo(() => {
      return scaleThreshold()
        .domain(
          d3
            .range(1, redColors.length)
            .map((i) => (i / redColors.length) * maxDistance)
        )
        .range(redColors.reverse());
    }, [maxDistance]);

    // Memoize colored data
    const coloredData = useMemo(() => {
      return dataWithColorValue.map((d) => {
        const isAbove = regressionDatum.predict(d[x_variable]) > d[y_variable];
        return {
          ...d,
          color: isAbove ? redScale(d.colorValue) : grayScale(d.colorValue),
        };
      });
    }, [dataWithColorValue, regressionDatum, redScale, grayScale]);

    useEffect(() => {
      if (!data || data.length === 0) return;

      const svg = d3.select(svgRef.current);

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // const brush = d3
      //   .brush()
      //   .extent([
      //     [0, 0],
      //     [width, height],
      //   ])
      //   .on("start brush end", brushed);

      // const brushGroup = g
      //   .append("g")
      //   .attr("class", "brush")
      //   .call(brush)
      //   .lower(); // Ensure brush is below other interactive elements

      // let storedSelection = null;

      // // Update brushed function
      // function brushed(event) {
      //   const selection = event.selection;
      //   const isBrushing = event.type === "brush";

      //   brushGroup
      //     .select(".selection")
      //     .style("fill", isBrushing ? null : "none");

      //   if (selection) {
      //     storedSelection = selection;
      //     updateCircles(selection);
      //   } else if (event.type === "end" && !selection) {
      //     updateCircles(null);
      //     storedSelection = null;
      //   }
      // }
    }, [data, width, height]);

    const voronoiLayout = useMemo(
      () =>
        voronoi<PointsRange>({
          x: (d) => x(d[x_variable]) ?? 0,
          y: (d) => y(d[y_variable]) ?? 0,
          width,
          height,
        })(data),
      [width, height, x, y]
    );
    const handleMouseMove = useCallback(
      (event: React.MouseEvent | React.TouchEvent) => {
        if (tooltipTimeout) clearTimeout(tooltipTimeout);
        if (!svgRef.current) return;

        // find the nearest polygon to the current mouse position
        const point = localPoint(svgRef.current, event);

        if (!point) return;
        const neighborRadius = 60;
        const closest = voronoiLayout.find(point.x, point.y, neighborRadius);
        if (closest) {
          showTooltip({
            tooltipLeft: x(closest.data[x_variable]),
            tooltipTop: y(closest.data[y_variable]),
            tooltipData: closest.data,
          });
        }
      },
      [showTooltip, voronoiLayout, x, y]
    );

    const handleMouseLeave = useCallback(() => {
      tooltipTimeout = window.setTimeout(() => {
        hideTooltip();
      }, 300);
    }, [hideTooltip]);
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;
    return (
      <>
        <svg
          ref={svgRef}
          width={width}
          style={{ maxHeight: height, height: "100%" }}
        >
          <rect
            width={width}
            height={height}
            rx={14}
            fill="white"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseLeave}
          />
          <Group pointerEvents="none" left={margin.left} top={margin.top}>
            <GridRows scale={y} width={xMax} height={yMax} stroke="#F3F3F3" />
            <GridColumns
              scale={x}
              width={xMax}
              height={yMax}
              stroke="#F3F3F3"
            />
            <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="#e0e0e0" />
            <Line
              from={{
                x: x(regressionDatum[0][0]),
                y: y(regressionDatum[0][1]),
              }}
              to={{ x: x(regressionDatum[1][0]), y: y(regressionDatum[1][1]) }}
              stroke="grey"
              strokeWidth={3}
              strokeDasharray="35,15"
            ></Line>
            <AxisBottom
              top={yMax}
              scale={x}
              numTicks={width > 520 ? 10 : 5}
              hideTicks
              hideZero
              hideAxisLine
            />
            <AxisLeft scale={y} hideTicks hideZero hideAxisLine />
            {coloredData.map((point, i) => (
              <Circle
                key={`point-${point[0]}-${i}`}
                className="dot"
                cx={x(point[x_variable])}
                cy={y(point[y_variable])}
                r={i % 3 === 0 ? 2 : 3}
                fill={point.color}
              />
            ))}
            {voronoiLayout.polygons().map((polygon, i) => (
              <VoronoiPolygon
                key={`polygon-${i}`}
                polygon={polygon}
                fill="white"
                stroke="red"
                strokeWidth={1}
                strokeOpacity={0.2}
                fillOpacity={tooltipData === polygon.data ? 0.5 : 0}
              />
            ))}
          </Group>
        </svg>
        {tooltipOpen &&
          tooltipData &&
          tooltipLeft != null &&
          tooltipTop != null && (
            <Tooltip left={tooltipLeft + 10} top={tooltipTop + 10}>
              <div>
                <strong>Rating:</strong> {tooltipData[x_variable]}
              </div>
              <div>
                <strong>Worry</strong> {tooltipData[y_variable]}
              </div>
            </Tooltip>
          )}
      </>
    );
  }
);
