"use client";

import { Canvas } from "@react-three/fiber";
import CameraRig from "./CameraRig";
import Starfield from "./Starfield";
import Nebula from "./Nebula";
import SolarSystem from "./SolarSystem";
import Galaxy from "./Galaxy";
import ShootingStars from "./ShootingStars";
import { systems } from "../content";
import { systemPositions } from "../lib/systems";

interface Props {
  progressRef: React.MutableRefObject<number>;
  onPlanetClick?: (planetId: string) => void;
  onStarClick?: (systemId: string) => void;
}

export default function Scene({ progressRef, onPlanetClick, onStarClick }: Props) {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ fov: 55, near: 0.1, far: 1000, position: [0, 8, 40] }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => gl.setClearColor("#030308", 1)}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 30]} intensity={0.4} color="#ffffff" />

      <Starfield />
      <ShootingStars />

      {systems.map(s => {
        const [x, y, z] = systemPositions[s.id];
        return <Nebula key={s.id} position={[x, y, z - 6]} color={s.accentHex} scale={30} opacity={0.22} />;
      })}

      <Galaxy />
      {systems.map(s => (
        <SolarSystem key={s.id} system={s} onPlanetClick={onPlanetClick} onStarClick={onStarClick} />
      ))}

      <CameraRig progressRef={progressRef} />
    </Canvas>
  );
}
