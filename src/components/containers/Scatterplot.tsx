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

import { OrbitControls, OrthographicCamera } from "@react-three/drei";
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

const margin = { top: 20, right: 40, bottom: 60, left: 60 };
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
    const brushRef = useRef<any>(null);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.bottom - margin.top;
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
          domain: [0, 105],
          // range: [-200, 200],
          range: [0, xMax],
          clamp: true,
        }),
      [data, width]
    );
    const y = useMemo(
      () =>
        scaleLinear<number>({
          domain: [10, 75],
          // range: [-100, 100],
          range: [yMax, 0],
          clamp: true,
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

      return result;
    }, [coloredData]);

    const { contextSafe } = useGSAP(
      // draw foreground canvas
      () => {},
      { dependencies: [coloredAndRaisedData, width, height] }
    );

    const quadtree = useMemo(() => {
      return d3
        .quadtree()
        .x((d) => d[xVariable])
        .y((d) => d[yVariable])
        .addAll(coloredAndRaisedData);
    }, [coloredAndRaisedData, xVariable, yVariable]);
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

    const handleBrushChange = contextSafe((domain: Bounds | null) => {
      if (!domain) return;

      const { x0, x1, y0, y1 } = domain;
      const selectedPointsSet = new Set<string>();

      quadtree.visit((node, x1_, y1_, x2_, y2_) => {
        // Skip this node if it doesn't intersect the brush area
        if (x2_ < x0 || x1_ > x1 || y2_ < y0 || y1_ > y1) {
          return true; // Don't visit child nodes
        }
    
        // If it's a leaf node, check its points
        if (!node.length) {
          let nodeData = node.data;
          do {
            const d = nodeData;
            const xVal = d[xVariable];
            const yVal = d[yVariable];
    
            if (xVal >= x0 && xVal <= x1 && yVal >= y0 && yVal <= y1) {
              selectedPointsSet.add(d.geoid);
            }
            nodeData = node.next;
          } while (nodeData);
        }
    
        // Continue traversing child nodes
        return false;
      });
      // Update state

      updateSelectedCounties(Array.from(selectedPointsSet));
    });

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
          dpr={window.devicePixelRatio}
          style={{
            background: "transparent",
            position: "absolute",
            width: xMax,
            height: yMax,
            top: margin.top,
            left: margin.left,
            zIndex: 10,
          }}
        >
          {/* <color attach="background" args={["black"]} /> */}
          <OrthographicCamera
            makeDefault
            zoom={1}
            top={innerHeight}
            bottom={0}
            left={0}
            right={innerWidth}
            near={-1000}
            far={1000}
            position={[xMax / 2, yMax / 2, 500]}
          />
          <OrbitControls
            makeDefault
            target={[xMax / 2, yMax / 2, 0]}
            enableRotate={true}
            enableZoom={true}
            enablePan={true}
          />
          <Particles
            data={data}
            xScale={x}
            yScale={y}
            xVariable={xVariable}
            yVariable={yVariable}
            colorVariable={colorVariable}
            margin={margin}
          />
          {/* <axesHelper args={[1000]} /> */}
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
              numTicks={width > 520 ? 5 : 5}
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
          <Group
            left={margin.left}
            top={margin.top}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <Brush
              ref={brushRef}
              xScale={x}
              yScale={y}
              width={xMax}
              height={yMax}
              handleSize={8}
              resizeTriggerAreas={["left", "right", "top", "bottom", "center"]}
              brushDirection="both"
              initialBrushPosition={null}
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
