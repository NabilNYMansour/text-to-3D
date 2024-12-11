"use client";

import { GradientTexture } from "@react-three/drei";

const GradientMaterial = ({ color, secondColor, colorOnly, metalness, roughness }: {
  color: string,
  secondColor: string,
  colorOnly: boolean,
  metalness: number,
  roughness: number
}) => {
  return colorOnly ?
    <meshBasicMaterial>
      <GradientTexture
        stops={[0, 1]}
        colors={[color, secondColor]}
      />
    </meshBasicMaterial> :
    <meshStandardMaterial metalness={metalness} roughness={roughness}>
      <GradientTexture
        stops={[0, 1]}
        colors={[color, secondColor]}
      />
    </meshStandardMaterial>
};

export default GradientMaterial;
