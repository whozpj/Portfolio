"use client";

import { useMemo } from "react";
import type { System, Planet } from "../content/types";
import { systemPositions } from "../lib/systems";
import Star from "./Star";
import PlanetMesh from "./Planet";
import Comet from "./Comet";
import Beacon from "./Beacon";

const ORBIT_RADIUS = { inner: 3.5, mid: 6, outer: 9, comet: 12 } as const;

// Active roles orbit faster (most recent = most alive); past roles drift slowly
const ORBIT_SPEED = { inner: 0.35, mid: 0.14, outer: 0.07, comet: 0.06 } as const;

// Visual size encodes status: active > past > other
const planetSize = (p: Planet): number => {
  if (p.kind === "experience") {
    if (p.status === "active") return 0.75;
    if (p.status === "past")   return 0.45;
    return 0.55; // incoming
  }
  if (p.orbit === "inner") return 0.6;
  if (p.orbit === "outer") return 0.38;
  return 0.48;
};

// What to show as the floating label for each planet kind
const planetLabel = (p: Planet): { label: string; sublabel?: string } => {
  switch (p.kind) {
    case "experience":
      return { label: p.company, sublabel: p.dateRange };
    case "project":
      return { label: p.name };
    case "skillCluster":
      return { label: p.title };
    case "aboutFact":
      return { label: p.label };
    case "beacon":
      return { label: p.label };
  }
};

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
      const size = planetSize(p);
      const { label, sublabel } = planetLabel(p);
      return { planet: p, phase, color, radius, speed, size, label, sublabel };
    });
  }, [system]);

  return (
    <group>
      <Star position={center} color={system.accentHex} size={system.id === "about" ? 1.8 : 1.4} />
      {bodies.map(({ planet, phase, color, radius, speed, size, label, sublabel }) => {
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
              label={label}
              sublabel={sublabel}
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
          <PlanetMesh
            key={planet.id}
            center={center}
            orbitRadius={radius}
            orbitSpeed={speed}
            initialPhase={phase}
            color={color}
            size={size}
            label={label}
            sublabel={sublabel}
            onClick={() => onPlanetClick?.(planet.id)}
          />
        );
      })}
    </group>
  );
}
