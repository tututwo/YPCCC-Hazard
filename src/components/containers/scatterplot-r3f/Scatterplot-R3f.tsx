// @ts-nocheck
import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as d3 from "d3";
import { useMapStore } from "@/lib/store";
import { extend, Object3DNode } from "@react-three/fiber";
export const vertexShader = `
precision highp float;

attribute vec3 instancePosition;
attribute float instanceRadius;
attribute vec3 instanceColor;
// Add to your attribute declarations
attribute float instanceSelected;
varying float vSelected;

uniform float radiusScale;
uniform float radiusMinPixels;
uniform float radiusMaxPixels;
uniform bool billboard;
uniform float uAnimationProgress;

varying vec3 vColor;
varying vec3 vOriginalColor;
varying vec2 vUnitPosition;
varying float vOuterRadiusPixels;

void main() {
  // Compute the scaled and clamped radius
  float animatedRadius = instanceRadius * (1.0 + uAnimationProgress * 0.5); // Increase size by up to 50%
  vOuterRadiusPixels = clamp(
    radiusScale * animatedRadius,
    radiusMinPixels,
    radiusMaxPixels
  );

  // Position within the unit square [-1, 1]
  vUnitPosition = position.xy;

  // Pass color to fragment shader
  vOriginalColor = instanceColor;
  vColor = instanceColor;

    // Pass the selection status to the fragment shader
  vSelected = instanceSelected;

  // Calculate offset
  vec3 offset = position * vOuterRadiusPixels;

  vec4 mvPosition = modelViewMatrix * vec4(instancePosition, 1.0);

  if (billboard) {
    mvPosition.xy += offset.xy;
    gl_Position = projectionMatrix * mvPosition;
  } else {
    vec4 worldPosition = modelMatrix * vec4(instancePosition + offset, 1.0);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
}
`;

// fragmentShader.js
export const fragmentShader = `
precision highp float;

varying vec3 vColor;
varying vec3 vOriginalColor;
varying vec2 vUnitPosition;
varying float vOuterRadiusPixels;
// Use the varying variable
varying float vSelected;

uniform float uAnimationProgress;

void main() {
  // Calculate distance from center
  float dist = length(vUnitPosition) * vOuterRadiusPixels;

  // Define radii for inner circle and rings
  float innerRadius = vOuterRadiusPixels * 0.6;
  float middleRadius = vOuterRadiusPixels * 0.7;
  float outerRadius = vOuterRadiusPixels;

  // Edge smoothing factor
  float edgeWidth = fwidth(dist) * 1.5;

  // Calculate smooth transitions
  float innerCircle = 1.0 - smoothstep(innerRadius - edgeWidth, innerRadius + edgeWidth, dist);
  float whiteRing = smoothstep(innerRadius - edgeWidth, innerRadius + edgeWidth, dist) -
                    smoothstep(middleRadius - edgeWidth, middleRadius + edgeWidth, dist);
  float outerRing = smoothstep(middleRadius - edgeWidth, middleRadius + edgeWidth, dist) -
                    smoothstep(outerRadius - edgeWidth, outerRadius + edgeWidth, dist);

  // Combine colors
  vec3 finalColor = vColor * (innerCircle + outerRing) + vec3(1.0) * whiteRing;
 vec3 color = mix(vOriginalColor, finalColor, uAnimationProgress * vSelected);
  float alpha = innerCircle + whiteRing + outerRing;

  if (alpha < .01) discard;

  gl_FragColor = vec4(color, alpha * 0.77);
}
`;

const ParticleMaterial = shaderMaterial(
  {
    radiusScale: 2,
    radiusMinPixels: 0,
    radiusMaxPixels: 100,
    billboard: false,
    uAnimationProgress: 0,
  },
  vertexShader,
  fragmentShader
);

extend({ ParticleMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      particleMaterial: Object3DNode<ParticleMaterial, typeof ParticleMaterial>;
    }
  }
}

export const Particles = ({
  data,
  xScale,
  yScale,
  xVariable = "xValue",
  yVariable = "yValue",
  colorVariable = "gap",
  margin,
}) => {
  const {
    selectedState,
    setSelectedState,
    colorScale,
    selectedCounties,
    updateSelectedCounties,
  } = useMapStore();

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<ParticleMaterial>(null);
  const animationProgressRef = useRef(0);

  const [positions, colors, radii, selectedIndices] = useMemo(() => {
    const dataLength = data.length;
    // const x = xScale.copy().range([xScale.range()[0]-10, xScale.range()[1]+10]);
    // const y = yScale.copy().range([yScale.range()[1]+10, yScale.range()[0]-10]);
    const x = xScale
      .copy()
      // .domain([xScale.domain()[0] * 0.99, xScale.domain()[1] * 1.1])
      .range([xScale.range()[0], xScale.range()[1]]);
    const y = yScale
      .copy()
      .domain([yScale.domain()[1], yScale.domain()[0]])
      .range([yScale.range()[0], yScale.range()[1]]);
    const positions = new Float32Array(dataLength * 3);
    const colors = new Float32Array(dataLength * 3);
    const radii = new Float32Array(dataLength);
    const selectedIndices = new Float32Array(dataLength); // New array for selection

    const selectedSet = new Set(selectedCounties); // Convert to Set for efficient look-up

    for (let i = 0; i < dataLength; i++) {
      const i3 = i * 3;

      positions[i3] = x(+data[i][xVariable]);
      positions[i3 + 2] = 0;
      positions[i3 + 1] = y(+data[i][yVariable]);

      const color = new THREE.Color(colorScale(data[i][colorVariable]));
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      radii[i] = 3; // Adjust as needed
      // Set selectedIndices based on whether the point is selected
      selectedIndices[i] = selectedSet.has(data[i].geoid) ? 1.0 : 0.0;
    }

    return [positions, colors, radii, selectedIndices];
  }, [
    data,
    xScale,
    yScale,
    xVariable,
    yVariable,
    colorVariable,
    colorScale,
    selectedCounties,
  ]);
  // useEffect(() => {
  //   // Reset animation progress
  //   animationProgressRef.current = 0;
  // }, [selectedCounties]); // Re-run whenever selectedCounties changes

  useFrame((state, delta) => {
    if (materialRef.current) {
      if (animationProgressRef.current < 1.0) {
        animationProgressRef.current += delta * .09; // Adjust speed as needed
        if (animationProgressRef.current > 1.0) {
          animationProgressRef.current = 1.0;
        }
        materialRef.current.uAnimationProgress = animationProgressRef.current;
      }
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, data.length]}>
      <planeGeometry args={[2, 2]} />
      <particleMaterial
        ref={materialRef}
        transparent
        depthTest={false}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
      <instancedBufferAttribute
        attach="geometry-attributes-instancePosition"
        args={[positions, 3]}
      />
      <instancedBufferAttribute
        attach="geometry-attributes-instanceColor"
        args={[colors, 3]}
      />
      <instancedBufferAttribute
        attach="geometry-attributes-instanceRadius"
        args={[radii, 1]}
      />
      <instancedBufferAttribute
        attach="geometry-attributes-instanceSelected"
        args={[selectedIndices, 1]}
      />
    </instancedMesh>
  );
};
