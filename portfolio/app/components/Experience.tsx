"use client";

import { useState } from "react";
import { experienceSystem } from "../galaxy/content";
import type { ExperiencePlanet } from "../galaxy/content/types";

const experiences = (experienceSystem.planets as ExperiencePlanet[]).filter(
  (p) => p.kind === "experience"
);

export default function Experience() {
  const [openId, setOpenId] = useState<string>("mantech");

  return (
    <section id="experience" className="px-8 py-20 max-w-4xl mx-auto">
      <div className="h-px bg-[#1a1a1a] mb-12" />
      <p className="font-mono text-[10px] tracking-[4px] text-[#e63946] mb-6">
        EXPERIENCE
      </p>
      <div className="flex flex-col gap-1">
        {experiences.map((exp) => {
          const isOpen = openId === exp.id;
          const isActive = exp.status === "active";
          return (
            <div
              key={exp.id}
              data-role="exp-row"
              className={`rounded-md border transition-all duration-150 ${
                isOpen
                  ? "border-[#e6394655] bg-[#0d0d0d]"
                  : "border-transparent hover:border-[#e6394633] hover:bg-[#0d0d0d]"
              }`}
            >
              <button
                onClick={() => setOpenId(isOpen ? "" : exp.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-5 py-4 gap-4 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e63946]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      isActive ? "bg-[#e63946]" : "bg-[#1f1f1f]"
                    }`}
                  />
                  <span
                    className={`text-base font-bold w-28 ${
                      isActive ? "text-[#e63946]" : "text-white"
                    }`}
                  >
                    {exp.company.split(" ")[0]}
                  </span>
                  <span className="text-sm text-[#555] font-light">{exp.role}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] tracking-[1px] text-[#2a2a2a] whitespace-nowrap">
                    {exp.dateRange}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`font-mono text-sm transition-transform duration-200 ${
                      isOpen ? "rotate-90 text-[#e63946]" : "text-[#2a2a2a]"
                    }`}
                  >
                    ›
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pl-[52px] border-t border-[#1a1a1a]">
                  <ul className="mt-4 flex flex-col gap-2">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="flex gap-3 text-sm text-[#555] font-light leading-relaxed">
                        <span className="text-[#e6394666] flex-shrink-0">—</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
