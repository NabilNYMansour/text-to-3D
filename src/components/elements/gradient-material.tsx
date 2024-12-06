"use client";

import { GradientTexture } from '@react-three/drei';

const GradientMaterial = ({ color, secondColor }: { color: string, secondColor: string }) => {
  return <meshBasicMaterial>
    <GradientTexture
      stops={[0, 1]}
      colors={[color, secondColor]}
      size={1024}
    />
  </meshBasicMaterial>
};

export default GradientMaterial;