"use client";

interface Props {
  center: [number, number, number];
  radius: number;
  color: string;
  opacity?: number;
}

export default function OrbitPath({ center, radius, color, opacity = 0.15 }: Props) {
  return (
    <mesh position={center} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.015, 6, 128]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}
