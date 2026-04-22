import type { System, Planet } from "../content/types";

const renderPlanetBody = (p: Planet) => {
  switch (p.kind) {
    case "experience":
      return (
        <div>
          <p className="text-xs font-mono tracking-[0.25em] uppercase text-neutral-500">
            {p.dateRange}
            {p.status === "incoming" ? " · incoming" : ""}
          </p>
          <h3 className="text-xl font-light mt-1 text-neutral-100">{p.role}</h3>
          <p className="text-sm italic text-neutral-500">{p.company}</p>
          <ul className="mt-3 space-y-2 text-sm font-light text-neutral-400 leading-relaxed">
            {p.bullets.map((b, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-neutral-700">—</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "project":
      return (
        <div>
          <h3 className="text-xl font-light text-neutral-100">{p.name}</h3>
          <p className="mt-2 text-sm font-light text-neutral-400 leading-relaxed">{p.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.tags.map(t => (
              <span key={t} className="text-[10px] font-mono uppercase tracking-tight border border-neutral-800 px-2 py-0.5 text-neutral-500">{t}</span>
            ))}
          </div>
          {p.github ? (
            <a href={p.github} className="mt-3 inline-block text-xs font-mono tracking-widest uppercase text-neutral-400 hover:text-white" target="_blank" rel="noreferrer">
              GitHub →
            </a>
          ) : null}
        </div>
      );
    case "skillCluster":
      return (
        <div>
          <h3 className="text-sm font-mono uppercase tracking-[0.3em] text-neutral-400">{p.title}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.items.map(item => (
              <span key={item} className="text-[11px] border border-neutral-800 px-3 py-1 text-neutral-400">{item}</span>
            ))}
          </div>
        </div>
      );
    case "aboutFact":
      return (
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500">{p.label}</p>
          <p className="mt-2 text-sm font-light text-neutral-300 leading-relaxed">{p.text}</p>
        </div>
      );
    case "beacon":
      return (
        <a href={p.href} target={p.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 group-hover:text-white">{p.label}</p>
          <p className="mt-1 text-sm font-light text-neutral-400 break-all">{p.href}</p>
        </a>
      );
  }
};

export default function SystemSection({ system }: { system: System }) {
  return (
    <section
      id={system.id}
      className="min-h-[90vh] px-6 md:px-12 py-24 max-w-5xl mx-auto"
      aria-labelledby={`${system.id}-title`}
    >
      <header className="mb-12">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em]" style={{ color: system.accentHex, opacity: 0.7 }}>
          System · 0{system.index + 1} of 05
        </p>
        <h2 id={`${system.id}-title`} className="mt-3 text-4xl md:text-5xl font-light tracking-tight text-white">
          {system.title}
        </h2>
        {system.subtitle ? (
          <p className="mt-2 text-sm font-mono uppercase tracking-[0.25em] text-neutral-500">{system.subtitle}</p>
        ) : null}
        {system.bio ? (
          <p className="mt-6 max-w-2xl text-base font-light text-neutral-400 leading-relaxed">{system.bio}</p>
        ) : null}
      </header>
      <div className="grid gap-10 md:grid-cols-2">
        {system.planets.map(p => (
          <div key={p.id} className="group border-l border-neutral-900 pl-6 hover:border-neutral-700 transition-colors">
            {renderPlanetBody(p)}
          </div>
        ))}
      </div>
    </section>
  );
}
