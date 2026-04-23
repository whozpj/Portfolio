"use client";

import { useRef } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

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

export default function Planet({
  center, orbitRadius, orbitSpeed, initialPhase, color, size = 0.5,
  label, sublabel,
  onClick, onPointerOver, onPointerOut,
}: Props) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * orbitSpeed + initialPhase;
    groupRef.current.position.set(
      center[0] + Math.cos(t) * orbitRadius,
      center[1],
      center[2] + Math.sin(t) * orbitRadius,
    );
  });

  return (
    <group ref={groupRef} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <mesh>
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.6} />
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
