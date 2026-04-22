"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  center: [number, number, number];
  a: number;
  b: number;
  orbitSpeed: number;
  initialPhase: number;
  color: string;
  onClick?: () => void;
}

export default function Comet({ center, a, b, orbitSpeed, initialPhase, color, onClick }: Props) {
  const bodyRef = useRef<THREE.Mesh>(null!);
  const tailRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * orbitSpeed + initialPhase;
    const x = center[0] + Math.cos(t) * a;
    const z = center[2] + Math.sin(t) * b;
    bodyRef.current.position.set(x, center[1], z);
    tailRef.current.position.set(x, center[1], z);
    tailRef.current.lookAt(center[0], center[1], center[2]);
  });
  return (
    <group onClick={onClick}>
      <mesh ref={bodyRef}>
        <sphereGeometry args={[0.55, 20, 20]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={tailRef}>
        <coneGeometry args={[0.6, 4, 16, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}
