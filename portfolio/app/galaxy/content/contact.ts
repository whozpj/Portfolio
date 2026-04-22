import type { System } from "./types";

export const contactSystem: System = {
  id: "contact",
  index: 4,
  title: "Contact",
  subtitle: "4 beacons",
  accent: "coral",
  accentHex: "#fca5a5",
  planets: [
    { id: "email", kind: "beacon", label: "Email", orbit: "inner", href: "mailto:wyp9mq@virginia.edu" },
    { id: "linkedin", kind: "beacon", label: "LinkedIn", orbit: "inner", href: "https://www.linkedin.com/in/prithvi-raj-7015a0250/" },
    { id: "github", kind: "beacon", label: "GitHub", orbit: "mid", href: "https://github.com/whozpj" },
    { id: "resume", kind: "beacon", label: "Resume", orbit: "mid", href: "/resume.pdf" },
  ],
};
