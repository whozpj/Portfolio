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

const _wp = new THREE.Vector3();

export default function Planet({
  center, orbitRadius, orbitSpeed, initialPhase, color, size = 0.5,
  label, sublabel,
  onClick, onPointerOver, onPointerOut,
}: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const labelRef = useRef<HTMLDivElement>(null);

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime * orbitSpeed + initialPhase;
    groupRef.current.position.set(
      center[0] + Math.cos(t) * orbitRadius,
      center[1],
      center[2] + Math.sin(t) * orbitRadius,
    );

    groupRef.current.getWorldPosition(_wp);
    const dist = camera.position.distanceTo(_wp);

    // Planet glow: dark when far, full when close
    const bright = clamp01(1 - (dist - 10) / 22);
    (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.03 + bright * 0.72;

    // Label: only visible when camera is close enough
    if (labelRef.current) {
      const labelAlpha = clamp01(1 - (dist - 10) / 12); // fade in below 22 units
      labelRef.current.style.opacity = String(labelAlpha);
    }
  });

  return (
    <group ref={groupRef} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.03} roughness={0.6} />
      </mesh>
      {label && (
        <Html
          center
          distanceFactor={18}
          position={[0, size + 1.1, 0]}
          style={{ pointerEvents: "none", userSelect: "none", textAlign: "center", whiteSpace: "nowrap" }}
        >
          <div ref={labelRef} style={{ opacity: 0 }}>
            <div style={{
              color,
              fontFamily: "ui-monospace, monospace",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textShadow: "0 1px 6px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.7)",
            }}>
              {label}
            </div>
            {sublabel && (
              <div style={{
                color: "rgba(255,255,255,0.65)",
                fontFamily: "ui-monospace, monospace",
                fontSize: "10px",
                letterSpacing: "0.12em",
                marginTop: "3px",
                textShadow: "0 1px 4px rgba(0,0,0,0.9)",
              }}>
                {sublabel}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
