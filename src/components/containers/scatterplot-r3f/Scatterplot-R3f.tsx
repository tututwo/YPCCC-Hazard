import { useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import * as d3 from "d3";
import { useMapStore } from "@/lib/store";
export const vertexShader = `
precision highp float;
attribute vec3 color;
varying vec3 vColor;



uniform float uTime;

void main() {
  float amp = 1.;
  float freq = 0.4;
  float time = uTime * 0.0008;

 
 gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  gl_PointSize =  7.0;
    vColor = color;
}
  `;

export const fragmentShader = `
varying vec3 vColor;
void main() {
  // 点の中心からの距離を元に透明度を指定し、丸くする
  float alpha = 1. - smoothstep(0.4995, 0.5005, length(gl_PointCoord - vec2(0.5)));

  gl_FragColor = vec4(vColor, alpha);
  
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

    for (let i = 0; i < dataLength; i++) {
      const i3 = i * 3;
      positions[i3] = xScale(+data[i][xVariable]);
      positions[i3 + 1] = 0;
      positions[i3 + 2] = yScale(+data[i][yVariable]);

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
        depthTest={false}
        depthWrite={false}
        // blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
