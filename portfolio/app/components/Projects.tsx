import { projectsSystem } from "../galaxy/content";
import type { ProjectPlanet } from "../galaxy/content/types";

const projects = (projectsSystem.planets as ProjectPlanet[]).filter(
  (p) => p.kind === "project"
);

export default function Projects() {
  return (
    <section id="projects" className="px-8 py-10 px-16">
      <div className="h-px bg-[#1a1a1a] mb-8" />
      <p className="font-mono text-[10px] tracking-[4px] text-[#e63946] mb-4">
        PROJECTS
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-black rounded-lg p-6 border border-[#1a1a1a] hover:border-[#e6394644] hover:shadow-[0_0_20px_#e6394611] transition-all duration-200"
          >
            <h3 className="text-xl font-black text-white">{p.name}</h3>
            <p className="font-mono text-[9px] tracking-[2px] text-[#333] mt-1.5">
              {p.tags.join(" · ")}
            </p>
            <p className="text-sm text-[#444] font-light leading-relaxed mt-3">
              {p.description}
            </p>
            {p.github ? (
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GITHUB"
                className="font-mono text-[9px] tracking-[2px] text-[#e63946] mt-4 block hover:underline"
              >
                GITHUB ↗
              </a>
            ) : (
              <span className="font-mono text-[9px] tracking-[2px] text-[#e63946] mt-4 block">
                VIEW PROJECT ↗
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
