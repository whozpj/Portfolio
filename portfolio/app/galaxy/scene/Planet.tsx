"use client";

import { useRef } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  center: [number, number, number];
  orbitRadius: number;
  orbitSpeed: number;
  initialPhase: number;
  color: string;
  size?: number;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export default function Planet({
  center, orbitRadius, orbitSpeed, initialPhase, color, size = 0.5,
  onClick, onPointerOver, onPointerOut,
}: Props) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * orbitSpeed + initialPhase;
    ref.current.position.set(
      center[0] + Math.cos(t) * orbitRadius,
      center[1],
      center[2] + Math.sin(t) * orbitRadius,
    );
  });
  return (
    <mesh ref={ref} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <sphereGeometry args={[size, 24, 24]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.6} />
    </mesh>
  );
}
