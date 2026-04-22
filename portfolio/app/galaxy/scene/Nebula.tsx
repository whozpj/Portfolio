"use client";

import * as THREE from "three";

// Radial gradient texture so sprites fade out at edges instead of hard-cutoff rectangles
const makeNebulaTexture = (): THREE.CanvasTexture => {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,0.8)");
  grad.addColorStop(0.4, "rgba(255,255,255,0.3)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
};

// Generated once — shared across all nebula instances
let sharedTexture: THREE.CanvasTexture | null = null;
const getTexture = (): THREE.CanvasTexture => {
  if (!sharedTexture) sharedTexture = makeNebulaTexture();
  return sharedTexture;
};

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
        map={getTexture()}
        color={new THREE.Color(color)}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
}
