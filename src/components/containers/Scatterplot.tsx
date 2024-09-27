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

// NOTE: R3F
import { Canvas } from "@react-three/fiber";

import { OrbitControls } from "@react-three/drei";
import { Particles } from "./scatterplot-r3f/Scatterplot-R3f";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const tickLabelProps = {
  fill: "#222",
  fontFamily: "Roboto",
  fontSize: 14,
  textAnchor: "middle",
  fillOpacity: 0.5,
};
let tooltipTimeout: number;
const twoSigFigFormatter = d3.format(".2r");

const margin = { top: 10, right: 80, bottom: 60, left: 60 };
gsap.registerPlugin(useGSAP);
// function drawPoints(
//   canvas,
//   dataset,
//   selectedCounties,
//   xVariable,
//   yVariable,
//   colorVariable,
//   xScale,
//   yScale,
//   colorScale
// ) {
//   const ctx = canvas.getContext("2d");

//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   dataset.forEach((d) => {
//     const isHighlighted = d.isBrushed || selectedCounties.includes(d.geoid);

//     // NOTE: Larger circle
//     if (isHighlighted) {
//       ctx.beginPath();
//       // circle merge?
//       ctx.arc(
//         xScale(d[xVariable]),
//         yScale(d[yVariable]),
//         d.radius * 1.4,
//         0,
//         2 * Math.PI
//       );
//       ctx.fillStyle = "white";
//       ctx.fill();
//       ctx.strokeStyle = colorScale(d[colorVariable]);
//       ctx.lineWidth = 2;
//       ctx.stroke();
//     }
//     // NOTE: Smaller circle

//     // ctx.globalCompositeOperation = "screen";
//     ctx.globalAlpha = isHighlighted ? 1 : 0.8;
//     ctx.beginPath();
//     ctx.arc(
//       xScale(d[xVariable]),
//       yScale(d[yVariable]),
//       d.radius,
//       0,
//       2 * Math.PI
//     );
//     ctx.fillStyle = colorScale(d[colorVariable]);
//     ctx.fill();
//     // FIXME: This produce a merging effect
//     // ctx.fillStyle = "white";
//     // ctx.fill();
//     // ctx.strokeStyle = "black";
//     // ctx.lineWidth = 2;
//     // ctx.stroke();
//   });
// }
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
    const brushRef = useRef<any>(null);
    const foregroundCanvasRef = useRef(null);
    const backgroundCanvasRef = useRef(null);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xMax = width - margin.left;
    const yMax = height - margin.bottom;
    const [isBrushing, setIsBrushing] = useState(false);

    // FIXME: This is really slow. Improve it
    const [hoveredPoint, setHoveredPoint] = useState(null);
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
          range: [-200, 200],
          clamp: false,
        }),
      [data, width]
    );
    const y = useMemo(
      () =>
        scaleLinear<number>({
          domain: d3.extent(data, (d) => d[yVariable]) as [number, number],
          range: [-100, 100],
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
    }, [coloredData]);

    const { contextSafe } = useGSAP(
      // draw foreground canvas
      () => {
        // const drawCanvas = () => {
        //   drawPoints(
        //     foregroundCanvasRef.current,
        //     coloredAndRaisedData,
        //     selectedCounties,
        //     xVariable,
        //     yVariable,
        //     colorVariable,
        //     x,
        //     y,
        //     colorScale
        //   );
        // };
        // gsap.ticker.add(drawCanvas);
        // return () => {
        //   gsap.ticker.remove(drawCanvas);
        // };
      },
      { dependencies: [coloredAndRaisedData, width, height] }
    );

    // // // // // // // // // // // // // // // // // //
    // // // // // // // // Tooltip // // // // // // // //
    // // // // // // // // // // // // // // // // // //
    const delaunay = useMemo(() => {
      return Delaunay.from(
        coloredAndRaisedData,
        (d) => x(d[xVariable]),
        (d) => y(d[yVariable])
      );
    }, [coloredAndRaisedData, x, y, xVariable, yVariable]);

    const voronoi = useMemo(() => {
      return delaunay.voronoi([0, 0, width, height]);
    }, [delaunay, width, height]);

    const handleMouseMove = useCallback(
      (event) => {
        const point = localPoint(event);

        if (point) {
          const { x, y } = point;
          const index = delaunay.find(x - margin.left, y - margin.top);

          if (index !== undefined && index !== -1) {
            const datum = coloredAndRaisedData[index];
            setHoveredPoint(datum);

            // Optionally, show the tooltip
            showTooltip({
              tooltipLeft: x,
              tooltipTop: y,
              tooltipData: datum,
            });
          } else {
            setHoveredPoint(null);
            hideTooltip();
          }
        }
      },
      [delaunay, coloredAndRaisedData, showTooltip, hideTooltip, margin]
    );

    const handleMouseLeave = useCallback(() => {
      setHoveredPoint(null);
      hideTooltip();
    }, [hideTooltip]);

    const handleMouseDown = useCallback(() => {
      // setIsBrushing(true);
      hideTooltip();
    }, [hideTooltip]);

    const handleMouseUp = useCallback(() => {
      // setIsBrushing(false);
    }, []); // Add dependencies here

    const radiusQuickSetters = useMemo(() => {
      return coloredAndRaisedData.map((d) => ({
        geoid: d.geoid,
        setRadius: gsap.quickTo(d, "radius", {
          duration: 0.1,
          ease: "power2.inOut",
        }),
      }));
    }, [coloredAndRaisedData]);

    const handleBrushChange = contextSafe((domain: Bounds | null) => {
      if (!domain) return;

      const { x0, x1, y0, y1 } = domain;
      const selectedPointsSet = new Set<string>();

      coloredAndRaisedData.forEach((d) => {
        const isBrushed =
          d[xVariable] >= x0 &&
          d[xVariable] <= x1 &&
          d[yVariable] >= y0 &&
          d[yVariable] <= y1;

        d.isBrushed = isBrushed;

        // Find the quickSetter for this data point
        const quickSetter = radiusQuickSetters.find((s) => s.geoid === d.geoid);
        // Use quickTo for both entrance and exit animations
        if (quickSetter) {
          quickSetter.setRadius(isBrushed ? 6 : 3);
        }

        if (isBrushed) {
          selectedPointsSet.add(d.geoid);
        }
        // if (isBrushed) {
        //   selectedPointsSet.add(d.geoid);
        //   // Use quickTo to set radius to 6 for brushed items
        //   if (quickSetter) {
        //     quickSetter.setRadius(6);
        //   }
        // } else {
        //   // If the item was previously brushed and is now unbrushed, trigger exit animation
        //   if (wasBrushed) {
        //     // Start GSAP tween from current radius to 3
        //     gsap.to(d, {
        //       radius: 3,
        //       duration: 0.5,
        //       ease: "power2.inOut",
        //     });
        //   } else {
        //     // For unbrushed items that were not previously brushed, ensure radius is 3
        //     if (d.radius !== 3 && quickSetter) {
        //       quickSetter.setRadius(3);
        //     }
        //   }
        // }
      });

      // Update state

      updateSelectedCounties(Array.from(selectedPointsSet));
    });

    const handleCanvasClick = useCallback(() => {
      // Reset the brushed state
      coloredAndRaisedData.forEach((d) => {
        d.isBrushed = false;
        d.radius = 3; // Reset radius to initial value
      });

      // Kill all GSAP animations related to data points
      gsap.killTweensOf(coloredAndRaisedData);

      // Update state to reflect no selection

      setBrushedCircles(new Set());
      updateSelectedCounties([]);

      // Redraw the canvas
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
    }, [
      coloredAndRaisedData,
      selectedCounties,
      xVariable,
      yVariable,
      colorVariable,
      x,
      y,
      colorScale,

      updateSelectedCounties,
      foregroundCanvasRef,
    ]);

    const selectedBoxStyle = useMemo(
      () => ({
        fill: "#A7BDD3",
        // fillOpacity: selectedState.id === 0 ? 0.08 : 0,
        fillOpacity: 0.08,
        stroke: "#12375A",
        strokeWidth: 1,
        // strokeOpacity: selectedState.id === 0 ? 0.8 : 0,
        strokeOpacity: 0.8,
      }),
      [selectedState]
    );
    return (
      <>
        <Canvas
          camera={{
            fov: 45,
            near: 0.1,
            far: 500,
            position: [0, 0, 220],
          }}
          style={{ background: "transparent", position: "absolute" }}
        >
          {/* <color attach="background" args={["black"]} /> */}
          <OrbitControls makeDefault />
          <Particles
            data={data}
            xScale={x}
            yScale={y}
            xVariable={xVariable}
            yVariable={yVariable}
            colorVariable={colorVariable}
          />
          <axesHelper args={[100]} />
          {/* <EffectComposer>
            <Bloom
              luminanceThreshold={0.1}
              intensity={0.1}
              levels={9}
              mipmapBlur
            />
          </EffectComposer> */}
        </Canvas>
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
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Group left={margin.left} top={margin.top}>
            <Brush
              ref={brushRef}
              xScale={x}
              yScale={y}
              width={width - margin.left}
              height={innerHeight}
              margin={margin}
              handleSize={8}
              resizeTriggerAreas={["left", "right", "top", "bottom", "center"]}
              brushDirection="both"
              initialBrushPosition={null}
              onClick={handleCanvasClick}
              onChange={handleBrushChange}
              onBrushStart={handleMouseDown}
              onBrushEnd={handleMouseUp}
              useWindowMoveEvents
              selectedBoxStyle={selectedBoxStyle}
            />
            {hoveredPoint && (
              <circle
                cx={x(hoveredPoint[xVariable])}
                cy={y(hoveredPoint[yVariable])}
                r={hoveredPoint.radius * 1.4}
                fill="white"
                stroke={colorScale(hoveredPoint[colorVariable])}
                strokeWidth={2}
              />
            )}
          </Group>
        </svg>
        {/* FIXME: This is expensive calculation */}
        {tooltipOpen &&
          tooltipData &&
          tooltipLeft != null &&
          tooltipTop != null && (
            <Tooltip
              left={tooltipLeft}
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
