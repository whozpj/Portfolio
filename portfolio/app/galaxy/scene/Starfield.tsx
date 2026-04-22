"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface Props {
  count?: number;
  radius?: number;
}

export default function Starfield({ count = 4000, radius = 500 }: Props) {
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * Math.cbrt(Math.random());
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) - 120;
      sz[i] = Math.random() * 1.5 + 0.3;
    }
    return { positions: pos, sizes: sz };
  }, [count, radius]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
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
