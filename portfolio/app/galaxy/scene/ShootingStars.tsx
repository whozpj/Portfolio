"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Streak {
  start: THREE.Vector3;
  dir: THREE.Vector3;
  quat: THREE.Quaternion;
  t0: number;
  period: number;
  duration: number;
  length: number;
}

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

const STREAK_COUNT = 6;
const X_AXIS = new THREE.Vector3(1, 0, 0);

export default function ShootingStars() {
  const streaks = useMemo<Streak[]>(() => {
    const r = rng(0xbeef);
    return Array.from({ length: STREAK_COUNT }, () => {
      const start = new THREE.Vector3(
        (r() - 0.5) * 140,
        12 + r() * 30,
        -70 + (r() - 0.5) * 80,
      );
      const dir = new THREE.Vector3(
        (r() - 0.5) * 2,
        -0.3 - r() * 0.4,
        0.6 + r() * 0.6,
      ).normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(X_AXIS, dir);
      return {
        start,
        dir,
        quat,
        t0: r() * 14,
        period: 10 + r() * 16,
        duration: 1.1 + r() * 0.8,
        length: 7 + r() * 6,
      };
    });
  }, []);

  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const now = clock.elapsedTime;
    streaks.forEach((s, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const local = ((now - s.t0) % s.period + s.period) % s.period;
      if (local > s.duration) {
        mesh.visible = false;
        return;
      }
      mesh.visible = true;
      const progress = local / s.duration;
      const travel = progress * 110;
      mesh.position.set(
        s.start.x + s.dir.x * travel,
        s.start.y + s.dir.y * travel,
        s.start.z + s.dir.z * travel,
      );
      mesh.quaternion.copy(s.quat);
      const alpha = progress < 0.15
        ? progress / 0.15
        : progress > 0.75
          ? (1 - progress) / 0.25
          : 1;
      (mesh.material as THREE.MeshBasicMaterial).opacity = alpha * 0.85;
    });
  });

  return (
    <group>
      {streaks.map((s, i) => (
        <mesh
          key={i}
          ref={el => { refs.current[i] = el; }}
          visible={false}
        >
          <planeGeometry args={[s.length, 0.08]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
