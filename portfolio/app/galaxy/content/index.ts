import { aboutSystem } from "./about";
import { experienceSystem } from "./experience";
import { projectsSystem } from "./projects";
import { skillsSystem } from "./skills";
import { contactSystem } from "./contact";
import type { System } from "./types";

export const systems: System[] = [
  aboutSystem,
  experienceSystem,
  projectsSystem,
  skillsSystem,
  contactSystem,
];

export { aboutSystem, experienceSystem, projectsSystem, skillsSystem, contactSystem };
export type { System } from "./types";
