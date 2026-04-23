"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type StarVariant = "sun" | "ringed" | "cage";

interface Props {
  position: [number, number, number];
  color: string;
  size?: number;
  variant?: StarVariant;
}

export default function Star({ position, color, size = 1.0, variant = "sun" }: Props) {
  const coreRef = useRef<THREE.Mesh>(null!);
  const ringARef = useRef<THREE.Mesh>(null!);
  const ringBRef = useRef<THREE.Mesh>(null!);
  const cageRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;
    // Core pulse
    const s = 1 + Math.sin(elapsed * 1.4) * 0.05;
    coreRef.current.scale.setScalar(s);

    if (variant === "ringed") {
      ringARef.current.rotation.z += 0.004;
      ringBRef.current.rotation.x += 0.003;
    }
    if (variant === "cage") {
      cageRef.current.rotation.y += 0.006;
      cageRef.current.rotation.x += 0.002;
    }
  });

  return (
    <group position={position}>
      {/* Core sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>

      {/* Experience hub: two orbiting rings at different tilts */}
      {variant === "ringed" && (
        <>
          <mesh ref={ringARef} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[size * 2.4, size * 0.06, 8, 64]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} toneMapped={false} />
          </mesh>
          <mesh ref={ringBRef} rotation={[0.5, 0.3, 0]}>
            <torusGeometry args={[size * 3.2, size * 0.04, 8, 64]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} toneMapped={false} />
          </mesh>
        </>
      )}

      {/* Projects hub: slowly rotating wireframe cage */}
      {variant === "cage" && (
        <mesh ref={cageRef}>
          <icosahedronGeometry args={[size * 2.2, 1]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.2} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}
