"use client";

import { useRef } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { clamp01 } from "../lib/easing";

export type PlanetShape = "sphere" | "octahedron" | "icosahedron";

interface Props {
  center: [number, number, number];
  orbitRadius: number;
  orbitSpeed: number;
  initialPhase: number;
  color: string;
  size?: number;
  shape?: PlanetShape;
  label?: string;
  sublabel?: string;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

const _wp = new THREE.Vector3();

export default function Planet({
  center, orbitRadius, orbitSpeed, initialPhase, color, size = 0.5,
  shape = "sphere", label, sublabel,
  onClick, onPointerOver, onPointerOut,
}: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const innerRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const labelRef = useRef<HTMLDivElement>(null);

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime * orbitSpeed + initialPhase;
    groupRef.current.position.set(
      center[0] + Math.cos(t) * orbitRadius,
      center[1],
      center[2] + Math.sin(t) * orbitRadius,
    );

    // Self-rotation for shaped bodies
    if (shape === "octahedron") {
      innerRef.current.rotation.y += 0.007;
      innerRef.current.rotation.z += 0.003;
    } else if (shape === "icosahedron") {
      innerRef.current.rotation.y -= 0.005;
      innerRef.current.rotation.x += 0.003;
    }

    // Distance-based brightness
    groupRef.current.getWorldPosition(_wp);
    const dist = camera.position.distanceTo(_wp);
    const bright = clamp01(1 - (dist - 10) / 22);
    (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.03 + bright * 0.72;

    // Label fades in when close
    if (labelRef.current) {
      const alpha = clamp01(1 - (dist - 10) / 12);
      labelRef.current.style.opacity = String(alpha);
    }
  });

  const body = (() => {
    if (shape === "octahedron") {
      return (
        <group ref={innerRef}>
          {/* Diamond gem shape */}
          <mesh ref={meshRef}>
            <octahedronGeometry args={[size, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.03} roughness={0.15} metalness={0.6} />
          </mesh>
          {/* Equatorial ring — tilted so it's visible */}
          <mesh rotation={[Math.PI / 2 + 0.5, 0.2, 0]}>
            <torusGeometry args={[size * 1.9, size * 0.055, 8, 48]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.3} />
          </mesh>
        </group>
      );
    }
    if (shape === "icosahedron") {
      return (
        <group ref={innerRef}>
          {/* Technical polygon body */}
          <mesh ref={meshRef}>
            <icosahedronGeometry args={[size, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.03} roughness={0.45} metalness={0.25} />
          </mesh>
          {/* Wireframe shell — "digital" overlay */}
          <mesh>
            <icosahedronGeometry args={[size * 1.18, 0]} />
            <meshBasicMaterial color={color} wireframe transparent opacity={0.22} />
          </mesh>
        </group>
      );
    }
    // Default sphere
    return (
      <group ref={innerRef}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[size, 24, 24]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.03} roughness={0.6} />
        </mesh>
      </group>
    );
  })();

  return (
    <group ref={groupRef} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      {body}
      {label && (
        <Html
          center
          distanceFactor={18}
          position={[0, size + 1.2, 0]}
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
