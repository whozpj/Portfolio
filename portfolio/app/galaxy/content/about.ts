import type { System } from "./types";

export const aboutSystem: System = {
  id: "about",
  index: 0,
  title: "About",
  subtitle: "Who · What · Where",
  accent: "white",
  accentHex: "#ffffff",
  bio: "Software Engineer focused on AI and software. Currently at ManTech modernizing legacy systems and at Candlefish applying ML to real-world problems. Actively seeking internship opportunities for Summer and Fall 2026.",
  planets: [
    { id: "loc", kind: "aboutFact", label: "CS · UVA", orbit: "inner", text: "Computer Science @ University of Virginia" },
    { id: "focus", kind: "aboutFact", label: "Focus", orbit: "inner", text: "Applied AI / software engineering" },
    { id: "status", kind: "aboutFact", label: "Open", orbit: "mid", text: "Seeking Summer & Fall 2026 internships" },
  ],
};
