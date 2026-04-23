"use client";

import { useMemo } from "react";
import {
  experienceSystem,
  projectsSystem,
  skillsSystem,
  contactSystem,
} from "../content";
import type {
  ExperiencePlanet,
  ProjectPlanet,
  SkillCluster,
  Beacon,
} from "../content/types";
import { systems } from "../content";

interface Props {
  systemIndex: number;
  visible: boolean;
  onPlanetClick: (planetId: string) => void;
  onOpenResume: () => void;
}

const statusOrder: Record<ExperiencePlanet["status"], number> = {
  active: 0, incoming: 1, past: 2,
};

// Parse "Nov 2025 — Present" / "2024 — Present" → numeric rank (higher = more recent)
const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};
const rankStart = (dateRange: string) => {
  const m = dateRange.match(/([A-Za-z]{3,})?\s*(\d{4})/);
  if (!m) return 0;
  const mo = MONTHS[(m[1] ?? "").slice(0, 3).toLowerCase()] ?? 1;
  return parseInt(m[2], 10) * 12 + mo;
};

export default function SystemCard({ systemIndex, visible, onPlanetClick, onOpenResume }: Props) {
  const system = systems[systemIndex] ?? systems[0];

  // Precompute highlighted "featured" experience (most recent active role)
  const featuredExp = useMemo<ExperiencePlanet | null>(() => {
    if (system.id !== "experience") return null;
    const actives = (experienceSystem.planets as ExperiencePlanet[])
      .filter(p => p.kind === "experience" && p.status === "active");
    if (actives.length === 0) return null;
    return [...actives].sort((a, b) => rankStart(b.dateRange) - rankStart(a.dateRange))[0];
  }, [system.id]);

  if (!visible || system.id === "about") return null;

  return (
    <div
      className="pointer-events-auto fixed left-6 top-1/2 z-20 hidden w-[340px] -translate-y-1/2 md:block"
      style={{ animation: "fadeIn 0.4s ease both" }}
    >
      <div className="rounded-sm border border-neutral-800/80 bg-[#05050c]/80 backdrop-blur-md p-5 shadow-2xl">
        {system.id === "experience" && (
          <ExperienceCard featured={featuredExp} onPlanetClick={onPlanetClick} />
        )}
        {system.id === "projects" && <ProjectsCard onPlanetClick={onPlanetClick} />}
        {system.id === "skills" && <SkillsCard />}
        {system.id === "contact" && <ContactCard onOpenResume={onOpenResume} />}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translate(-8px, -50%); } to { opacity: 1; transform: translate(0, -50%); } }
      `}</style>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */

function SectionHeader({ kicker, accent }: { kicker: string; accent: string }) {
  return (
    <p className="text-[9px] font-mono uppercase tracking-[0.3em]" style={{ color: accent }}>
      {kicker}
    </p>
  );
}

/* ── EXPERIENCE ─────────────────────────────────────────────────────── */
function ExperienceCard({
  featured,
  onPlanetClick,
}: {
  featured: ExperiencePlanet | null;
  onPlanetClick: (id: string) => void;
}) {
  const all = (experienceSystem.planets as ExperiencePlanet[])
    .filter(p => p.kind === "experience")
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || rankStart(b.dateRange) - rankStart(a.dateRange));
  const others = all.filter(e => e.id !== featured?.id);

  return (
    <>
      <SectionHeader kicker="Currently Shipping" accent={experienceSystem.accentHex} />
      {featured ? (
        <button
          onClick={() => onPlanetClick(featured.id)}
          className="mt-3 w-full text-left transition-colors hover:bg-neutral-900/40 rounded-sm -m-1 p-1"
        >
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-base font-light text-white">
              {featured.company}
              <span className="ml-2 text-[9px] font-mono uppercase tracking-[0.25em] text-neutral-500 align-middle">
                ● Now
              </span>
            </p>
            <p className="shrink-0 text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-500">
              {featured.dateRange}
            </p>
          </div>
          <p className="mt-1 text-xs font-light text-neutral-400">{featured.role}</p>
          <ul className="mt-3 space-y-1.5">
            {featured.bullets.slice(0, 2).map((b, i) => (
              <li key={i} className="flex gap-2 text-[12px] font-light leading-snug text-neutral-300">
                <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-neutral-600" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </button>
      ) : null}

      <div className="my-4 h-px bg-neutral-800/80" />

      <SectionHeader kicker="Roles · Click to expand" accent={experienceSystem.accentHex} />
      <ul className="mt-3 space-y-1.5">
        {others.map(e => (
          <li key={e.id}>
            <button
              onClick={() => onPlanetClick(e.id)}
              className="group flex w-full items-baseline justify-between gap-3 text-left"
            >
              <span className="flex items-baseline gap-2">
                <span className={`h-1 w-1 shrink-0 rounded-full ${
                  e.status === "active" ? "bg-emerald-400" :
                  e.status === "incoming" ? "bg-amber-300" : "bg-neutral-600"
                }`} />
                <span className="text-[13px] font-light text-neutral-200 group-hover:text-white transition-colors">
                  {e.company}
                </span>
                <span className="text-[10px] italic text-neutral-500">{e.role}</span>
              </span>
              <span className="shrink-0 text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-500">
                {e.dateRange.replace(" — Present", "")}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ── PROJECTS ───────────────────────────────────────────────────────── */
function ProjectsCard({ onPlanetClick }: { onPlanetClick: (id: string) => void }) {
  const projects = (projectsSystem.planets as ProjectPlanet[]).filter(p => p.kind === "project");
  const [featured, ...rest] = projects;

  return (
    <>
      <SectionHeader kicker="Featured Build" accent={projectsSystem.accentHex} />
      <button
        onClick={() => onPlanetClick(featured.id)}
        className="mt-3 w-full text-left transition-colors hover:bg-neutral-900/40 rounded-sm -m-1 p-1"
      >
        <p className="text-base font-light text-white">{featured.name}</p>
        <p className="mt-1 text-xs font-light leading-relaxed text-neutral-400 line-clamp-3">
          {featured.description}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {featured.tags.slice(0, 4).map(t => (
            <span key={t} className="border border-neutral-800 px-1.5 py-0.5 text-[9px] font-mono uppercase text-neutral-500">
              {t}
            </span>
          ))}
        </div>
      </button>

      <div className="my-4 h-px bg-neutral-800/80" />

      <SectionHeader kicker="Also · Click to expand" accent={projectsSystem.accentHex} />
      <ul className="mt-3 space-y-1.5">
        {rest.map(p => (
          <li key={p.id}>
            <button
              onClick={() => onPlanetClick(p.id)}
              className="group flex w-full items-baseline justify-between gap-3 text-left"
            >
              <span className="text-[13px] font-light text-neutral-200 group-hover:text-white transition-colors">
                {p.name}
              </span>
              <span className="shrink-0 text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-500">
                {p.tags[0]}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ── SKILLS ─────────────────────────────────────────────────────────── */
function SkillsCard() {
  const clusters = (skillsSystem.planets as SkillCluster[]).filter(p => p.kind === "skillCluster");
  return (
    <>
      <SectionHeader kicker="Tech Stack · Top Picks" accent={skillsSystem.accentHex} />
      <dl className="mt-3 space-y-3">
        {clusters.map(c => (
          <div key={c.id}>
            <dt className="text-[9px] font-mono uppercase tracking-[0.22em] text-neutral-500">
              {c.title}
            </dt>
            <dd className="mt-1 text-[12px] font-light leading-snug text-neutral-300">
              {c.items.slice(0, 6).join(" · ")}
              {c.items.length > 6 ? " · …" : ""}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}

/* ── CONTACT ────────────────────────────────────────────────────────── */
function ContactCard({ onOpenResume }: { onOpenResume: () => void }) {
  const beacons = (contactSystem.planets as Beacon[]).filter(p => p.kind === "beacon");
  return (
    <>
      <SectionHeader kicker="Get In Touch" accent={contactSystem.accentHex} />
      <p className="mt-2 text-xs font-light leading-relaxed text-neutral-400">
        Open to Summer &amp; Fall 2026 internships. Happy to chat about applied AI, backend
        systems, or anything in between.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {beacons.map(b => (
          <a
            key={b.id}
            href={b.href}
            target={b.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="border border-neutral-800 px-3 py-2 text-center text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 hover:border-white hover:text-white transition-colors"
          >
            {b.label} ↗
          </a>
        ))}
      </div>
      <button
        onClick={onOpenResume}
        className="mt-2 w-full bg-white px-3 py-2 text-[10px] font-mono uppercase tracking-[0.22em] text-black hover:bg-neutral-200 transition-colors"
      >
        View Full Résumé
      </button>
    </>
  );
}
