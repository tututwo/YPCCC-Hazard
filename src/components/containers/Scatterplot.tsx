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
import { scaleThreshold } from "d3-scale";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
// import { useMapContext } from "@/lib/context";
import { useMapStore } from "@/lib/store";
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

function drawPoints(
  canvas,
  dataset,
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
    // ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(
      xScale(d[xVariable]),
      yScale(d[yVariable]),
      d.radius ?? 3,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = colorScale(d[colorVariable]);
    ctx.fill();
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
    const canvasRef = useRef(null);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;
    const [isBrushing, setIsBrushing] = useState(false);

    const [brushedCircles, setBrushedCircles] = useState(new Set<string>());
    const [currentBrushSelection, setCurrentBrushSelection] = useState<
      Set<string>
    >(new Set());
    // FIXME: This is really slow. Improve it
    const [hoveredPointId, setHoveredPointId] = useState(false);
    const {
      selectedState,
      setSelectedState,
      colorScale,
      selectedCounties,
      updateSelectedCounties,
    } = useMapStore();

    // FIXME: This is really slow. Improve it
    // const circleStyles = useMemo(() => {
    //   return (point: PointsRange) => {
    //     const isBrushed =
    //       selectedState.id === 0 && brushedCircles.has(point.geoid);
    //     const isSelected = selectedCounties.includes(point.geoid);
    //     const isHovered = false;
    //     return {
    //       r: isSelected ? 6 : isHovered ? 5 : 3,
    //       fill: point.color,
    //       stroke: isSelected ? "black" : isHovered ? "black" : "none",
    //       strokeWidth: isSelected ? 2 : isHovered ? 1 : 0,
    //       opacity: isBrushed || isSelected ? 1 : 0.5,
    //     };
    //   };
    // }, [brushedCircles, hoveredPointId, selectedCounties, selectedState]);

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

    const { contextSafe } = useGSAP(
      () => {
        console.log("rendered");
        gsap.ticker.add(() =>
          drawPoints(
            canvasRef.current,
            coloredAndRaisedData,
            xVariable,
            yVariable,
            colorVariable,
            x,
            y,
            colorScale
          )
        );
      },
      { dependencies: [coloredAndRaisedData] }
    );
    // // // // // // // // // // // // // // // // // //
    // // // // // // // // Tooltip // // // // // // // //
    // // // // // // // // // // // // // // // // // //
    const voronoiLayout = useMemo(() => {
      return voronoi<PointsRange>({
        x: (d) => x(d[xVariable]) ?? 0,
        y: (d) => y(d[yVariable]) ?? 0,
        width: width - margin.left,
        height: innerHeight,
      })(coloredAndRaisedData);
    }, [
      innerWidth,
      innerHeight,
      x,
      y,
      xVariable,
      yVariable,
      coloredAndRaisedData,
    ]);

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
          // setHoveredPointId(closest.data.geoid);
          showTooltip({
            tooltipLeft: x(closest.data[xVariable]) + margin.left,
            tooltipTop: y(closest.data[yVariable]) + margin.top,
            tooltipData: closest.data,
          });
        } else {
          // setHoveredPointId(null);
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

    const handleBrushChange = contextSafe((domain: Bounds | null) => {
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
      // animation
      coloredAndRaisedData.forEach(d => {
        const isBrushed =
          d[xVariable] >= x0 &&
          d[xVariable] <= x1 &&
          d[yVariable] >= y0 &&
          d[yVariable] <= y1;
    
        if (isBrushed) {
          selectedPointsSet.add(d.geoid);
        }
    
        gsap.to(d, {
          radius: isBrushed ? 6 : 3,
          duration: 0.1,
          ease: "power2.inOut"
        });
      });
      setCurrentBrushSelection(selectedPointsSet);
      setBrushedCircles(currentBrushSelection);
      updateSelectedCounties(Array.from(currentBrushSelection));
    });
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
        <canvas
          ref={canvasRef}
          width={innerWidth}
          height={innerHeight}
          className="absolute z-0"
          style={{ top: margin.top + "px", left: margin.left + "px" }}
        ></canvas>
        <svg
          ref={svgRef}
          width={width}
          className="absolute z-10 h-full"
          style={{
            maxHeight: height,
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
        {/* FIXME: This is expensive calculation */}
        {/* {tooltipOpen &&
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
          )} */}
      </>
    );
  }
);
