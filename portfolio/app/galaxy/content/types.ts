export type SystemId = "about" | "experience" | "projects" | "skills" | "contact";

export type Accent = "white" | "violet" | "amber" | "cyan" | "coral";

export interface PlanetBase {
  id: string;
  label: string;
  sublabel?: string;
  orbit: "inner" | "mid" | "outer" | "comet";
  accent?: string; // hex override, otherwise inherit system accent
}

export interface ExperiencePlanet extends PlanetBase {
  kind: "experience";
  role: string;
  company: string;
  dateRange: string;
  status: "active" | "past" | "incoming";
  bullets: string[];
}

export interface ProjectPlanet extends PlanetBase {
  kind: "project";
  name: string;
  description: string;
  tags: string[];
  github?: string;
  howItWorks: string;
  design: string;
  challenges?: string;
}

export interface SkillCluster extends PlanetBase {
  kind: "skillCluster";
  title: string;
  items: string[];
}

export interface AboutFact extends PlanetBase {
  kind: "aboutFact";
  text: string;
}

export interface Beacon extends PlanetBase {
  kind: "beacon";
  href: string;
}

export type Planet = ExperiencePlanet | ProjectPlanet | SkillCluster | AboutFact | Beacon;

export interface System {
  id: SystemId;
  index: number;         // 0..4, ordering on galaxy + scroll
  title: string;         // displayed as star label
  subtitle?: string;
  accent: Accent;
  accentHex: string;     // resolved hex for WebGL/CSS
  bio?: string;          // optional hub text for About star
  planets: Planet[];
}
