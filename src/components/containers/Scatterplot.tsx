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
      // if (hoveredPointId) {
      //   const index = result.findIndex((d) => d.geoid === hoveredPointId);
      //   if (index !== -1) {
      //     result = raise(result, index);
      //   }
      // }

      return result;
    }, [coloredData, hoveredPointId]);

    // const coloredAndRaisedData = useMemo(() => {
    //   return coloredData.map(d => ({
    //     ...d,
    //     isBrushed: selectedCounties.includes(d.geoid)
    //   }));
    // }, [coloredData, selectedCounties]);

    const { contextSafe } = useGSAP(
      // draw foreground canvas
      () => {
        const drawCanvas = () => {
          drawPoints(
            foregroundCanvasRef.current,
            coloredAndRaisedData,
            selectedCounties,
            xVariable,
            yVariable,
            colorVariable,
            x,
            y,
            colorScale
          );
        };
        gsap.ticker.add(drawCanvas);
        return () => {
          gsap.ticker.remove(drawCanvas);
        };
      },
      { dependencies: [coloredAndRaisedData, width, height] }
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
      coloredAndRaisedData.forEach((d) => {
        const isBrushed =
          d[xVariable] >= x0 &&
          d[xVariable] <= x1 &&
          d[yVariable] >= y0 &&
          d[yVariable] <= y1;
        d.isBrushed = isBrushed;
        if (isBrushed) {
          selectedPointsSet.add(d.geoid);
        }

        gsap.to(d, {
          radius: isBrushed ? 6 : 3,
          duration: 0.1,
          ease: "power2.inOut",
        });
      });
      setCurrentBrushSelection(selectedPointsSet);
      setBrushedCircles(currentBrushSelection);

      updateSelectedCounties(Array.from(currentBrushSelection));
    });
    const selectedBoxStyle = useMemo(
      () => ({
        fill: "#A7BDD3",
        fillOpacity: selectedState.id === 0 ? 0.08 : 0,
        stroke: "#12375A",
        strokeWidth: 1,
        strokeOpacity: selectedState.id === 0 ? 0.8 : 0,
      }),
      [selectedState]
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
            cursor: isBrushing ? "crosshair" : "pointer",
          }}
        >
          <Group left={margin.left} top={margin.top}>
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
