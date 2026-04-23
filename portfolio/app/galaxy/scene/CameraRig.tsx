"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { systems } from "../content";
import { systemPositions } from "../lib/systems";
import { easeInOutCubic, clamp01 } from "../lib/easing";
import { GALAXY_END, SCROLL_SEGS, SCROLL_TOTAL } from "../lib/scroll";
import * as THREE from "three";

interface Props {
  progressRef: React.MutableRefObject<number>;
}

const LERP_FACTOR = 0.06;
// How far above and in front of each system center the camera sits
const CAM_OFFSET = new THREE.Vector3(0, 4, 20);

// Pre-allocated — avoid GC churn in useFrame
const _tgt = new THREE.Vector3();
const _look = new THREE.Vector3();
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();

export default function CameraRig({ progressRef }: Props) {
  const { camera } = useThree();
  const curPos = useRef(new THREE.Vector3(0, 8, 40));
  const curLook = useRef(new THREE.Vector3(0, 0, -120));

  useFrame(() => {
    const p = clamp01(progressRef.current);

    if (p <= GALAXY_END) {
      // Fly in from galaxy overview to About system
      const t = easeInOutCubic(p / GALAXY_END);
      _a.set(0, 8, 40);
      _b.set(...systemPositions.about).add(CAM_OFFSET);
      _tgt.lerpVectors(_a, _b, t);
      _a.set(0, 0, -120);
      _b.set(...systemPositions.about);
      _look.lerpVectors(_a, _b, t);
    } else {
      const remaining = (p - GALAXY_END) / (1 - GALAXY_END);
      const w = remaining * SCROLL_TOTAL;

      // Find which dwell/travel segment we're in
      let seg = SCROLL_SEGS[SCROLL_SEGS.length - 1];
      for (const s of SCROLL_SEGS) {
        if (w <= s.end) { seg = s; break; }
      }

      const frac = clamp01((w - seg.start) / (seg.end - seg.start));
      const eased = easeInOutCubic(frac);

      if (seg.isDwell) {
        // Camera rests at this system
        _look.set(...systemPositions[systems[seg.sysIdx].id]);
        _tgt.copy(_look).add(CAM_OFFSET);
      } else {
        // Camera travels between system sysIdx and sysIdx+1
        _a.set(...systemPositions[systems[seg.sysIdx].id]);
        _b.set(...systemPositions[systems[seg.sysIdx + 1].id]);
        _look.lerpVectors(_a, _b, eased);
        _tgt.copy(_look).add(CAM_OFFSET);
      }
    }

    curPos.current.lerp(_tgt, LERP_FACTOR);
    curLook.current.lerp(_look, LERP_FACTOR);
    camera.position.copy(curPos.current);
    camera.lookAt(curLook.current);
  });

  return null;
}
