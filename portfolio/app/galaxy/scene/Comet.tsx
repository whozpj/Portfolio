"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

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

export default function Comet({ center, a, b, orbitSpeed, initialPhase, color, label, sublabel, onClick }: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const tailRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * orbitSpeed + initialPhase;
    const x = center[0] + Math.cos(t) * a;
    const z = center[2] + Math.sin(t) * b;
    groupRef.current.position.set(x, center[1], z);
    tailRef.current.lookAt(center[0], center[1], center[2]);
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
