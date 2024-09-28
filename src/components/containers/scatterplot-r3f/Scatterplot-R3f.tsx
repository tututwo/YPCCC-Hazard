import { useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import * as d3 from "d3";
import { useMapStore } from "@/lib/store";
export const vertexShader = `
precision highp float;
attribute vec3 color;
varying vec3 vColor;
varying float vPointSize;

uniform float uTime;

void main() {
  float amp = 1.;
  float freq = 0.4;
  float time = uTime * 0.0008;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  gl_PointSize = 25.0;
  vPointSize = gl_PointSize;
  vColor = color;
}
  `;

// export const fragmentShader = `
// varying vec3 vColor;
// void main() {
//   // 点の中心からの距離を元に透明度を指定し、丸くする
//   // float alpha = 1. - smoothstep(0.4995, 0.5005, length(gl_PointCoord - vec2(0.5)));
//   // gl_FragColor = vec4(vColor, 1.0);
  
// }
//   `;

export const fragmentShader = `
varying vec3 vColor;

void main() {
  vec2 center = vec2(0.5);
  float dist = distance(gl_PointCoord, center);

  // Define radii
  float innerRadius = 0.3;
  float middleRadius = 0.35;
  float outerRadius = 0.5;

  // Create sharp transitions
  float innerRegion = step(dist, innerRadius);
  float middleRegion = step(innerRadius, dist) * step(dist, middleRadius);
  float outerRegion = step(middleRadius, dist) * step(dist, outerRadius);

  vec4 customColor = vec4(vColor, 1.0);
  vec4 whiteColor = vec4(1.0, 1.0, 1.0, 1.0);

  // Combine the regions
  vec4 color = customColor * innerRegion + whiteColor * middleRegion + customColor * outerRegion;

  // Discard fragments outside the outer radius
  if (dist > outerRadius) discard;

  gl_FragColor = color;
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

  const { positions, colors } = useMemo(() => {
    const dataLength = data.length;
    const positions = new Float32Array(dataLength * 3);
    const colors = new Float32Array(dataLength * 3);
    const x = xScale.copy().range([-200, 200]);
    const y = yScale.copy().range([-100, 100]);
    for (let i = 0; i < dataLength; i++) {
      const i3 = i * 3;
      positions[i3] = x(+data[i][xVariable]);
      positions[i3 + 1] = 0;
      positions[i3 + 2] = y(+data[i][yVariable]);

      const color = d3.rgb(colorScale(data[i][colorVariable]));

      colors[i3] = color.r / 255;
      colors[i3 + 1] = color.g / 255;
      colors[i3 + 2] = color.b / 255;
    }

    return { positions, colors };
  }, [data, xScale, yScale, xVariable, yVariable, colorVariable, colorScale]);

  //TODO: Scatterplot Positions

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    }),
    []
  );

  // useFrame(() => {
  //   shaderArgs.uniforms.uTime.value++;
  // }, []);

  return (
    <points rotation={[-Math.PI / 2, 0, 0]}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          itemSize={3}
          count={positions.length / 3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          itemSize={3}
          count={colors.length / 3}
        />
      </bufferGeometry>
      <shaderMaterial
        args={[shaderArgs]}
        transparent
        alphaTest={0.5}
        depthTest={false}
        depthWrite={false}
        // blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
