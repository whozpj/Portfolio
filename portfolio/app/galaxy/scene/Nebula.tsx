"use client";

import * as THREE from "three";

interface Props {
  position: [number, number, number];
  color: string;
  scale?: number;
  opacity?: number;
}

export default function Nebula({ position, color, scale = 40, opacity = 0.35 }: Props) {
  return (
    <sprite position={position} scale={[scale, scale, 1]}>
      <spriteMaterial
        color={new THREE.Color(color)}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
}
