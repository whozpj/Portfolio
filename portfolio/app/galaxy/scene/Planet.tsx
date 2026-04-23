"use client";

import { useRef } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { clamp01 } from "../lib/easing";
import { getGlowTexture } from "../lib/textures";

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
  featured?: boolean;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
}

const _wp = new THREE.Vector3();

export default function Planet({
  center, orbitRadius, orbitSpeed, initialPhase, color, size = 0.5,
  shape = "sphere", label, sublabel, featured = false, onClick,
}: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const scaleRef = useRef<THREE.Group>(null!);
  const innerRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const rimRef = useRef<THREE.Mesh>(null!);
  const haloRef = useRef<THREE.Sprite>(null!);
  const auraRef = useRef<THREE.Mesh>(null!);
  const satelliteRef = useRef<THREE.Group>(null!);
  const labelRef = useRef<HTMLDivElement>(null);

  const hoveredRef = useRef(false);
  const hoverScale = useRef(1);
  const wasClose = useRef(false);
  const pulseTime = useRef(-Infinity);

  // Effective size: featured planets get a subtle size lift
  const effSize = featured ? size * 1.12 : size;

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime * orbitSpeed + initialPhase;
    groupRef.current.position.set(
      center[0] + Math.cos(t) * orbitRadius,
      center[1],
      center[2] + Math.sin(t) * orbitRadius,
    );

    if (shape === "octahedron") {
      innerRef.current.rotation.y += 0.007;
      innerRef.current.rotation.z += 0.003;
    } else if (shape === "icosahedron") {
      innerRef.current.rotation.y -= 0.005;
      innerRef.current.rotation.x += 0.003;
    }

    groupRef.current.getWorldPosition(_wp);
    const dist = camera.position.distanceTo(_wp);
    const bright = clamp01(1 - (dist - 10) / 22);

    const close = dist < 22;
    if (close && !wasClose.current) pulseTime.current = clock.elapsedTime;
    wasClose.current = close;
    const pulseAge = clock.elapsedTime - pulseTime.current;
    const pulse = pulseAge < 1.2 ? Math.sin(pulseAge * Math.PI / 1.2) * 0.15 : 0;

    const target = (hoveredRef.current ? 1.32 : 1) + pulse;
    hoverScale.current = THREE.MathUtils.lerp(hoverScale.current, target, 0.15);
    scaleRef.current.scale.setScalar(hoverScale.current);

    const hoverBoost = hoveredRef.current ? 0.35 : 0;
    const featuredFloor = featured ? 0.15 : 0;
    (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.03 + featuredFloor + bright * 0.72 + hoverBoost;

    // Rim shell pulses opacity with camera proximity for fresnel-like highlight
    if (rimRef.current) {
      (rimRef.current.material as THREE.MeshBasicMaterial).opacity = 0.08 + bright * 0.22 + hoverBoost * 0.3;
    }

    const haloAlpha = bright * 0.55 + (hoveredRef.current ? 0.35 : 0) + (featured ? 0.15 : 0);
    (haloRef.current.material as THREE.SpriteMaterial).opacity = haloAlpha;

    // Featured extras: pulsing aura ring + orbiting satellite
    if (featured) {
      if (auraRef.current) {
        const auraPulse = 0.35 + Math.sin(clock.elapsedTime * 1.6) * 0.25;
        (auraRef.current.material as THREE.MeshBasicMaterial).opacity = auraPulse * (0.4 + bright * 0.6);
        auraRef.current.rotation.z += 0.002;
      }
      if (satelliteRef.current) {
        satelliteRef.current.rotation.y = clock.elapsedTime * 1.4;
      }
    }

    if (labelRef.current) {
      const fade = clamp01(1 - (dist - 10) / 12);
      // Featured labels keep a minimum visibility floor so the "NOW" tag is always legible
      const floor = featured ? 0.5 : 0;
      labelRef.current.style.opacity = String(Math.max(floor, fade));
    }
  });

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hoveredRef.current = true;
    document.body.style.cursor = "pointer";
  };
  const handleOut = () => {
    hoveredRef.current = false;
    document.body.style.cursor = "";
  };

  return (
    <group ref={groupRef} onClick={onClick} onPointerOver={handleOver} onPointerOut={handleOut}>
      <group ref={scaleRef}>
        {/* Additive halo sprite */}
        <sprite ref={haloRef} scale={[effSize * 4, effSize * 4, 1]}>
          <spriteMaterial
            map={getGlowTexture()}
            color={color}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>

        {/* Featured: pulsing aura ring */}
        {featured && (
          <mesh ref={auraRef} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[effSize * 1.7, effSize * 0.05, 8, 48]} />
            <meshBasicMaterial color={color} transparent opacity={0.4} depthWrite={false} toneMapped={false} />
          </mesh>
        )}

        <group ref={innerRef}>
          {shape === "octahedron" && (
            <>
              <mesh ref={meshRef}>
                <octahedronGeometry args={[effSize, 0]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.03} roughness={0.15} metalness={0.6} />
              </mesh>
              <mesh rotation={[Math.PI / 2 + 0.5, 0.2, 0]}>
                <torusGeometry args={[effSize * 1.9, effSize * 0.055, 8, 48]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.3} />
              </mesh>
              {/* Rim shell — translucent outer gem for fresnel-style highlight */}
              <mesh ref={rimRef}>
                <octahedronGeometry args={[effSize * 1.15, 0]} />
                <meshBasicMaterial color={color} transparent opacity={0.1} depthWrite={false} />
              </mesh>
            </>
          )}
          {shape === "icosahedron" && (
            <>
              <mesh ref={meshRef}>
                <icosahedronGeometry args={[effSize, 0]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.03} roughness={0.45} metalness={0.25} />
              </mesh>
              <mesh ref={rimRef}>
                <icosahedronGeometry args={[effSize * 1.18, 0]} />
                <meshBasicMaterial color={color} wireframe transparent opacity={0.22} />
              </mesh>
            </>
          )}
          {shape === "sphere" && (
            <>
              <mesh ref={meshRef}>
                <sphereGeometry args={[effSize, 24, 24]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.03} roughness={0.6} />
              </mesh>
              <mesh ref={rimRef}>
                <sphereGeometry args={[effSize * 1.08, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.1} depthWrite={false} side={THREE.BackSide} />
              </mesh>
            </>
          )}
        </group>

        {/* Featured satellite — tiny moon orbiting the planet body */}
        {featured && (
          <group ref={satelliteRef}>
            <mesh position={[effSize * 2.1, 0.15, 0]}>
              <sphereGeometry args={[effSize * 0.12, 12, 12]} />
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
          </group>
        )}
      </group>

      {label && (
        <Html
          center
          distanceFactor={18}
          position={[0, effSize + 1.2, 0]}
          style={{ pointerEvents: "none", userSelect: "none", textAlign: "center", whiteSpace: "nowrap" }}
        >
          <div ref={labelRef} style={{ opacity: 0 }}>
            {featured && (
              <div style={{
                color,
                fontFamily: "ui-monospace, monospace",
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.35em",
                marginBottom: "4px",
                textShadow: "0 0 8px rgba(0,0,0,0.9)",
              }}>
                ● NOW
              </div>
            )}
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
