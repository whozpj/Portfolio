"use client";

import { Canvas } from "@react-three/fiber";
import CameraRig from "./CameraRig";
import Starfield from "./Starfield";

export default function Scene() {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ fov: 55, near: 0.1, far: 1000, position: [0, 0, 20] }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => gl.setClearColor("#030308", 1)}
    >
      <ambientLight intensity={0.15} />
      <Starfield />
      <CameraRig progress={0} />
    </Canvas>
  );
}
