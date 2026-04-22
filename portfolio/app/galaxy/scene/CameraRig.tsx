"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { systems } from "../content";
import { systemPositions } from "../lib/systems";
import { easeInOutCubic, clamp01 } from "../lib/easing";
import * as THREE from "three";

interface Props {
  progress: number;
}

const GALAXY_END = 0.08;

export default function CameraRig({ progress }: Props) {
  const { camera } = useThree();

  useFrame(() => {
    const p = clamp01(progress);

    const galaxyPos = new THREE.Vector3(0, 8, 40);
    const galaxyLookAt = new THREE.Vector3(0, 0, -120);

    if (p <= GALAXY_END) {
      const t = easeInOutCubic(p / GALAXY_END);
      const firstCenter = new THREE.Vector3(...systemPositions.about);
      const entry = firstCenter.clone().add(new THREE.Vector3(0, 4, 20));
      camera.position.lerpVectors(galaxyPos, entry, t);
      const look = new THREE.Vector3().lerpVectors(galaxyLookAt, firstCenter, t);
      camera.lookAt(look);
      return;
    }

    const remaining = (p - GALAXY_END) / (1 - GALAXY_END);
    const N = systems.length - 1;
    const scaled = remaining * N;
    const i = Math.min(Math.floor(scaled), N - 1);
    const local = scaled - i;
    const eased = easeInOutCubic(local);

    const from = new THREE.Vector3(...systemPositions[systems[i].id]);
    const to = new THREE.Vector3(...systemPositions[systems[i + 1].id]);

    const pos = new THREE.Vector3().lerpVectors(from, to, eased);
    pos.add(new THREE.Vector3(0, 3, 20));
    camera.position.copy(pos);

    const look = new THREE.Vector3().lerpVectors(from, to, eased);
    camera.lookAt(look);
  });

  return null;
}
