"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { systems } from "../content";
import { systemPositions } from "../lib/systems";
import { easeInOutCubic, clamp01 } from "../lib/easing";
import * as THREE from "three";

interface Props {
  progressRef: React.MutableRefObject<number>;
}

const GALAXY_END = 0.08;
const LERP_FACTOR = 0.08;

export default function CameraRig({ progressRef }: Props) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 8, 40));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, -120));

  useFrame(() => {
    const p = clamp01(progressRef.current);

    let targetPos: THREE.Vector3;
    let targetLookAt: THREE.Vector3;

    const galaxyPos = new THREE.Vector3(0, 8, 40);
    const galaxyLookAt = new THREE.Vector3(0, 0, -120);

    if (p <= GALAXY_END) {
      const t = easeInOutCubic(p / GALAXY_END);
      const firstCenter = new THREE.Vector3(...systemPositions.about);
      const entry = firstCenter.clone().add(new THREE.Vector3(0, 4, 20));
      targetPos = new THREE.Vector3().lerpVectors(galaxyPos, entry, t);
      targetLookAt = new THREE.Vector3().lerpVectors(galaxyLookAt, firstCenter, t);
    } else {
      const remaining = (p - GALAXY_END) / (1 - GALAXY_END);
      const N = systems.length - 1;
      const scaled = remaining * N;
      const i = Math.min(Math.floor(scaled), N - 1);
      const eased = easeInOutCubic(scaled - i);

      const from = new THREE.Vector3(...systemPositions[systems[i].id]);
      const to = new THREE.Vector3(...systemPositions[systems[i + 1].id]);

      targetPos = new THREE.Vector3().lerpVectors(from, to, eased);
      targetPos.add(new THREE.Vector3(0, 3, 20));
      targetLookAt = new THREE.Vector3().lerpVectors(from, to, eased);
    }

    currentPos.current.lerp(targetPos, LERP_FACTOR);
    currentLookAt.current.lerp(targetLookAt, LERP_FACTOR);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
