"use client";

import { useMemo } from "react";
import type { System, Planet, SkillCluster } from "../content/types";
import { systemPositions } from "../lib/systems";
import Star from "./Star";
import type { StarVariant } from "./Star";
import PlanetMesh from "./Planet";
import type { PlanetShape } from "./Planet";
import Comet from "./Comet";
import Beacon from "./Beacon";
import IntroHalo from "./IntroHalo";
import SkillNebula from "./SkillNebula";
import OrbitPath from "./OrbitPath";

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

// Shape communicates planet type at a glance
const planetShape = (p: Planet): PlanetShape => {
  if (p.kind === "experience") return "octahedron";  // gem = career value
  if (p.kind === "project")    return "icosahedron"; // polyhedron = technical work
  return "sphere";
};

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

// Star variant per system
const starVariant = (id: string): StarVariant => {
  if (id === "experience") return "ringed";  // career hub with orbiting rings
  if (id === "projects")   return "cage";    // technical hub with wireframe cage
  return "sun";
};

// Parse a dateRange like "Nov 2025 — Present" or "2024 — Present" into a numeric rank
// (higher = more recent). Handles month-year and year-only forms; returns 0 if unparseable.
const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};
const rankStart = (dateRange: string): number => {
  const m = dateRange.match(/([A-Za-z]{3,})?\s*(\d{4})/);
  if (!m) return 0;
  const monthKey = (m[1] ?? "").slice(0, 3).toLowerCase();
  const month = MONTHS[monthKey] ?? 1;
  const year = parseInt(m[2], 10);
  return year * 12 + month;
};

// Featured = the currently-active experience with the most recent start.
const pickFeaturedId = (planets: Planet[]): string | null => {
  let bestId: string | null = null;
  let bestRank = -1;
  for (const p of planets) {
    if (p.kind !== "experience" || p.status !== "active") continue;
    const r = rankStart(p.dateRange);
    if (r > bestRank) { bestRank = r; bestId = p.id; }
  }
  return bestId;
};

interface Props {
  system: System;
  onPlanetClick?: (planetId: string) => void;
  onStarClick?: (systemId: string) => void;
}

export default function SolarSystem({ system, onPlanetClick, onStarClick }: Props) {
  const center = systemPositions[system.id];

  const bodies = useMemo(() => {
    let i = 0;
    return system.planets.map(p => {
      const phase = (i++ * (Math.PI * 2)) / Math.max(system.planets.length, 1);
      const color = p.accent ?? system.accentHex;
      const radius = ORBIT_RADIUS[p.orbit];
      const speed = ORBIT_SPEED[p.orbit];
      const size = planetSize(p);
      const shape = planetShape(p);
      const { label, sublabel } = planetLabel(p);
      return { planet: p, phase, color, radius, speed, size, shape, label, sublabel };
    });
  }, [system]);

  const orbitRadii = useMemo(() => {
    const radii = new Set<number>();
    for (const p of system.planets) {
      if (p.orbit !== "comet") radii.add(ORBIT_RADIUS[p.orbit]);
    }
    return Array.from(radii);
  }, [system]);

  const featuredId = useMemo(
    () => (system.id === "experience" ? pickFeaturedId(system.planets) : null),
    [system],
  );

  // About: atmospheric intro halo, no orbiting planets — star is clickable (opens résumé)
  if (system.id === "about") {
    return (
      <group>
        <Star
          position={center}
          color={system.accentHex}
          size={0.65}
          onClick={onStarClick ? () => onStarClick(system.id) : undefined}
        />
        <IntroHalo />
      </group>
    );
  }

  // Skills: rotating word-cloud nebula instead of planets
  if (system.id === "skills") {
    const clusters = system.planets.filter((p): p is SkillCluster => p.kind === "skillCluster");
    return (
      <group>
        <SkillNebula center={center} clusters={clusters} />
      </group>
    );
  }

  return (
    <group>
      <Star position={center} color={system.accentHex} size={0.9} variant={starVariant(system.id)} />
      {orbitRadii.map(r => (
        <OrbitPath key={r} center={center} radius={r} color={system.accentHex} />
      ))}
      {bodies.map(({ planet, phase, color, radius, speed, size, shape, label, sublabel }) => {
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
            shape={shape}
            label={label}
            sublabel={sublabel}
            featured={planet.id === featuredId}
            onClick={() => onPlanetClick?.(planet.id)}
          />
        );
      })}
    </group>
  );
}
