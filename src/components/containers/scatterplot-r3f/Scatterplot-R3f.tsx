import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Instance, Instances } from "@react-three/drei";
import * as d3 from "d3";
import { useMapStore } from "@/lib/store";
// vertexShader.js

export const vertexShader = `
precision highp float;

attribute vec3 instancePosition;
attribute float instanceRadius;
attribute vec3 instanceColor;

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
  vec3 color = mix(vOriginalColor, finalColor, uAnimationProgress);
  float alpha = innerCircle + whiteRing + outerRing;

  if (alpha < .01) discard;

  gl_FragColor = vec4(color, alpha * 0.77);
}
`;

export const Particles = ({
  data,
  xScale,
  yScale,
  xVariable = "xValue",
  yVariable = "yValue",
  colorVariable = "gap",
}) => {
  const {
    selectedState,
    setSelectedState,
    colorScale,
    selectedCounties,
    updateSelectedCounties,
  } = useMapStore();
  const meshRef = useRef();
  const { scene } = useThree();
  const animationProgressRef = useRef(0);
  useEffect(() => {
    animationProgressRef.current = 0;
    const dataLength = data.length;
    const x = xScale.copy().range([-200, 200]);
    const y = yScale.copy().range([-100, 100]);
    // Create a plane geometry (square) for instancing
    const baseGeometry = new THREE.PlaneGeometry(2, 2);
    const instancedGeometry = new THREE.InstancedBufferGeometry();

    // Copy attributes from base geometry
    instancedGeometry.index = baseGeometry.index;
    instancedGeometry.attributes.position = baseGeometry.attributes.position;

    // Create instanced attributes
    const instancePositions = new Float32Array(dataLength * 3);
    const instanceColors = new Float32Array(dataLength * 3);
    const instanceRadii = new Float32Array(dataLength);

    for (let i = 0; i < dataLength; i++) {
      const i3 = i * 3;

      // Set instance positions
      instancePositions[i3] = x(+data[i][xVariable]);
      instancePositions[i3 + 2] = 0; // Assuming Y-up coordinate system
      instancePositions[i3 + 1] = y(+data[i][yVariable]);

      // Set instance colors
      const color = new THREE.Color(colorScale(data[i][colorVariable]));
      instanceColors[i3] = color.r;
      instanceColors[i3 + 1] = color.g;
      instanceColors[i3 + 2] = color.b;

      // Set instance radii
      instanceRadii[i] = 3; // Adjust as needed
    }

    // Assign instanced attributes to the geometry
    instancedGeometry.setAttribute(
      "instancePosition",
      new THREE.InstancedBufferAttribute(instancePositions, 3)
    );
    instancedGeometry.setAttribute(
      "instanceColor",
      new THREE.InstancedBufferAttribute(instanceColors, 3)
    );
    instancedGeometry.setAttribute(
      "instanceRadius",
      new THREE.InstancedBufferAttribute(instanceRadii, 1)
    );

    // Define uniforms
    const uniforms = {
      radiusScale: { value: 1 },
      radiusMinPixels: { value: 0 },
      radiusMaxPixels: { value: 100 },
      billboard: { value: false },
      uAnimationProgress: { value: 0 },
    };

    // Create shader material
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      // blending: THREE.SubtractiveBlending,
    });

    // Create instanced mesh
    const mesh = new THREE.Mesh(instancedGeometry, material);
    mesh.rotation.x = 0; // Adjust rotation if needed

    // Add mesh to the scene
    scene.add(mesh);
    meshRef.current = mesh;
    // Clean up when the component unmounts
    return () => {
      scene.remove(mesh);
      instancedGeometry.dispose();
      material.dispose();
    };
  }, [
    data,
    xScale,
    yScale,
    xVariable,
    yVariable,
    colorVariable,
    colorScale,
    scene,
  ]);
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Increment the time
      animationProgressRef.current += delta * 0.5; // Adjust speed by changing this multiplier
  
      // Calculate the undulating value between 0 and 1
      const undulatingValue = (Math.sin(animationProgressRef.current) + 1) * 0.5;
  
      // Update uniform
      meshRef.current.material.uniforms.uAnimationProgress.value = undulatingValue;
    }
  });
  // No need to render anything directly
  return null;
};
