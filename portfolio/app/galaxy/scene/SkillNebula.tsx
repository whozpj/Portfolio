"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { SkillCluster } from "../content/types";

interface Props {
  center: [number, number, number];
  clusters: SkillCluster[];
}

const CLUSTER_COLORS = ["#a78bfa", "#67e8f9", "#34d399", "#fbbf24", "#f87171"];
const CARD_RADIUS = 7.5;

export default function SkillNebula({ center, clusters }: Props) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.elapsedTime * 0.06;
  });

  return (
    <group position={center}>
      <group ref={groupRef}>
        {clusters.map((cluster, i) => {
          const angle = (i / clusters.length) * Math.PI * 2;
          const pos: [number, number, number] = [
            Math.cos(angle) * CARD_RADIUS,
            0,
            Math.sin(angle) * CARD_RADIUS,
          ];
          const color = CLUSTER_COLORS[i] ?? "#ffffff";
          // Sort items alphabetically within each cluster
          const sorted = [...cluster.items].sort((a, b) => a.localeCompare(b));

          return (
            <Html
              key={cluster.id}
              center
              distanceFactor={18}
              position={pos}
              style={{ pointerEvents: "none", userSelect: "none", textAlign: "center", whiteSpace: "nowrap" }}
            >
              {/* Cluster title */}
              <div style={{
                color,
                fontFamily: "ui-monospace, monospace",
                fontSize: "10px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginBottom: "8px",
                fontWeight: 600,
                textShadow: `0 0 14px ${color}`,
              }}>
                {cluster.title}
              </div>
              {/* Sorted items */}
              {sorted.map(item => (
                <div key={item} style={{
                  color: "rgba(255,255,255,0.75)",
                  fontFamily: "ui-monospace, monospace",
                  fontSize: "8px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  lineHeight: "1.9",
                }}>
                  {item}
                </div>
              ))}
            </Html>
          );
        })}
      </group>
    </group>
  );
}
