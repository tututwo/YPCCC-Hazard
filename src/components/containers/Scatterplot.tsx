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
import { useMapContext } from "@/lib/context";
// NOTE: VISX
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { Circle, Line } from "@visx/shape";
import { withTooltip, Tooltip } from "@visx/tooltip";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";
import { voronoi, VoronoiPolygon } from "@visx/voronoi";
import { localPoint } from "@visx/event";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
import Brush from "./brush-components/Brush";
import { BrushHandleRenderProps } from "@visx/brush/lib/types";
import BaseBrush from "@visx/brush/lib/BaseBrush";

// Add these constants for your color scales
const redColors = ["#b91c1c", "#dc2626", "#ef4444", "#f87171", "#fca5a5"];
const grayColors = ["#12375A", "#4E6C8A", "#7590AB", "#A7BDD3", "#D2E4F6"];
let tooltipTimeout: number;

function raise<T>(items: T[], raiseIndex: number) {
  const array = [...items];
  const lastIndex = array.length - 1;
  const [raiseItem] = array.splice(raiseIndex, 1);
  array.splice(lastIndex, 0, raiseItem);
  return array;
}

const maxDistance = 1;
const margin = { top: 0, right: 60, bottom: 50, left: 50 };

export default withTooltip<DotsProps, PointsRange>(
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
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;
    const [isBrushing, setIsBrushing] = useState(false);

    const [brushedCircles, setBrushedCircles] = useState(new Set<string>());
    const [currentBrushSelection, setCurrentBrushSelection] = useState<
      Set<string>
    >(new Set());
    const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);

    const {
      selectedState,
      setSelectedState,
      colorScale,
      selectedCounties,
      updateSelectedCounties,
    } = useMapContext();

    const circleStyles = useMemo(() => {
      return (point: PointsRange) => {
        const isBrushed = selectedState.id === 0 && brushedCircles.has(point.geoid);
        const isSelected = selectedCounties.includes(point.geoid);
        const isHovered = hoveredPointId === point.geoid;
        return {
          r: isSelected ? 6 : isHovered ? 5 : 3,
          fill: point.color,
          stroke: isSelected ? "black" : isHovered ? "black" : "none",
          strokeWidth: isSelected ? 2 : isHovered ? 1 : 0,
          opacity: isBrushed || isSelected ? 1 : 0.5,
          transition: 'all 0.3s ease-in-out',
        };
      };
    }, [brushedCircles, hoveredPointId, selectedCounties, selectedState]);

    // NOTE: Scales
    const x = useMemo(
      () =>
        scaleLinear<number>({
          domain: d3.extent(data, (d) => d[xVariable]) as [number, number],
          range: [margin.left, width - margin.right],
          clamp: false,
        }),
      [data, width]
    );
    const y = useMemo(
      () =>
        scaleLinear<number>({
          domain: d3.extent(data, (d) => d[yVariable]) as [number, number],
          range: [height - margin.bottom, margin.top],
          clamp: false,
        }),
      [data, height]
    );

    // Use the colorScale in your coloredData calculation
    const coloredData = useMemo(() => {
      return data.map((d) => ({
        ...d,
        color: colorScale(d[colorVariable]),
      }));
    }, [data, colorScale, colorVariable]);
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
          x: (d) => x(d[xVariable]) ?? 0,
          y: (d) => y(d[yVariable]) ?? 0,
          width: width - margin.left,
          height: innerHeight,
        })(coloredAndRaisedData),
      [
        innerWidth,
        innerHeight,
        x,
        y,
        xVariable,
        yVariable,
        coloredAndRaisedData,
      ]
    );

    const handleMouseMove = useCallback(
      (event: React.MouseEvent | React.TouchEvent) => {
        if (!svgRef.current) return;

        const point = localPoint(svgRef.current, event);

        if (!point) return;
        const neighborRadius = 100;
        // Adjust the point coordinates to account for the margin
        const adjustedPoint = {
          x: point.x - margin.left,
          y: point.y - margin.top,
        };
        const closest = voronoiLayout.find(
          adjustedPoint.x,
          adjustedPoint.y,
          neighborRadius
        );

        if (closest && !isBrushing) {
          setHoveredPointId(closest.data.geoid);
          showTooltip({
            tooltipLeft: x(closest.data[xVariable]) + margin.left,
            tooltipTop: y(closest.data[yVariable]) + margin.top,
            tooltipData: closest.data,
          });
        } else {
          setHoveredPointId(null);
          hideTooltip();
        }
      },
      [
        voronoiLayout,
        isBrushing,
        x,
        y,
        xVariable,
        yVariable,
        showTooltip,
        hideTooltip,
      ]
    );

    const handleMouseLeave = useCallback(() => {
      tooltipTimeout = window.setTimeout(() => {
        hideTooltip();
      }, 300);
    }, [hideTooltip]);

    const handleMouseDown = useCallback(() => {
      setIsBrushing(true);
      hideTooltip();
      setSelectedState({ id: 0, name: "US" });
    }, [hideTooltip]);

    const handleMouseUp = useCallback(() => {
      setIsBrushing(false);
    }, [currentBrushSelection]); // Add dependencies here

    const handleBrushChange = (domain: Bounds | null) => {
      if (!domain) return;
      const { x0, x1, y0, y1 } = domain;
      const selectedPointsSet = new Set(
        data
          .filter(
            (point) =>
              point[xVariable] >= x0 &&
              point[xVariable] <= x1 &&
              point[yVariable] >= y0 &&
              point[yVariable] <= y1
          )
          .map((point) => point.geoid)
      );

      setCurrentBrushSelection(selectedPointsSet);
      setBrushedCircles(currentBrushSelection);
      updateSelectedCounties(Array.from(currentBrushSelection));
    };
    const selectedBoxStyle = useMemo(
      () => ({
        fill: "steelblue",
        fillOpacity: selectedState.id === 0 ? 0.2 : 0,
        stroke: "steelblue",
        strokeWidth: 1,
        strokeOpacity: selectedState.id === 0 ? 0.8 : 0,
      }),
      [selectedState]
    );
    return (
      <>
        <svg
          ref={svgRef}
          width={width}
          style={{
            maxHeight: height,
            height: "100%",
            cursor: isBrushing ? "crosshair" : "pointer",
          }}
        >
          <Group left={margin.left} top={margin.top}>
            <GridRows scale={y} width={xMax} height={yMax} stroke="#F3F3F3" />
            <GridColumns
              scale={x}
              width={xMax}
              height={yMax}
              stroke="#F3F3F3"
            />

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
                  cx={x(point[xVariable])}
                  cy={y(point[yVariable])}
                  r={styles.r}
                  fill={styles.fill}
                  stroke={styles.stroke}
                  strokeWidth={styles.strokeWidth}
                  opacity={styles.opacity}
                  style={{
                    transition: "all 0.3s ease-in-out",
                  }}
                />
              );
            })}

            <Brush
              xScale={x}
              yScale={y}
              width={width - margin.left}
              height={innerHeight}
              margin={margin}
              handleSize={8}
              resizeTriggerAreas={["left", "right", "top", "bottom", "center"]}
              brushDirection="both"
              initialBrushPosition={null}
              onChange={handleBrushChange}
              onBrushStart={handleMouseDown}
              onBrushEnd={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              useWindowMoveEvents
              onVoronoiMouseMove={handleMouseMove}
              selectedBoxStyle={selectedBoxStyle}
            />
          </Group>
        </svg>
        {tooltipOpen &&
          tooltipData &&
          tooltipLeft != null &&
          tooltipTop != null && (
            <Tooltip
              left={tooltipLeft + margin.left}
              top={tooltipTop + margin.top}
            >
              <div>
                <strong>Rating:</strong> {tooltipData[xVariable]}
              </div>
              <div>
                <strong>Worry</strong> {tooltipData[yVariable]}
              </div>
            </Tooltip>
          )}
      </>
    );
  }
);
