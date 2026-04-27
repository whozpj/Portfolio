"use client";

import { useEffect } from "react";
import {
  aboutSystem,
  experienceSystem,
  projectsSystem,
  skillsSystem,
  contactSystem,
} from "../content";
import type { ExperiencePlanet, ProjectPlanet, SkillCluster, Beacon } from "../content/types";

interface Props {
  open: boolean;
  onClose: () => void;
}

const statusOrder: Record<ExperiencePlanet["status"], number> = {
  active: 0,
  incoming: 1,
  past: 2,
};

export default function ResumeSummary({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const experiences = (experienceSystem.planets as ExperiencePlanet[])
    .filter(p => p.kind === "experience")
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  const projects = (projectsSystem.planets as ProjectPlanet[]).filter(p => p.kind === "project");
  const skills = (skillsSystem.planets as SkillCluster[]).filter(p => p.kind === "skillCluster");
  const beacons = (contactSystem.planets as Beacon[]).filter(p => p.kind === "beacon");

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-md p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
      onClick={onClose}
      onWheel={e => e.stopPropagation()}
      onTouchMove={e => e.stopPropagation()}
    >
      <div
        className="relative w-full max-w-3xl rounded-sm border border-neutral-800 bg-[#0a0a12]/95 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 md:px-10">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">
            Résumé · Summary
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 hover:text-white"
            >
              [ PDF ↗ ]
            </a>
            <button
              onClick={onClose}
              aria-label="Close résumé"
              className="text-xl leading-none text-neutral-400 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>

        {/* Header */}
        <header className="px-6 py-8 md:px-10 md:py-10 border-b border-neutral-800">
          <h2 id="resume-title" className="text-4xl md:text-5xl font-extralight tracking-[0.12em] text-white">
            Prithvi Raj
          </h2>
          <p className="mt-2 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
            Software Engineer · Applied AI · UVA Computer Science
          </p>
          {aboutSystem.bio && (
            <p className="mt-5 text-sm font-light leading-relaxed text-neutral-300 max-w-2xl">
              {aboutSystem.bio}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-mono text-neutral-400">
            {beacons.map(b => (
              <a
                key={b.id}
                href={b.href}
                target={b.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="hover:text-white border-b border-transparent hover:border-white transition-colors"
              >
                {b.label} ↗
              </a>
            ))}
          </div>
        </header>

        {/* Experience */}
        <section className="px-6 py-8 md:px-10 md:py-10 border-b border-neutral-800">
          <h3 className="text-[11px] font-mono uppercase tracking-[0.35em]" style={{ color: experienceSystem.accentHex }}>
            Experience
          </h3>
          <ul className="mt-6 space-y-7">
            {experiences.map(e => (
              <li key={e.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-base font-light text-white">
                    {e.role} <span className="text-neutral-500">·</span>{" "}
                    <span className="text-neutral-300">{e.company}</span>
                  </p>
                  <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                    {e.dateRange}
                  </p>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {e.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3 text-sm font-light leading-relaxed text-neutral-300">
                      <span className="mt-[9px] h-[3px] w-[3px] shrink-0 rounded-full bg-neutral-600" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        {/* Projects */}
        <section className="px-6 py-8 md:px-10 md:py-10 border-b border-neutral-800">
          <h3 className="text-[11px] font-mono uppercase tracking-[0.35em]" style={{ color: projectsSystem.accentHex }}>
            Projects
          </h3>
          <ul className="mt-6 space-y-6">
            {projects.map(p => (
              <li key={p.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-base font-light text-white">{p.name}</p>
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500 hover:text-white"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
                <p className="mt-2 text-sm font-light leading-relaxed text-neutral-300">{p.description}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.tags.map(t => (
                    <span key={t} className="border border-neutral-800 px-2 py-0.5 text-[10px] font-mono uppercase text-neutral-500">
                      {t}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Skills */}
        <section className="px-6 py-8 md:px-10 md:py-10 border-b border-neutral-800">
          <h3 className="text-[11px] font-mono uppercase tracking-[0.35em]" style={{ color: skillsSystem.accentHex }}>
            Skills
          </h3>
          <dl className="mt-6 space-y-4">
            {skills.map(c => (
              <div key={c.id} className="grid gap-2 md:grid-cols-[180px_1fr]">
                <dt className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500">{c.title}</dt>
                <dd className="text-sm font-light leading-relaxed text-neutral-300">
                  {c.items.join(" · ")}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Footer hint */}
        <footer className="px-6 py-5 md:px-10">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-600">
            Esc · close
          </p>
        </footer>
      </div>
    </div>
  );
}
