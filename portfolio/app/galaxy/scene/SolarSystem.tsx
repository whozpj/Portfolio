"use client";

import { useMemo } from "react";
import type { System } from "../content/types";
import { systemPositions } from "../lib/systems";
import Star from "./Star";
import Planet from "./Planet";
import Comet from "./Comet";
import Beacon from "./Beacon";

const ORBIT_RADIUS = { inner: 3.5, mid: 6, outer: 9, comet: 12 } as const;
const ORBIT_SPEED = { inner: 0.35, mid: 0.18, outer: 0.09, comet: 0.06 } as const;

interface Props {
  system: System;
  onPlanetClick?: (planetId: string) => void;
}

export default function SolarSystem({ system, onPlanetClick }: Props) {
  const center = systemPositions[system.id];

  const bodies = useMemo(() => {
    let i = 0;
    return system.planets.map(p => {
      const phase = (i++ * (Math.PI * 2)) / Math.max(system.planets.length, 1);
      const color = p.accent ?? system.accentHex;
      const radius = ORBIT_RADIUS[p.orbit];
      const speed = ORBIT_SPEED[p.orbit];
      return { planet: p, phase, color, radius, speed };
    });
  }, [system]);

  return (
    <group>
      <Star position={center} color={system.accentHex} size={system.id === "about" ? 1.8 : 1.4} />
      {bodies.map(({ planet, phase, color, radius, speed }) => {
        if (planet.orbit === "comet") {
          return (
            <Comet
              key={planet.id}
              center={center}
              a={radius}
              b={radius * 0.5}
              orbitSpeed={speed}
              initialPhase={phase}
              color={color}
              onClick={() => onPlanetClick?.(planet.id)}
            />
          );
        }
        if (planet.kind === "beacon") {
          const x = center[0] + Math.cos(phase) * radius;
          const z = center[2] + Math.sin(phase) * radius;
          return (
            <Beacon
              key={planet.id}
              position={[x, center[1], z]}
              color={color}
              onClick={() => onPlanetClick?.(planet.id)}
            />
          );
        }
        return (
          <Planet
            key={planet.id}
            center={center}
            orbitRadius={radius}
            orbitSpeed={speed}
            initialPhase={phase}
            color={color}
            size={planet.orbit === "inner" ? 0.6 : 0.45}
            onClick={() => onPlanetClick?.(planet.id)}
          />
        );
      })}
    </group>
  );
}
