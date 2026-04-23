"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { SkillCluster } from "../content/types";

interface Props {
  center: [number, number, number];
  clusters: SkillCluster[];
  accentHex: string;
}

const CLUSTER_COLORS = ["#a78bfa", "#67e8f9", "#34d399", "#fbbf24", "#f87171"];

// Fibonacci sphere — deterministic, safe in useMemo
function fibPos(i: number, total: number, r: number): [number, number, number] {
  const phi = Math.acos(1 - 2 * (i + 0.5) / total);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  return [
    Math.sin(phi) * Math.cos(theta) * r,
    Math.cos(phi) * r * 0.42,   // flatten vertically so cloud reads as a disc
    Math.sin(phi) * Math.sin(theta) * r,
  ];
}

export default function SkillNebula({ center, clusters, accentHex }: Props) {
  const cloudRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    cloudRef.current.rotation.y = clock.elapsedTime * 0.04;
  });

  // Flatten all cluster items with their color, compute positions
  const words: Array<{ text: string; color: string; pos: [number, number, number]; size: number }> = [];
  const total = clusters.reduce((s, c) => s + c.items.length, 0);
  let idx = 0;
  for (let ci = 0; ci < clusters.length; ci++) {
    const c = clusters[ci];
    const col = CLUSTER_COLORS[ci] ?? accentHex;
    for (const item of c.items) {
      const r = 4.5 + (idx % 4) * 1.1;
      words.push({ text: item, color: col, pos: fibPos(idx, total, r), size: ci < 2 ? 9 : 8 });
      idx++;
    }
  }

  return (
    <group position={center}>
      <group ref={cloudRef}>
        {words.map(({ text, color, pos, size }) => (
          <Html
            key={text}
            center
            distanceFactor={18}
            position={pos}
            style={{ pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}
          >
            <div style={{
              color,
              fontFamily: "ui-monospace, monospace",
              fontSize: `${size}px`,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              opacity: 0.65,
              textShadow: `0 0 12px ${color}88`,
            }}>
              {text}
            </div>
          </Html>
        ))}
      </group>
    </group>
  );
}
