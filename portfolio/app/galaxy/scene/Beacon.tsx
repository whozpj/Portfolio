"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  position: [number, number, number];
  color: string;
  onClick?: () => void;
}

export default function Beacon({ position, color, onClick }: Props) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const o = 0.5 + (Math.sin(clock.elapsedTime * 2) + 1) / 4;
    (ref.current.material as THREE.MeshBasicMaterial).opacity = o;
  });
  return (
    <mesh ref={ref} position={position} onClick={onClick}>
      <sphereGeometry args={[0.3, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} toneMapped={false} />
    </mesh>
  );
}
