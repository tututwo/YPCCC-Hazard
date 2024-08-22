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
import { Brush } from "@visx/brush";
import { BrushHandleRenderProps } from "@visx/brush/lib/types";
import BaseBrush from "@visx/brush/lib/BaseBrush";
// Add these constants for your color scales
const redColors = ["#b91c1c", "#dc2626", "#ef4444", "#f87171", "#fca5a5"];
const grayColors = ["#374151", "#4b5563", "#6b7280", "#9ca3af", "lightgray"];
let tooltipTimeout: number;

function raise<T>(items: T[], raiseIndex: number) {
  const array = [...items];
  const lastIndex = array.length - 1;
  const [raiseItem] = array.splice(raiseIndex, 1);
  array.splice(lastIndex, 0, raiseItem);
  return array;
}

function distanceFromPointToLine(pointCoord, linePoint1, linePoint2) {
  // Calculate the numerator of the distance formula

  const pt = point(pointCoord);
  const line = lineString([linePoint1, linePoint2]);

  const distance = pointToLineDistance(pt, line, { units: "miles" });
  // Return the distance
  return distance;
}

const x_variable = "L_cc_heatscore";
const y_variable = "R_heat_worry";

const margin = { top: 0, right: 0, bottom: 0, left: 0 };

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

    const [isBrushing, setIsBrushing] = useState(false);

    const [brushedCircles, setBrushedCircles] = useState(new Set<string>());
    const [currentBrushSelection, setCurrentBrushSelection] = useState<
      Set<string>
    >(new Set());
    const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);

    const circleStyles = useMemo(() => {
      return (point: PointsRange) => {
        const isBrushed = brushedCircles.has(point.geoid);
        const isHovered = hoveredPointId === point.geoid;
        return {
          r: isBrushed ? 6 : isHovered ? 5 : 3,
          fill: point.color,
          stroke: isBrushed ? "black" : isHovered ? "black" : "none",
          strokeWidth: isBrushed ? 2 : isHovered ? 1 : 0,
        };
      };
    }, [brushedCircles, hoveredPointId]);
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
    // Memoize coloredAndRaisedData
    const coloredAndRaisedData = useMemo(() => {
      let result = coloredData;
      if (hoveredPointId) {
        const index = result.findIndex((d) => d.geoid === hoveredPointId);
        if (index !== -1) {
          result = raise(result, index);
        }
      }
      return result;
    }, [coloredData, hoveredPointId]);

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
        if (!svgRef.current) return;

        const point = localPoint(svgRef.current, event);

        if (!point) return;
        const neighborRadius = 100;
        const closest = voronoiLayout.find(point.x, point.y, neighborRadius);
        if (closest && !isBrushing) {
          setHoveredPointId(closest.data.geoid);
          showTooltip({
            tooltipLeft: x(closest.data[x_variable]),
            tooltipTop: y(closest.data[y_variable]),
            tooltipData: closest.data,
          });
        } else {
          setHoveredPointId(null);
          hideTooltip();
        }
      },
      [
        showTooltip,
        hideTooltip,
        voronoiLayout,
        x,
        y,
        isBrushing,
        x_variable,
        y_variable,
      ]
    );

    const handleMouseLeave = useCallback(() => {
      tooltipTimeout = window.setTimeout(() => {
        hideTooltip();
        // setHoveredPoint({ geoid: null });
      }, 300);
    }, [hideTooltip]);
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    // NOTE: Brushing
    const handleMouseDown = useCallback(
      (event: React.MouseEvent) => {
        setIsBrushing(true);
        hideTooltip();
      },
      [hideTooltip]
    );

    const handleMouseUp = useCallback(() => {
      setIsBrushing(false);

      console.log("Brushed circles after completion:", currentBrushSelection);
    }, [currentBrushSelection]);

    const handleBrushChange = (domain: Bounds | null) => {
      if (!domain) return;
      const { x0, x1, y0, y1 } = domain;
      const selectedPointsSet = new Set(
        data
          .filter(
            (point) =>
              point[x_variable] >= x0 &&
              point[x_variable] <= x1 &&
              point[y_variable] >= y0 &&
              point[y_variable] <= y1
          )
          .map((point) => point.geoid)
      );

      setCurrentBrushSelection(selectedPointsSet);
      setBrushedCircles(currentBrushSelection);
    };

    return (
      <>
        <svg
          ref={svgRef}
          width={width}
          style={{
            maxHeight: height,
            height: "100%",
            cursor: isBrushing ? "crosshair" : "default",
          }}
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
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          />
          <Group left={margin.left} top={margin.top}>
            <GridRows scale={y} width={xMax} height={yMax} stroke="#F3F3F3" />
            <GridColumns
              scale={x}
              width={xMax}
              height={yMax}
              stroke="#F3F3F3"
            />
            <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="#e0e0e0" />
            {/* <Line
              from={{
                x: x(regressionDatum[0][0]),
                y: y(regressionDatum[0][1]),
              }}
              to={{ x: x(regressionDatum[1][0]), y: y(regressionDatum[1][1]) }}
              stroke="grey"
              strokeWidth={3}
              strokeDasharray="35,15"
            ></Line> */}
            <AxisBottom
              top={yMax}
              scale={x}
              numTicks={width > 520 ? 10 : 5}
              hideTicks
              hideZero
              hideAxisLine
            />
            <AxisLeft scale={y} hideTicks hideZero hideAxisLine />
            {coloredAndRaisedData.map((point, i) => {
              const styles = circleStyles(point);
              return (
                <Circle
                  key={`point-${point.geoid}`}
                  className="dot"
                  cx={x(point[x_variable])}
                  cy={y(point[y_variable])}
                  r={styles.r}
                  fill={styles.fill}
                  stroke={styles.stroke}
                  strokeWidth={styles.strokeWidth}
                  style={{
                    transition: "all 0.3s ease-in-out",
                  }}
                />
              );
            })}
            {/* {voronoiLayout.polygons().map((polygon, i) => (
              <VoronoiPolygon
                key={`polygon-${i}`}
                polygon={polygon}
                fill="white"
                stroke="red"
                strokeWidth={1}
                strokeOpacity={0.2}
                fillOpacity={tooltipData === polygon.data ? 0.5 : 0}
              />
            ))} */}
            {isBrushing && (
              <Brush
                xScale={x}
                yScale={y}
                width={xMax}
                height={yMax}
                handleSize={8}
                resizeTriggerAreas={[
                  "left",
                  "right",
                  "top",
                  "bottom",
                  "center",
                ]}
                brushDirection="both"
                initialBrushPosition={null}
                onChange={handleBrushChange}
                onBrushEnd={handleMouseUp}
                useWindowMoveEvents
              />
            )}
          </Group>
        </svg>
        {tooltipOpen &&
          tooltipData &&
          tooltipLeft != null &&
          tooltipTop != null && (
            <Tooltip left={tooltipLeft + 10} top={tooltipTop - 50}>
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
