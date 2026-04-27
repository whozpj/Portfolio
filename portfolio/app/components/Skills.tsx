import { skillsSystem } from "../galaxy/content";
import type { SkillCluster } from "../galaxy/content/types";

const clusters = (skillsSystem.planets as SkillCluster[]).filter(
  (p) => p.kind === "skillCluster"
);

export default function Skills() {
  return (
    <section id="skills" className="px-8 py-10 px-16">
      <div className="h-px bg-[#1a1a1a] mb-8" />
      <p className="font-mono text-[10px] tracking-[4px] text-[#e63946] mb-5">
        SKILLS
      </p>
      <div className="flex flex-col gap-4">
        {clusters.map((c) => (
          <div key={c.id} className="grid grid-cols-[180px_1fr] gap-4 items-start">
            <span className="font-mono text-[10px] tracking-[2px] text-[#666] pt-1">
              {c.title}
            </span>
            <div className="flex flex-wrap gap-2">
              {c.items.map((item) => (
                <span
                  key={item}
                  className="font-mono text-[9px] tracking-[1px] border border-[#2a2a2a] rounded-sm px-2 py-1 text-[#777]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
