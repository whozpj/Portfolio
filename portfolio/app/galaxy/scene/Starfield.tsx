"use client";

import * as THREE from "three";

const STAR_COUNT = 4000;
const STAR_RADIUS = 500;

// Generated once at module load — static star positions
const starPositions = (() => {
  const pos = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = STAR_RADIUS * Math.cbrt(Math.random());
    pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi) - 120;
  }
  return pos;
})();

const starSizes = (() => {
  const sz = new Float32Array(STAR_COUNT);
  for (let i = 0; i < STAR_COUNT; i++) {
    sz[i] = Math.random() * 1.5 + 0.3;
  }
  return sz;
})();

export default function Starfield() {
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        <bufferAttribute attach="attributes-size" args={[starSizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={1.2}
        sizeAttenuation
        color={new THREE.Color("#ffffff")}
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}
