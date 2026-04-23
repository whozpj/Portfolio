"use client";

import { useRef } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { clamp01 } from "../lib/easing";

interface Props {
  center: [number, number, number];
  orbitRadius: number;
  orbitSpeed: number;
  initialPhase: number;
  color: string;
  size?: number;
  label?: string;
  sublabel?: string;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

// Pre-allocated — avoid per-frame GC
const _wp = new THREE.Vector3();

export default function Planet({
  center, orbitRadius, orbitSpeed, initialPhase, color, size = 0.5,
  label, sublabel,
  onClick, onPointerOver, onPointerOut,
}: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime * orbitSpeed + initialPhase;
    groupRef.current.position.set(
      center[0] + Math.cos(t) * orbitRadius,
      center[1],
      center[2] + Math.sin(t) * orbitRadius,
    );

    // Dim when far from camera; full brightness only when camera is close
    groupRef.current.getWorldPosition(_wp);
    const dist = camera.position.distanceTo(_wp);
    const bright = clamp01(1 - (dist - 14) / 28); // full at ≤14 units, dark at ≥42
    (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.04 + bright * 0.7;
  });

  return (
    <group ref={groupRef} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.04} roughness={0.6} />
      </mesh>
      {label && (
        <Html
          center
          distanceFactor={18}
          position={[0, size + 0.9, 0]}
          style={{ pointerEvents: "none", userSelect: "none", textAlign: "center", whiteSpace: "nowrap" }}
        >
          <div style={{ color, fontFamily: "ui-monospace, monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.9 }}>
            {label}
          </div>
          {sublabel && (
            <div style={{ color: "rgba(255,255,255,0.4)", fontFamily: "ui-monospace, monospace", fontSize: "9px", letterSpacing: "0.1em", marginTop: "2px" }}>
              {sublabel}
            </div>
          )}
        </Html>
      )}
    </group>
  );
}
