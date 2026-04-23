"use client";

import { useRef } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { getGlowTexture } from "../lib/textures";

export type StarVariant = "sun" | "ringed" | "cage";

interface Props {
  position: [number, number, number];
  color: string;
  size?: number;
  variant?: StarVariant;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
}

export default function Star({ position, color, size = 1.0, variant = "sun", onClick }: Props) {
  const coreRef = useRef<THREE.Mesh>(null!);
  const coronaRef = useRef<THREE.Sprite>(null!);
  const flareRef = useRef<THREE.Group>(null!);
  const ringARef = useRef<THREE.Mesh>(null!);
  const ringBRef = useRef<THREE.Mesh>(null!);
  const cageRef = useRef<THREE.Mesh>(null!);
  const hoveredRef = useRef(false);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 1.4) * 0.05;
    coreRef.current.scale.setScalar(pulse * (hoveredRef.current ? 1.1 : 1));

    // Corona breathes between 0.55 and 0.85, boost on hover
    const coronaAlpha = 0.55 + Math.sin(t * 0.9) * 0.15 + (hoveredRef.current ? 0.2 : 0);
    (coronaRef.current.material as THREE.SpriteMaterial).opacity = coronaAlpha;

    // Flare cross: slow counter-rotation, opacity breathing
    flareRef.current.rotation.z = t * 0.12;
    flareRef.current.scale.setScalar(1 + Math.sin(t * 0.7) * 0.08);

    if (variant === "ringed") {
      ringARef.current.rotation.z += 0.004;
      ringBRef.current.rotation.x += 0.003;
    }
    if (variant === "cage") {
      cageRef.current.rotation.y += 0.006;
      cageRef.current.rotation.x += 0.002;
    }
  });

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    if (!onClick) return;
    e.stopPropagation();
    hoveredRef.current = true;
    document.body.style.cursor = "pointer";
  };
  const handleOut = () => {
    if (!onClick) return;
    hoveredRef.current = false;
    document.body.style.cursor = "";
  };

  return (
    <group position={position} onClick={onClick} onPointerOver={handleOver} onPointerOut={handleOut}>
      {/* Corona halo sprite — additive soft glow */}
      <sprite ref={coronaRef} scale={[size * 6, size * 6, 1]}>
        <spriteMaterial
          map={getGlowTexture()}
          color={color}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {/* Flare cross — four thin additive streaks crossing through the star */}
      <group ref={flareRef}>
        <mesh>
          <planeGeometry args={[size * 9, size * 0.12]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[size * 9, size * 0.12]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[size * 6, size * 0.06]} />
          <meshBasicMaterial color={color} transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <planeGeometry args={[size * 6, size * 0.06]} />
          <meshBasicMaterial color={color} transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>

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
