"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { clamp01 } from "../lib/easing";

interface Props {
  center: [number, number, number];
  a: number;
  b: number;
  orbitSpeed: number;
  initialPhase: number;
  color: string;
  label?: string;
  sublabel?: string;
  onClick?: () => void;
}

const _wp = new THREE.Vector3();

export default function Comet({ center, a, b, orbitSpeed, initialPhase, color, label, sublabel, onClick }: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const tailRef = useRef<THREE.Mesh>(null!);
  const labelRef = useRef<HTMLDivElement>(null);

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime * orbitSpeed + initialPhase;
    const x = center[0] + Math.cos(t) * a;
    const z = center[2] + Math.sin(t) * b;
    groupRef.current.position.set(x, center[1], z);
    tailRef.current.lookAt(center[0], center[1], center[2]);

    // Label visibility
    if (labelRef.current) {
      groupRef.current.getWorldPosition(_wp);
      const dist = camera.position.distanceTo(_wp);
      const labelAlpha = clamp01(1 - (dist - 10) / 12);
      labelRef.current.style.opacity = String(labelAlpha);
    }
  });

  return (
    <group ref={groupRef} onClick={onClick}>
      <mesh>
        <sphereGeometry args={[0.55, 20, 20]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={tailRef}>
        <coneGeometry args={[0.6, 4, 16, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {label && (
        <Html
          center
          distanceFactor={18}
          position={[0, 1.6, 0]}
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
