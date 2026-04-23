import type { System } from "./types";

export const aboutSystem: System = {
  id: "about",
  index: 0,
  title: "About",
  subtitle: "Who · What · Where",
  accent: "white",
  accentHex: "#ffffff",
  bio: "Software Engineer focused on applied AI and backend systems. CS @ UVA (B.S. May 2028, GPA 3.84). Currently at Candlefish shipping a U-Net segmentation model; recently at ManTech modernizing a legacy DoD platform. Incoming SWE at Fannie Mae (Summer 2026) and IBM (Fall 2026).",
  planets: [
    { id: "loc", kind: "aboutFact", label: "CS · UVA", orbit: "inner", text: "Computer Science @ University of Virginia — B.S. May 2028, GPA 3.84" },
    { id: "focus", kind: "aboutFact", label: "Focus", orbit: "inner", text: "Applied AI · backend systems · ML engineering" },
    { id: "status", kind: "aboutFact", label: "Next", orbit: "mid", text: "Incoming SWE @ Fannie Mae (Summer 2026) and IBM (Fall 2026)" },
  ],
};
