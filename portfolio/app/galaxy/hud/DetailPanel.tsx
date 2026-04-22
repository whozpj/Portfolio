"use client";

import type { Planet, System } from "../content/types";
import { systems } from "../content";

interface Props {
  planetId: string | null;
  onClose: () => void;
}

const findPlanet = (planetId: string): { planet: Planet; system: System } | null => {
  for (const s of systems) {
    const p = s.planets.find(pl => pl.id === planetId);
    if (p) return { planet: p, system: s };
  }
  return null;
};

export default function DetailPanel({ planetId, onClose }: Props) {
  if (!planetId) return null;
  const found = findPlanet(planetId);
  if (!found) return null;
  const { planet, system } = found;

  return (
    <div
      className="pointer-events-auto fixed inset-y-0 right-0 z-30 w-full md:w-[480px] lg:w-[560px] bg-[#030308]/90 backdrop-blur-md border-l border-neutral-800 overflow-y-auto"
      role="dialog"
      aria-labelledby="detail-panel-title"
    >
      <button
        onClick={onClose}
        aria-label="Close detail panel"
        className="absolute top-5 right-5 text-neutral-400 hover:text-white text-xl leading-none"
      >
        ×
      </button>
      <div className="p-8 md:p-12">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em]" style={{ color: system.accentHex }}>
          {system.title}
        </p>
        <h3 id="detail-panel-title" className="mt-3 text-3xl font-light tracking-tight text-white">
          {planet.kind === "experience" ? planet.role : planet.kind === "project" ? planet.name : planet.label}
        </h3>

        {planet.kind === "experience" ? (
          <>
            <p className="mt-1 text-sm italic text-neutral-500">{planet.company} · {planet.dateRange}</p>
            <ul className="mt-6 space-y-3 text-sm font-light text-neutral-300 leading-relaxed">
              {planet.bullets.map((b, i) => (
                <li key={i} className="flex gap-3"><span className="text-neutral-700">—</span><span>{b}</span></li>
              ))}
            </ul>
          </>
        ) : null}

        {planet.kind === "project" ? (
          <>
            <p className="mt-4 text-sm font-light text-neutral-400 leading-relaxed">{planet.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {planet.tags.map(t => (
                <span key={t} className="text-[10px] font-mono uppercase tracking-tight border border-neutral-800 px-2 py-0.5 text-neutral-400">{t}</span>
              ))}
            </div>
            <div className="mt-8 space-y-6">
              <section>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">How it works</h4>
                <p className="mt-2 text-sm font-light text-neutral-300 leading-relaxed">{planet.howItWorks}</p>
              </section>
              <section>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">Design</h4>
                <p className="mt-2 text-sm font-light text-neutral-300 leading-relaxed">{planet.design}</p>
              </section>
              {planet.challenges ? (
                <section>
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">Challenges</h4>
                  <p className="mt-2 text-sm font-light text-neutral-300 leading-relaxed">{planet.challenges}</p>
                </section>
              ) : null}
              {planet.github ? (
                <a href={planet.github} target="_blank" rel="noreferrer" className="inline-block mt-2 text-xs font-mono uppercase tracking-[0.25em] text-white border-b border-neutral-600 hover:border-white">
                  GitHub →
                </a>
              ) : null}
            </div>
          </>
        ) : null}

        {planet.kind === "skillCluster" ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {planet.items.map(item => (
              <span key={item} className="text-xs border border-neutral-800 px-3 py-1 text-neutral-300">{item}</span>
            ))}
          </div>
        ) : null}

        {planet.kind === "aboutFact" ? (
          <p className="mt-4 text-sm font-light text-neutral-300 leading-relaxed">{planet.text}</p>
        ) : null}

        {planet.kind === "beacon" ? (
          <a href={planet.href} target={planet.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
             className="mt-6 inline-block text-sm font-mono tracking-[0.25em] uppercase text-white border-b border-neutral-600 hover:border-white">
            {planet.href} →
          </a>
        ) : null}
      </div>
    </div>
  );
}
