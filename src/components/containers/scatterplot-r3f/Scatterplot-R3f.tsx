// @ts-nocheck
"use client";
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
attribute float instanceAnimationProgress;

varying float vAnimationProgress;
varying vec3 vColor;
varying vec3 vOriginalColor;
varying vec2 vUnitPosition;
varying float vOuterRadiusPixels;

uniform float radiusScale;
uniform float radiusMinPixels;
uniform float radiusMaxPixels;
uniform bool billboard;
uniform bool antialiasing;

const float SMOOTH_EDGE_RADIUS = .5;

void main() {
  // Compute the scaled and clamped radius
  float animatedRadius = instanceRadius * (1.0 + instanceAnimationProgress * 0.5);
  vOuterRadiusPixels = clamp(
    radiusScale * animatedRadius,
    radiusMinPixels,
    radiusMaxPixels
  );

  // Edge padding to accommodate smoothing
  float edgePadding = (vOuterRadiusPixels + SMOOTH_EDGE_RADIUS) / vOuterRadiusPixels;

  // Position within the unit square [-1, 1], scaled by edge padding
  vUnitPosition = edgePadding * position.xy;

  // Pass color and animation progress to fragment shader
  vOriginalColor = instanceColor;
  vColor = instanceColor;
  vAnimationProgress = instanceAnimationProgress;

  // Calculate offset
  vec3 offset = position * vOuterRadiusPixels * edgePadding;

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
varying float vAnimationProgress;

const float SMOOTH_EDGE_RADIUS = 0.5;

float smoothedge(float edge, float x) {
  return smoothstep(edge - SMOOTH_EDGE_RADIUS, edge + SMOOTH_EDGE_RADIUS, x);
}

void main() {
  // Adjusted distance calculation
  float dist = length(vUnitPosition) * vOuterRadiusPixels;

  // Define radii for inner circle and rings
  float innerRadius = vOuterRadiusPixels * 0.6;
  float middleRadius = vOuterRadiusPixels * 0.7;
  float outerRadius = vOuterRadiusPixels;

  // Increase size for selected circles
  float sizeMultiplier = mix(1.0, 1.1, vAnimationProgress);
  innerRadius *= sizeMultiplier;
  middleRadius *= sizeMultiplier;
  outerRadius *= sizeMultiplier;

  // Calculate smooth transitions using smoothedge
  float innerCircle = 1.0 - smoothedge(innerRadius, dist);
  float whiteRing = smoothedge(innerRadius, dist) - smoothedge(middleRadius, dist);
  float outerRing = smoothedge(middleRadius, dist) - smoothedge(outerRadius, dist);

  // Combine colors
  vec3 finalColor = vColor * (innerCircle + outerRing) + vec3(1.0) * whiteRing;

  // Apply per-instance animation progress
  vec3 color = mix(vOriginalColor, finalColor, vAnimationProgress);

  float alpha = innerCircle + whiteRing + outerRing;
 alpha = max(alpha, 0.01);

   float finalAlpha = mix(alpha * 0.8,alpha, vAnimationProgress);

  gl_FragColor = vec4(color, finalAlpha);
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
    isDataLoaded,
  } = useMapStore();
  const particlesToUpdateRef = useRef<Set<number>>(new Set());
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<ParticleMaterial>(null);
  const instanceAnimationProgressRef = useRef(new Float32Array(data.length));
  const targetSelectedRef = useRef(new Float32Array(data.length));

  const [positions, colors, radii] = useMemo(() => {
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
      // // Initialize animation progress and target selection
      instanceAnimationProgressRef.current[i] = 0;
      targetSelectedRef.current[i] = 0;
    }

    return [positions, colors, radii];
  }, [
    data,
    xScale,
    yScale,
    xVariable,
    yVariable,
    colorVariable,
    colorScale,

    // selectedCounties,
  ]);

  useEffect(() => {
    const selectedSet = new Set(selectedCounties);

    for (let i = 0; i < data.length; i++) {
      const isSelected = selectedSet.has(data[i].geoid) ? 1.0 : 0.0;
      if (targetSelectedRef.current[i] !== isSelected) {
        targetSelectedRef.current[i] = isSelected;
        particlesToUpdateRef.current.add(i);
      }
    }
  }, [selectedCounties, data]);
  useFrame((state, delta) => {
    if (particlesToUpdateRef.current.size === 0) {
      // No particles to update
      return;
    }

    let needsUpdate = false;
    const animationProgress = instanceAnimationProgressRef.current;
    const targetSelected = targetSelectedRef.current;
    const indicesToRemove: number[] = [];

    particlesToUpdateRef.current.forEach((i) => {
      const target = targetSelected[i];
      const current = animationProgress[i];

      if (current !== target) {
        needsUpdate = true;

        const deltaProgress = delta * 2.0; // Adjust speed as needed
        if (current < target) {
          animationProgress[i] = Math.min(current + deltaProgress, target);
        } else {
          animationProgress[i] = Math.max(current - deltaProgress, target);
        }
      } else {
        // Animation reached target, remove from set
        indicesToRemove.push(i);
      }
    });

    // Remove indices that no longer need updating
    indicesToRemove.forEach((i) => particlesToUpdateRef.current.delete(i));

    if (needsUpdate && meshRef.current) {
      meshRef.current.geometry.attributes.instanceAnimationProgress.needsUpdate =
        true;
    }
  });

  return (
    <>
      {!isDataLoaded || data.length === 0 ? null : (
        <instancedMesh
          ref={meshRef}
          args={[null, null, data.length]}
          renderOrder={2}
        >
          <planeGeometry args={[4, 4]} />
          <particleMaterial
            ref={materialRef}
            transparent
            depthTest={true}
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
            attach="geometry-attributes-instanceAnimationProgress"
            args={[instanceAnimationProgressRef.current, 1]}
          />
        </instancedMesh>
      )}
    </>
  );
};
