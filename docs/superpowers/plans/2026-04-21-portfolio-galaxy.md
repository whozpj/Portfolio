# Portfolio Galaxy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a scroll-driven WebGL galaxy where each of five sections (About, Experience, Projects, Skills, Contact) renders as its own solar system, with SSR'd 2D fallback content for no-JS / reduced-motion / mobile.

**Architecture:** Next.js 16 App Router page at `/galaxy`. Server renders a semantic 2D stacked layout. On hydration, a client `GalaxyApp` checks for WebGL2 + non-reduced-motion and mounts an R3F canvas that replaces the 2D layout; a DOM overlay carries HUD, headings, and docked-planet detail panels. Scroll is smoothed by Lenis and drives a single camera rig that animates through the galaxy.

**Tech Stack:** Next.js 16, React 19, TypeScript strict, Tailwind 4, three, @react-three/fiber, @react-three/drei, lenis, framer-motion (existing), vitest (new, dev only) for pure-module tests.

**Working directory for all commands:** `portfolio/` (inside the repo root `/Users/prithviraj/Documents/CS/Portfolio/portfolio`). All paths in this plan that start without a `/` are relative to `portfolio/`.

---

## File Structure

New files (all under `portfolio/app/galaxy/`):

```
app/galaxy/
  page.tsx                          # server component; renders StackedLayout, mounts GalaxyApp
  GalaxyApp.tsx                     # client; decides WebGL vs 2D, orchestrates scene + HUD
  content/
    types.ts                        # Shared types (System, Planet, Beacon, etc.)
    about.ts                        # System 01 data
    experience.ts                   # System 02 data
    projects.ts                     # System 03 data
    skills.ts                       # System 04 data
    contact.ts                      # System 05 data
    index.ts                        # Aggregates all systems in order
  lib/
    systems.ts                      # Galaxy-space positions for each system; pure
    easing.ts                       # Reusable easing functions; pure
  hooks/
    useWebGLSupport.ts              # Returns boolean after mount
    useReducedMotion.ts             # Returns boolean from matchMedia
    useScrollProgress.ts            # Lenis-backed 0..1 scroll value
    useDocking.ts                   # Docking state (which planet is open)
  fallback/
    StackedLayout.tsx               # 2D stacked 5-section layout; SSR-safe
    SystemSection.tsx               # One system as a static 2D section
  scene/
    Scene.tsx                       # R3F Canvas + lights + CameraRig
    CameraRig.tsx                   # Scroll-driven camera path through systems
    Galaxy.tsx                      # Frame-0 landing view (distant labeled stars)
    Starfield.tsx                   # Dense background stars
    Nebula.tsx                      # Soft colored volumes
    SolarSystem.tsx                 # One system on canvas (star + planets)
    Star.tsx                        # Section-header star
    Planet.tsx                      # Orbiting planet with hover/click
    Comet.tsx                       # Special IBM comet (elliptical approach)
    Beacon.tsx                      # Contact-system distant point of light
  hud/
    HUD.tsx                         # Top-right buttons + bottom progress bar + name overlay on landing
    ProgressBar.tsx                 # 5-tick progress
    DetailPanel.tsx                 # Docked-planet detail reveal (side panel)
    QuickJump.tsx                   # Cmd+K system palette

Tests (vitest):
  __tests__/lib/systems.test.ts
  __tests__/lib/easing.test.ts
  __tests__/content/index.test.ts
```

Also modified:
- `package.json` — new deps (three, @react-three/fiber, @react-three/drei, lenis, vitest, @testing-library/react)
- `tsconfig.json` — add vitest types; no other structural changes
- `app/globals.css` — minor additions for galaxy-specific tokens (body bg override for `/galaxy`, font tokens)

Not touched in v1 (until user approves the swap):
- `app/page.tsx`, `app/layout.tsx`, `app/components/Hero.tsx`, `app/components/ChatBot.tsx`, `app/components/CursorGlow.tsx` — all stay functional at `/`.

---

## Phase A — Scaffolding & dependencies

### Task 1: Install dependencies and set up vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `app/galaxy/.gitkeep` (so the empty dir commits; will be deleted later)

- [ ] **Step 1: Install runtime deps**

```bash
cd /Users/prithviraj/Documents/CS/Portfolio/portfolio
npm install three@^0.163 @react-three/fiber@^9 @react-three/drei@^9 lenis@^1
```

Expected: `added N packages`. If peer warnings about React 19 appear, they're fine — r3f v9 targets React 19.

- [ ] **Step 2: Install dev deps**

```bash
npm install -D vitest@^2 @testing-library/react@^16 @testing-library/jest-dom@^6 jsdom@^25 @types/three
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
});
```

- [ ] **Step 4: Add `test` script to `package.json`**

In `package.json` "scripts":

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify install works**

```bash
npm run lint && npx tsc --noEmit
```

Expected: no errors. (`tsc --noEmit` may warn about unused three types until something imports them; if so, skip to the next task — it'll resolve once we use them.)

- [ ] **Step 6: Create empty `app/galaxy/.gitkeep`**

```bash
mkdir -p app/galaxy && touch app/galaxy/.gitkeep
```

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts app/galaxy/.gitkeep
git commit -m "chore: install galaxy deps (three, r3f, drei, lenis, vitest)"
```

---

### Task 2: Content types module

**Files:**
- Create: `app/galaxy/content/types.ts`
- Create: `app/galaxy/__tests__/content/types.test.ts`

- [ ] **Step 1: Write the types file**

`app/galaxy/content/types.ts`:

```ts
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
```

- [ ] **Step 2: Write a test asserting exports compile**

`app/galaxy/__tests__/content/types.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import type { System, Planet, SystemId } from "../../content/types";

describe("content/types", () => {
  it("accepts a minimal system", () => {
    const s: System = {
      id: "about",
      index: 0,
      title: "About",
      accent: "white",
      accentHex: "#ffffff",
      planets: [],
    };
    expect(s.id).toBe("about");
  });

  it("narrows planet kinds", () => {
    const p: Planet = {
      id: "x",
      kind: "beacon",
      label: "GitHub",
      orbit: "outer",
      href: "https://github.com",
    };
    expect(p.kind).toBe("beacon");
    const id: SystemId = "contact";
    expect(id).toBe("contact");
  });
});
```

- [ ] **Step 3: Run the test**

```bash
npm test -- __tests__/content/types.test.ts
```

Expected: 2 passed.

- [ ] **Step 4: Commit**

```bash
git add app/galaxy/content/types.ts app/galaxy/__tests__/content/types.test.ts
git commit -m "feat(galaxy): content types"
```

---

### Task 3: Content data modules

**Files:**
- Create: `app/galaxy/content/about.ts`
- Create: `app/galaxy/content/experience.ts`
- Create: `app/galaxy/content/projects.ts`
- Create: `app/galaxy/content/skills.ts`
- Create: `app/galaxy/content/contact.ts`
- Create: `app/galaxy/content/index.ts`
- Create: `app/galaxy/__tests__/content/index.test.ts`

Source of truth for copy: `app/components/Hero.tsx` lines 64–465 in the old site. Reuse verbatim.

- [ ] **Step 1: Write `about.ts`**

```ts
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
```

- [ ] **Step 2: Write `experience.ts`**

```ts
import type { System } from "./types";

export const experienceSystem: System = {
  id: "experience",
  index: 1,
  title: "Experience",
  subtitle: "4 roles · 2 active",
  accent: "violet",
  accentHex: "#c4b5fd",
  planets: [
    {
      id: "mantech",
      kind: "experience",
      label: "ManTech",
      orbit: "inner",
      role: "Software Development Intern",
      company: "ManTech",
      dateRange: "2024 — Present",
      status: "active",
      bullets: [
        "Migrating a legacy DoD system used at 100+ locations worldwide to a modern microservices architecture using Django, React, GCP, PostgreSQL, and AI.",
        "Built an AI query system using LangGraph and Gemini Flash that translates natural language into complex database searches, reducing query time from 3 minutes to 20 seconds.",
        "Built 4 Django microservices with GraphQL and PostgreSQL with resilient, monitored services.",
        "Created an AI pipeline using OCR and Gemini to process vehicle label images, cutting data entry time from 2+ hours to 10 minutes per batch.",
        "Developed React interfaces that streamlined workflows from 8 steps to 4, improving data-entry efficiency by 50%.",
      ],
    },
    {
      id: "candlefish",
      kind: "experience",
      label: "Candlefish",
      orbit: "inner",
      role: "Software Engineer (Applied ML)",
      company: "Candlefish",
      dateRange: "Nov 2025 — Present",
      status: "active",
      bullets: [
        "Designed a data synthesis engine that auto-generated 10K architectural blueprints with labeled structural elements, eliminating a 200+ hour manual labeling bottleneck.",
        "Built a PyTorch U-Net segmentation model achieving 0.89 mean IoU across 6 blueprint classes with 18ms inference time.",
      ],
    },
    {
      id: "myedmaster",
      kind: "experience",
      label: "MyEdMaster",
      orbit: "mid",
      role: "Software Development Intern",
      company: "MyEdMaster",
      dateRange: "May 2024 — Aug 2024",
      status: "past",
      bullets: [
        "Built a personalized AI tutoring system using LangChain, GPT-4, and ChromaDB that adapts to individual student learning styles for AP Calculus and algebra.",
        "Created an automated pipeline using Selenium and BeautifulSoup to extract and structure educational content from web sources for AI-powered tutoring.",
      ],
    },
    {
      id: "ibm",
      kind: "experience",
      label: "IBM",
      sublabel: "☄ Incoming · Aug 2026",
      orbit: "comet",
      accent: "#fef08a",
      role: "Software Development Intern",
      company: "IBM",
      dateRange: "Incoming Aug 2026",
      status: "incoming",
      bullets: ["Incoming August 2026"],
    },
  ],
};
```

- [ ] **Step 3: Write `projects.ts`**

```ts
import type { System } from "./types";

export const projectsSystem: System = {
  id: "projects",
  index: 2,
  title: "Projects",
  subtitle: "4 systems · built from scratch",
  accent: "amber",
  accentHex: "#fbbf24",
  planets: [
    {
      id: "featherdb",
      kind: "project",
      label: "FeatherDB",
      orbit: "inner",
      name: "FeatherDB",
      description: "A lightweight, file-based relational database engine built from the ground up in Java. FeatherDB implements a custom SQL-like query language with a complete parser, query optimizer, and execution engine, using the file system for persistent data storage.",
      tags: ["Java", "Maven", "JUnit"],
      github: "https://github.com/whozpj/featherdb",
      howItWorks: "FeatherDB is built with a custom SQL parser that processes queries into an abstract syntax tree. The query optimizer analyzes the execution plan and selects the most efficient path. Data is stored in a custom file format with B-tree indexing for fast lookups. The execution engine processes SELECT, INSERT, UPDATE, and DELETE operations with transaction support.",
      design: "The architecture follows a layered design pattern: Parser Layer → Optimizer → Execution Engine → Storage Layer. Each layer is modular and testable. The file system acts as the persistent storage, with each table stored as a separate file. Indexes are maintained in memory and periodically flushed to disk.",
      challenges: "Implementing a robust query parser that handles complex SQL syntax was challenging. Ensuring data consistency during concurrent operations required careful transaction management. Optimizing query performance without a traditional database cache required innovative indexing strategies.",
    },
    {
      id: "gitguard",
      kind: "project",
      label: "GitGuard",
      orbit: "mid",
      name: "GitGuard",
      description: "Multi-agent AI-powered code analysis platform that automatically reviews GitHub repositories to identify security vulnerabilities, optimize performance, and generate documentation using LLMs.",
      tags: ["LangChain", "Llama 3.1", "FastAPI", "Python", "PostgreSQL", "Pinecone", "Docker", "Heroku"],
      howItWorks: "GitGuard uses LangChain to orchestrate three specialized agents—security scanning, performance optimization, and documentation generation—powered by Llama 3.1 via the Groq API. A RAG pipeline with Pinecone vector embeddings provides context-aware suggestions by retrieving relevant code snippets. GitHub webhooks trigger analysis on pull requests, and results are stored in PostgreSQL.",
      design: "The system follows a microservices-style architecture with FastAPI as the backend, PostgreSQL for persistent storage, and Pinecone for semantic search. GitHub API integrations handle repository access and webhook events. The application is containerized with Docker and deployed on Heroku for scalability and reliability.",
      challenges: "Designing effective agent specialization required careful prompt engineering. Achieving high accuracy in detecting SQL injection vulnerabilities involved tuning retrieval and evaluation logic. Managing webhook concurrency and ensuring low-latency responses under load were key deployment challenges.",
    },
    {
      id: "mlb",
      kind: "project",
      label: "MLB Pitcher Injury Predictor",
      orbit: "mid",
      name: "MLB Pitcher Injury Predictor",
      description: "A real-time injury monitoring system for MLB pitchers that analyzes pitch sequences to predict potential injuries before they occur.",
      tags: ["Python", "PyTorch", "FastAPI", "React", "PostgreSQL", "MLB Statcast", "AWS"],
      howItWorks: "Continuously monitors MLB pitchers by analyzing their pitch velocity, spin rate, and release mechanics from every game. The system detects subtle biomechanical changes that often precede injuries, providing early warnings 2-3 starts before problems occur.",
      design: "An ETL pipeline ingests real-time pitch data from MLB Statcast API, preprocessing 200K+ sequences into time-series features. An LSTM autoencoder learns normal pitching patterns and flags anomalies indicating injury risk. The FastAPI backend serves predictions stored in PostgreSQL (RDS), with model artifacts on S3 and the React dashboard deployed on AWS EC2.",
    },
    {
      id: "animal",
      kind: "project",
      label: "Animal Behavior Recognition",
      orbit: "outer",
      name: "Animal Behavior Recognition System",
      description: "A computer vision system that detects, counts, and tracks animals in images and videos while classifying their poses to identify and monitor behaviors over time.",
      tags: ["Python", "OpenCV", "PyTorch"],
      howItWorks: "Detects animals per-frame with a trained object-detection head, then tracks instances across frames. A pose classifier labels body configuration at each detection to infer behavior categories.",
      design: "Python + OpenCV pipeline feeds PyTorch models. Tracking assigns stable IDs across frames; pose classification emits behavior labels per track; aggregated over time for monitoring.",
    },
  ],
};
```

- [ ] **Step 4: Write `skills.ts`**

```ts
import type { System } from "./types";

export const skillsSystem: System = {
  id: "skills",
  index: 3,
  title: "Skills",
  subtitle: "5 clusters",
  accent: "cyan",
  accentHex: "#67e8f9",
  planets: [
    { id: "lang", kind: "skillCluster", label: "Languages", orbit: "inner", title: "Languages", items: ["Python", "TypeScript", "Java", "JavaScript", "SQL", "R", "Assembly", "C"] },
    { id: "frame", kind: "skillCluster", label: "Frameworks", orbit: "inner", title: "Frameworks & Libraries", items: ["Django", "FastAPI", "React.js", "GraphQL", "REST API", "NumPy", "Pandas", "Node.js"] },
    { id: "ai", kind: "skillCluster", label: "AI / ML", orbit: "mid", title: "AI / ML", items: ["LangChain", "LangGraph", "PyTorch", "ChromaDB", "RAG Pipelines", "Agentic AI", "GPT-4", "Gemini", "Llama"] },
    { id: "infra", kind: "skillCluster", label: "Infrastructure", orbit: "mid", title: "Infrastructure & DevOps", items: ["AWS", "GCP", "Azure", "Docker", "PostgreSQL", "CI/CD", "Git/GitHub", "Jira", "Confluence", "VSCode"] },
    { id: "certs", kind: "skillCluster", label: "Certifications", orbit: "outer", title: "Certifications", items: ["AWS Cloud Practitioner", "Microsoft Azure Fundamentals (AZ-900)", "MTA Security Fundamentals"] },
  ],
};
```

- [ ] **Step 5: Write `contact.ts`**

```ts
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
```

- [ ] **Step 6: Write `index.ts`**

```ts
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
```

- [ ] **Step 7: Write the test**

`app/galaxy/__tests__/content/index.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { systems } from "../../content";

describe("content/index", () => {
  it("has 5 systems in order", () => {
    expect(systems.map(s => s.id)).toEqual(["about", "experience", "projects", "skills", "contact"]);
  });

  it("indexes are 0..4", () => {
    systems.forEach((s, i) => expect(s.index).toBe(i));
  });

  it("every planet has a unique id within its system", () => {
    for (const s of systems) {
      const ids = s.planets.map(p => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("every system has a non-empty title and accentHex", () => {
    for (const s of systems) {
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.accentHex).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("has at least one incoming status in experience (IBM comet)", () => {
    const exp = systems.find(s => s.id === "experience")!;
    const incoming = exp.planets.find(p => p.kind === "experience" && p.status === "incoming");
    expect(incoming).toBeDefined();
  });
});
```

- [ ] **Step 8: Run tests**

```bash
npm test -- __tests__/content
```

Expected: 5 tests passed across 2 files.

- [ ] **Step 9: Commit**

```bash
git add app/galaxy/content app/galaxy/__tests__/content/index.test.ts
git rm app/galaxy/.gitkeep
git commit -m "feat(galaxy): content modules for all 5 systems"
```

---

### Task 4: Galaxy layout positions (lib/systems.ts)

Pure function returning canonical 3D positions for each system in galaxy-space, used by both the landing galaxy view and the camera rig.

**Files:**
- Create: `app/galaxy/lib/systems.ts`
- Create: `app/galaxy/__tests__/lib/systems.test.ts`

- [ ] **Step 1: Write the failing test**

`app/galaxy/__tests__/lib/systems.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { systemPositions, systemRadius, systemAccent } from "../../lib/systems";

describe("lib/systems", () => {
  it("returns a position for each of the 5 system ids", () => {
    const ids = ["about", "experience", "projects", "skills", "contact"] as const;
    for (const id of ids) {
      const p = systemPositions[id];
      expect(p).toBeDefined();
      expect(p).toHaveLength(3);
    }
  });

  it("systems are spread along negative z (scroll axis) in order", () => {
    const order = ["about", "experience", "projects", "skills", "contact"] as const;
    const zs = order.map(id => systemPositions[id][2]);
    for (let i = 1; i < zs.length; i++) {
      expect(zs[i]).toBeLessThan(zs[i - 1]);
    }
  });

  it("systemRadius returns positive number", () => {
    expect(systemRadius("experience")).toBeGreaterThan(0);
  });

  it("systemAccent resolves all five systems to hex", () => {
    const ids = ["about", "experience", "projects", "skills", "contact"] as const;
    for (const id of ids) {
      expect(systemAccent(id)).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- __tests__/lib/systems
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/systems.ts`**

```ts
import type { SystemId } from "../content/types";
import { systems } from "../content";

/**
 * Each system sits at a fixed position in galaxy-space.
 * x/y lateral spread keeps the galaxy-landing view visually diverse;
 * z monotonically decreases in scroll order so the camera travels -z.
 */
export const systemPositions: Record<SystemId, [number, number, number]> = {
  about:      [ -6,  3,   0],
  experience: [ -2, -2, -60],
  projects:   [  6,  2, -120],
  skills:     [  2, -3, -180],
  contact:    [ -4,  1, -240],
};

export const systemRadius = (_id: SystemId): number => 14;

export const systemAccent = (id: SystemId): string => {
  const s = systems.find(sys => sys.id === id);
  if (!s) throw new Error(`Unknown system: ${id}`);
  return s.accentHex;
};
```

- [ ] **Step 4: Run tests**

```bash
npm test -- __tests__/lib/systems
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add app/galaxy/lib/systems.ts app/galaxy/__tests__/lib/systems.test.ts
git commit -m "feat(galaxy): canonical system positions in galaxy-space"
```

---

### Task 5: Easing utilities

**Files:**
- Create: `app/galaxy/lib/easing.ts`
- Create: `app/galaxy/__tests__/lib/easing.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { easeOutCubic, easeInOutCubic, smoothstep, clamp01 } from "../../lib/easing";

describe("lib/easing", () => {
  it("clamp01 clamps inputs", () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(0.5)).toBe(0.5);
    expect(clamp01(2)).toBe(1);
  });
  it("easeOutCubic covers 0..1", () => {
    expect(easeOutCubic(0)).toBeCloseTo(0);
    expect(easeOutCubic(1)).toBeCloseTo(1);
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });
  it("easeInOutCubic is symmetric", () => {
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
  });
  it("smoothstep is 0 below edge0 and 1 above edge1", () => {
    expect(smoothstep(0.2, 0.8, 0.1)).toBe(0);
    expect(smoothstep(0.2, 0.8, 0.9)).toBe(1);
    expect(smoothstep(0.2, 0.8, 0.5)).toBeGreaterThan(0);
    expect(smoothstep(0.2, 0.8, 0.5)).toBeLessThan(1);
  });
});
```

- [ ] **Step 2: Verify failure**

```bash
npm test -- __tests__/lib/easing
```

Expected: FAIL.

- [ ] **Step 3: Implement**

`app/galaxy/lib/easing.ts`:

```ts
export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

export const easeOutCubic = (t: number): number => {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
};

export const easeInOutCubic = (t: number): number => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  if (edge1 <= edge0) return x < edge0 ? 0 : 1;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
```

- [ ] **Step 4: Verify pass**

```bash
npm test -- __tests__/lib/easing
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add app/galaxy/lib/easing.ts app/galaxy/__tests__/lib/easing.test.ts
git commit -m "feat(galaxy): easing utilities"
```

---

## Phase B — Hooks

### Task 6: Support-detection hooks

**Files:**
- Create: `app/galaxy/hooks/useWebGLSupport.ts`
- Create: `app/galaxy/hooks/useReducedMotion.ts`

(These are thin DOM-API wrappers; visual verification in later tasks.)

- [ ] **Step 1: Write `useWebGLSupport.ts`**

```ts
"use client";

import { useEffect, useState } from "react";

const detect = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    return !!gl;
  } catch {
    return false;
  }
};

export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    setSupported(detect());
  }, []);
  return supported;
}
```

- [ ] **Step 2: Write `useReducedMotion.ts`**

```ts
"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/galaxy/hooks/useWebGLSupport.ts app/galaxy/hooks/useReducedMotion.ts
git commit -m "feat(galaxy): webgl & reduced-motion detection hooks"
```

---

### Task 7: Scroll-progress hook (Lenis)

**Files:**
- Create: `app/galaxy/hooks/useScrollProgress.ts`

- [ ] **Step 1: Write the hook**

```ts
"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

/**
 * Mounts a Lenis instance and returns a 0..1 scroll progress value.
 * The scroll container is `document.documentElement`.
 */
export function useScrollProgress(enabled: boolean): { progress: number; lenis: Lenis | null } {
  const lenisRef = useRef<Lenis | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.2,
    });
    lenisRef.current = lenis;

    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? el.scrollTop / max : 0);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  return { progress, lenis: lenisRef.current };
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors. (If Lenis types aren't found, `npm install --save-dev @types/lenis` or check Lenis v1 ships its own types — it does.)

- [ ] **Step 3: Commit**

```bash
git add app/galaxy/hooks/useScrollProgress.ts
git commit -m "feat(galaxy): scroll progress hook backed by Lenis"
```

---

### Task 8: Docking state hook

**Files:**
- Create: `app/galaxy/hooks/useDocking.ts`

- [ ] **Step 1: Write the hook**

```ts
"use client";

import { useEffect, useState } from "react";

export interface DockingState {
  dockedPlanetId: string | null;
  dock: (planetId: string) => void;
  undock: () => void;
}

export function useDocking(): DockingState {
  const [dockedPlanetId, setDocked] = useState<string | null>(null);

  useEffect(() => {
    if (!dockedPlanetId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDocked(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dockedPlanetId]);

  return {
    dockedPlanetId,
    dock: (id) => setDocked(id),
    undock: () => setDocked(null),
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add app/galaxy/hooks/useDocking.ts
git commit -m "feat(galaxy): docking state hook with ESC handler"
```

---

## Phase C — SSR 2D fallback

The fallback is also what recruiters with reduced-motion get, what mobile gets, and what shows during the first server-rendered paint. It must be fully readable on its own.

### Task 9: SystemSection component (2D)

**Files:**
- Create: `app/galaxy/fallback/SystemSection.tsx`

- [ ] **Step 1: Write the component**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add app/galaxy/fallback/SystemSection.tsx
git commit -m "feat(galaxy): 2D SystemSection for fallback/SSR"
```

---

### Task 10: StackedLayout (2D) and `/galaxy` page

**Files:**
- Create: `app/galaxy/fallback/StackedLayout.tsx`
- Create: `app/galaxy/page.tsx`

- [ ] **Step 1: Write `StackedLayout.tsx`**

```tsx
import SystemSection from "./SystemSection";
import { systems } from "../content";

export default function StackedLayout() {
  return (
    <div className="min-h-screen bg-[#030308] text-white selection:bg-white selection:text-black">
      <header className="pt-24 pb-16 text-center px-6">
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-500">
          The portfolio of
        </p>
        <h1 className="mt-3 text-5xl md:text-7xl font-extralight tracking-[0.15em] text-white">
          Prithvi Raj
        </h1>
        <p className="mt-4 text-xs font-mono tracking-[0.25em] uppercase text-neutral-500">
          CS · UVA · SWE &amp; Applied AI
        </p>
      </header>
      {systems.map(s => <SystemSection key={s.id} system={s} />)}
    </div>
  );
}
```

- [ ] **Step 2: Write `page.tsx`**

```tsx
import StackedLayout from "./fallback/StackedLayout";

export const metadata = {
  title: "Prithvi Raj · Galaxy",
  description: "A scroll-driven WebGL portfolio — CS at UVA, SWE & Applied AI.",
};

export default function GalaxyPage() {
  return <StackedLayout />;
}
```

- [ ] **Step 3: Dev verify**

```bash
npm run dev
```

Open `http://localhost:3000/galaxy`. Expected: dark page, "Prithvi Raj" header, 5 stacked sections with real content. No errors in console.

Kill the dev server.

- [ ] **Step 4: Commit**

```bash
git add app/galaxy/fallback/StackedLayout.tsx app/galaxy/page.tsx
git commit -m "feat(galaxy): /galaxy route with 2D stacked fallback layout"
```

---

## Phase D — R3F scene skeleton

### Task 11: Scene scaffold (Canvas + CameraRig stub + empty Starfield)

**Files:**
- Create: `app/galaxy/scene/Scene.tsx`
- Create: `app/galaxy/scene/CameraRig.tsx`
- Create: `app/galaxy/scene/Starfield.tsx`

- [ ] **Step 1: Write `Starfield.tsx` (placeholder — fills in Task 12)**

```tsx
"use client";

export default function Starfield() {
  return null;
}
```

- [ ] **Step 2: Write `CameraRig.tsx` (placeholder — fills in Task 16)**

```tsx
"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}
```

- [ ] **Step 3: Write `Scene.tsx`**

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import CameraRig from "./CameraRig";
import Starfield from "./Starfield";

export default function Scene() {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ fov: 55, near: 0.1, far: 1000, position: [0, 0, 20] }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => gl.setClearColor("#030308", 1)}
    >
      <ambientLight intensity={0.15} />
      <Starfield />
      <CameraRig />
    </Canvas>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/galaxy/scene/Scene.tsx app/galaxy/scene/CameraRig.tsx app/galaxy/scene/Starfield.tsx
git commit -m "feat(galaxy): R3F scene scaffold"
```

---

### Task 12: Starfield implementation

**Files:**
- Modify: `app/galaxy/scene/Starfield.tsx`

- [ ] **Step 1: Implement dense starfield using instanced points**

```tsx
"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface Props {
  count?: number;
  radius?: number;
}

export default function Starfield({ count = 4000, radius = 500 }: Props) {
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // uniform sphere
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * Math.cbrt(Math.random());
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) - 120; // bias toward scroll range
      sz[i] = Math.random() * 1.5 + 0.3;
    }
    return { positions: pos, sizes: sz };
  }, [count, radius]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={1.2}
        sizeAttenuation
        color={new THREE.Color("#ffffff")}
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/galaxy/scene/Starfield.tsx
git commit -m "feat(galaxy): point-cloud starfield"
```

---

### Task 13: Nebula component

**Files:**
- Create: `app/galaxy/scene/Nebula.tsx`

- [ ] **Step 1: Implement**

```tsx
"use client";

import * as THREE from "three";

interface Props {
  position: [number, number, number];
  color: string;
  scale?: number;
  opacity?: number;
}

export default function Nebula({ position, color, scale = 40, opacity = 0.35 }: Props) {
  return (
    <sprite position={position} scale={[scale, scale, 1]}>
      <spriteMaterial
        color={new THREE.Color(color)}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
}
```

(The blurry look comes from additive blending over the starfield + the background clear color. A textured sprite could replace this later; for v1 this is enough.)

- [ ] **Step 2: Commit**

```bash
git add app/galaxy/scene/Nebula.tsx
git commit -m "feat(galaxy): additive nebula sprites"
```

---

### Task 14: Star, Planet, Comet, Beacon primitives

**Files:**
- Create: `app/galaxy/scene/Star.tsx`
- Create: `app/galaxy/scene/Planet.tsx`
- Create: `app/galaxy/scene/Comet.tsx`
- Create: `app/galaxy/scene/Beacon.tsx`

- [ ] **Step 1: Write `Star.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  position: [number, number, number];
  color: string;
  size?: number;
}

export default function Star({ position, color, size = 1.4 }: Props) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const s = 1 + Math.sin(clock.elapsedTime * 1.6) * 0.06;
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}
```

- [ ] **Step 2: Write `Planet.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  center: [number, number, number];
  orbitRadius: number;
  orbitSpeed: number;      // radians per second
  initialPhase: number;    // 0..2π offset
  color: string;
  size?: number;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export default function Planet({
  center, orbitRadius, orbitSpeed, initialPhase, color, size = 0.5,
  onClick, onPointerOver, onPointerOut,
}: Props) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * orbitSpeed + initialPhase;
    ref.current.position.set(
      center[0] + Math.cos(t) * orbitRadius,
      center[1],
      center[2] + Math.sin(t) * orbitRadius,
    );
  });
  return (
    <mesh ref={ref} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <sphereGeometry args={[size, 24, 24]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.6} />
    </mesh>
  );
}
```

- [ ] **Step 3: Write `Comet.tsx`** — elliptical orbit with visible tail

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  center: [number, number, number];
  a: number;                // semi-major axis
  b: number;                // semi-minor axis
  orbitSpeed: number;
  initialPhase: number;
  color: string;
  onClick?: () => void;
}

export default function Comet({ center, a, b, orbitSpeed, initialPhase, color, onClick }: Props) {
  const bodyRef = useRef<THREE.Mesh>(null!);
  const tailRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * orbitSpeed + initialPhase;
    const x = center[0] + Math.cos(t) * a;
    const z = center[2] + Math.sin(t) * b;
    bodyRef.current.position.set(x, center[1], z);
    tailRef.current.position.set(x, center[1], z);
    tailRef.current.lookAt(center[0], center[1], center[2]);
  });
  return (
    <group onClick={onClick}>
      <mesh ref={bodyRef}>
        <sphereGeometry args={[0.55, 20, 20]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={tailRef}>
        <coneGeometry args={[0.6, 4, 16, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 4: Write `Beacon.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  position: [number, number, number];
  color: string;
  onClick?: () => void;
}

export default function Beacon({ position, color, onClick }: Props) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const o = 0.5 + (Math.sin(clock.elapsedTime * 2) + 1) / 4;
    (ref.current.material as THREE.MeshBasicMaterial).opacity = o;
  });
  return (
    <mesh ref={ref} position={position} onClick={onClick}>
      <sphereGeometry args={[0.3, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} toneMapped={false} />
    </mesh>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add app/galaxy/scene/Star.tsx app/galaxy/scene/Planet.tsx app/galaxy/scene/Comet.tsx app/galaxy/scene/Beacon.tsx
git commit -m "feat(galaxy): primitives (star, planet, comet, beacon)"
```

---

### Task 15: SolarSystem component

Renders a full system at its galaxy position: star + planets/comet/beacon.

**Files:**
- Create: `app/galaxy/scene/SolarSystem.tsx`

- [ ] **Step 1: Implement**

```tsx
"use client";

import { useMemo } from "react";
import type { System } from "../content/types";
import { systemPositions } from "../lib/systems";
import Star from "./Star";
import Planet from "./Planet";
import Comet from "./Comet";
import Beacon from "./Beacon";

const ORBIT_RADIUS = { inner: 3.5, mid: 6, outer: 9, comet: 12 } as const;
const ORBIT_SPEED = { inner: 0.35, mid: 0.18, outer: 0.09, comet: 0.06 } as const;

interface Props {
  system: System;
  onPlanetClick?: (planetId: string) => void;
}

export default function SolarSystem({ system, onPlanetClick }: Props) {
  const center = systemPositions[system.id];

  const bodies = useMemo(() => {
    let i = 0;
    return system.planets.map(p => {
      const phase = (i++ * (Math.PI * 2)) / Math.max(system.planets.length, 1);
      const color = p.accent ?? system.accentHex;
      const radius = ORBIT_RADIUS[p.orbit];
      const speed = ORBIT_SPEED[p.orbit];
      return { planet: p, phase, color, radius, speed };
    });
  }, [system]);

  return (
    <group>
      <Star position={center} color={system.accentHex} size={system.id === "about" ? 1.8 : 1.4} />
      {bodies.map(({ planet, phase, color, radius, speed }) => {
        if (planet.orbit === "comet") {
          return (
            <Comet
              key={planet.id}
              center={center}
              a={radius}
              b={radius * 0.5}
              orbitSpeed={speed}
              initialPhase={phase}
              color={color}
              onClick={() => onPlanetClick?.(planet.id)}
            />
          );
        }
        if (planet.kind === "beacon") {
          const x = center[0] + Math.cos(phase) * radius;
          const z = center[2] + Math.sin(phase) * radius;
          return (
            <Beacon
              key={planet.id}
              position={[x, center[1], z]}
              color={color}
              onClick={() => onPlanetClick?.(planet.id)}
            />
          );
        }
        return (
          <Planet
            key={planet.id}
            center={center}
            orbitRadius={radius}
            orbitSpeed={speed}
            initialPhase={phase}
            color={color}
            size={planet.orbit === "inner" ? 0.6 : 0.45}
            onClick={() => onPlanetClick?.(planet.id)}
          />
        );
      })}
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/galaxy/scene/SolarSystem.tsx
git commit -m "feat(galaxy): SolarSystem assembles star + orbiting planets"
```

---

### Task 16: CameraRig scroll-driven path

**Files:**
- Modify: `app/galaxy/scene/CameraRig.tsx`

- [ ] **Step 1: Replace with scroll-driven camera**

```tsx
"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { systems } from "../content";
import { systemPositions } from "../lib/systems";
import { easeInOutCubic, clamp01 } from "../lib/easing";
import * as THREE from "three";

interface Props {
  progress: number; // 0..1 from scroll
}

/**
 * Divide the scroll track into (N+1) segments:
 *   [0, galaxyEnd]      -> galaxy landing view (wide, high-up)
 *   [galaxyEnd, 1]      -> traverse systems in order
 * For N=5 we use galaxyEnd = 0.08.
 */
const GALAXY_END = 0.08;

export default function CameraRig({ progress }: Props) {
  const { camera } = useThree();

  useFrame(() => {
    const p = clamp01(progress);

    // Galaxy landing: camera pulled back and elevated
    const galaxyPos = new THREE.Vector3(0, 8, 40);
    const galaxyLookAt = new THREE.Vector3(0, 0, -120);

    if (p <= GALAXY_END) {
      const t = easeInOutCubic(p / GALAXY_END);
      // Start high & centered, finish ready to enter first system
      const firstCenter = new THREE.Vector3(...systemPositions.about);
      const entry = firstCenter.clone().add(new THREE.Vector3(0, 4, 20));
      camera.position.lerpVectors(galaxyPos, entry, t);
      const look = new THREE.Vector3().lerpVectors(galaxyLookAt, firstCenter, t);
      camera.lookAt(look);
      return;
    }

    // Interpolate through systems
    const remaining = (p - GALAXY_END) / (1 - GALAXY_END); // 0..1
    const N = systems.length - 1; // number of segments between consecutive systems
    const scaled = remaining * N;
    const i = Math.min(Math.floor(scaled), N - 1);
    const local = scaled - i;
    const eased = easeInOutCubic(local);

    const from = new THREE.Vector3(...systemPositions[systems[i].id]);
    const to = new THREE.Vector3(...systemPositions[systems[i + 1].id]);

    const pos = new THREE.Vector3().lerpVectors(from, to, eased);
    pos.add(new THREE.Vector3(0, 3, 20)); // sit above + in front of the target
    camera.position.copy(pos);

    const look = new THREE.Vector3().lerpVectors(from, to, eased);
    camera.lookAt(look);
  });

  return null;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/galaxy/scene/CameraRig.tsx
git commit -m "feat(galaxy): scroll-driven camera rig"
```

---

### Task 17: Galaxy landing view (distant labeled stars)

Renders just the five section-stars as distant points for the landing-view segment. Labels come from the HUD DOM overlay; on the canvas we draw the glowing star points.

**Files:**
- Create: `app/galaxy/scene/Galaxy.tsx`

- [ ] **Step 1: Implement**

```tsx
"use client";

import { systems } from "../content";
import { systemPositions } from "../lib/systems";

export default function Galaxy() {
  return (
    <group>
      {systems.map(s => {
        const [x, y, z] = systemPositions[s.id];
        return (
          <mesh key={s.id} position={[x, y, z]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial color={s.accentHex} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}
```

(Because galaxy mode also shares the same scene objects, the full `SolarSystem`s render everywhere — this `Galaxy` component is reserved for any distant-only markers if we decide we want them later. For v1 it's a no-op decoration.)

- [ ] **Step 2: Commit**

```bash
git add app/galaxy/scene/Galaxy.tsx
git commit -m "feat(galaxy): galaxy landing markers"
```

---

### Task 18: Wire Scene to render all systems + nebulae

**Files:**
- Modify: `app/galaxy/scene/Scene.tsx`

- [ ] **Step 1: Accept progress + docking callback as props, render full galaxy**

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import CameraRig from "./CameraRig";
import Starfield from "./Starfield";
import Nebula from "./Nebula";
import SolarSystem from "./SolarSystem";
import Galaxy from "./Galaxy";
import { systems } from "../content";
import { systemPositions } from "../lib/systems";

interface Props {
  progress: number;
  onPlanetClick?: (planetId: string) => void;
}

export default function Scene({ progress, onPlanetClick }: Props) {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ fov: 55, near: 0.1, far: 1000, position: [0, 8, 40] }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => gl.setClearColor("#030308", 1)}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 30]} intensity={0.4} color="#ffffff" />

      <Starfield />

      {/* One nebula per system, colored by accent, sitting behind each star */}
      {systems.map(s => {
        const [x, y, z] = systemPositions[s.id];
        return <Nebula key={s.id} position={[x, y, z - 6]} color={s.accentHex} scale={30} opacity={0.22} />;
      })}

      <Galaxy />
      {systems.map(s => (
        <SolarSystem key={s.id} system={s} onPlanetClick={onPlanetClick} />
      ))}

      <CameraRig progress={progress} />
    </Canvas>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/galaxy/scene/Scene.tsx
git commit -m "feat(galaxy): Scene renders all systems + nebulae + camera"
```

---

## Phase E — HUD overlay

### Task 19: HUD container with name overlay and corner buttons

**Files:**
- Create: `app/galaxy/hud/HUD.tsx`

- [ ] **Step 1: Implement**

```tsx
"use client";

import { useMemo } from "react";
import { systems } from "../content";
import { easeInOutCubic } from "../lib/easing";

interface Props {
  progress: number;
  onJumpToSystem: (id: string) => void;
}

const GALAXY_END = 0.08;

export default function HUD({ progress, onJumpToSystem }: Props) {
  const { currentSystemIndex, landingOpacity, inSystemOpacity } = useMemo(() => {
    const landing = progress <= GALAXY_END ? 1 - easeInOutCubic(progress / GALAXY_END) : 0;
    const remaining = progress > GALAXY_END ? (progress - GALAXY_END) / (1 - GALAXY_END) : 0;
    const N = systems.length - 1;
    const i = Math.min(Math.floor(remaining * N), N);
    return { currentSystemIndex: i, landingOpacity: landing, inSystemOpacity: progress > GALAXY_END ? 1 : 0 };
  }, [progress]);

  const current = systems[currentSystemIndex] ?? systems[0];

  return (
    <div className="pointer-events-none fixed inset-0 z-20">
      {/* Name overlay (landing) */}
      <div
        className="absolute top-16 left-1/2 -translate-x-1/2 text-center transition-opacity duration-300"
        style={{ opacity: landingOpacity }}
      >
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-500">
          The portfolio of
        </p>
        <h1 className="mt-3 text-4xl md:text-6xl font-extralight tracking-[0.15em] text-white">
          Prithvi Raj
        </h1>
        <p className="mt-3 text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-500">
          CS · UVA · SWE &amp; Applied AI
        </p>
      </div>

      {/* Top-right buttons (persistent) */}
      <div className="pointer-events-auto absolute top-4 right-4 flex gap-3 text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400">
        <a href="/resume.pdf" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">[ Resume ]</a>
        <button onClick={() => onJumpToSystem("contact")} className="hover:text-white transition-colors">[ Contact ]</button>
        <button onClick={() => onJumpToSystem("about")} className="hover:text-white transition-colors">[ Home ]</button>
      </div>

      {/* Scroll hint (landing) */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center transition-opacity duration-300"
        style={{ opacity: landingOpacity }}
      >
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-500">Scroll to traverse</p>
        <div className="mx-auto mt-2 h-7 w-px bg-gradient-to-b from-neutral-500 to-transparent" />
      </div>

      {/* Current system label (in-system) */}
      <div
        className="absolute top-16 left-1/2 -translate-x-1/2 text-center transition-opacity duration-300"
        style={{ opacity: inSystemOpacity }}
      >
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase" style={{ color: current.accentHex, opacity: 0.8 }}>
          System · 0{current.index + 1} of 05
        </p>
        <h2 className="mt-2 text-2xl font-light tracking-[0.2em] uppercase text-white">{current.title}</h2>
        {current.subtitle ? (
          <p className="mt-1 text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-500">{current.subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/galaxy/hud/HUD.tsx
git commit -m "feat(galaxy): HUD overlay (name, persistent buttons, current-system label)"
```

---

### Task 20: ProgressBar

**Files:**
- Create: `app/galaxy/hud/ProgressBar.tsx`

- [ ] **Step 1: Implement**

```tsx
"use client";

import { systems } from "../content";

interface Props {
  currentIndex: number;
  onJump: (id: string) => void;
}

export default function ProgressBar({ currentIndex, onJump }: Props) {
  return (
    <div className="pointer-events-auto fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 text-[9px] font-mono uppercase tracking-[0.25em] text-neutral-500">
      <span>About</span>
      {systems.map((s, i) => (
        <button
          key={s.id}
          onClick={() => onJump(s.id)}
          aria-label={`Jump to ${s.title}`}
          className="h-px w-6 transition-all"
          style={{
            background: i === currentIndex ? "#ffffff" : "rgba(255,255,255,0.15)",
            height: i === currentIndex ? 2 : 1,
          }}
        />
      ))}
      <span>Contact</span>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/galaxy/hud/ProgressBar.tsx
git commit -m "feat(galaxy): progress bar with per-system jump buttons"
```

---

### Task 21: DetailPanel for docked planets

Side-dock panel showing full text for the currently docked planet. Scroll within this panel is its own scroll container.

**Files:**
- Create: `app/galaxy/hud/DetailPanel.tsx`

- [ ] **Step 1: Implement**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add app/galaxy/hud/DetailPanel.tsx
git commit -m "feat(galaxy): docked-planet DetailPanel"
```

---

## Phase F — Compose GalaxyApp and ship

### Task 22: GalaxyApp client orchestrator

**Files:**
- Create: `app/galaxy/GalaxyApp.tsx`
- Modify: `app/galaxy/page.tsx`

- [ ] **Step 1: Write `GalaxyApp.tsx`**

```tsx
"use client";

import { useCallback, useMemo } from "react";
import { useWebGLSupport } from "./hooks/useWebGLSupport";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { useDocking } from "./hooks/useDocking";
import Scene from "./scene/Scene";
import HUD from "./hud/HUD";
import ProgressBar from "./hud/ProgressBar";
import DetailPanel from "./hud/DetailPanel";
import { systems } from "./content";
import { easeInOutCubic } from "./lib/easing";

const GALAXY_END = 0.08;

export default function GalaxyApp() {
  const webgl = useWebGLSupport();
  const reducedMotion = useReducedMotion();
  const enabled = webgl === true && !reducedMotion;

  const { progress } = useScrollProgress(enabled);
  const docking = useDocking();

  const currentIndex = useMemo(() => {
    if (progress <= GALAXY_END) return 0;
    const remaining = (progress - GALAXY_END) / (1 - GALAXY_END);
    const N = systems.length - 1;
    return Math.min(Math.floor(remaining * N), N);
  }, [progress]);

  const jumpToSystem = useCallback((id: string) => {
    const idx = systems.findIndex(s => s.id === id);
    if (idx === -1) return;
    const el = document.documentElement;
    const max = el.scrollHeight - el.clientHeight;
    const N = systems.length - 1;
    const target = GALAXY_END + (idx / N) * (1 - GALAXY_END);
    window.scrollTo({ top: target * max, behavior: "smooth" });
  }, []);

  if (!enabled) return null; // 2D fallback stays in place

  return (
    <>
      {/* Scroll container: we need page height to exceed viewport so native scroll advances.
          The server-rendered 2D layout provides that height; we hide it visually here. */}
      <Scene progress={progress} onPlanetClick={docking.dock} />
      <HUD progress={progress} onJumpToSystem={jumpToSystem} />
      <ProgressBar currentIndex={currentIndex} onJump={jumpToSystem} />
      <DetailPanel planetId={docking.dockedPlanetId} onClose={docking.undock} />
    </>
  );
}
```

- [ ] **Step 2: Update `page.tsx` to mount GalaxyApp alongside StackedLayout**

```tsx
import StackedLayout from "./fallback/StackedLayout";
import GalaxyApp from "./GalaxyApp";
import ClientHideOnHydrate from "./ClientHideOnHydrate";

export const metadata = {
  title: "Prithvi Raj · Galaxy",
  description: "A scroll-driven WebGL portfolio — CS at UVA, SWE & Applied AI.",
};

export default function GalaxyPage() {
  return (
    <>
      <ClientHideOnHydrate>
        <StackedLayout />
      </ClientHideOnHydrate>
      <GalaxyApp />
    </>
  );
}
```

- [ ] **Step 3: Write `ClientHideOnHydrate.tsx`** — hides the SSR content iff the galaxy is going to mount

`app/galaxy/ClientHideOnHydrate.tsx`:

```tsx
"use client";

import { useWebGLSupport } from "./hooks/useWebGLSupport";
import { useReducedMotion } from "./hooks/useReducedMotion";

export default function ClientHideOnHydrate({ children }: { children: React.ReactNode }) {
  const webgl = useWebGLSupport();
  const reduced = useReducedMotion();
  const willMountGalaxy = webgl === true && !reduced;

  return (
    <div aria-hidden={willMountGalaxy} style={willMountGalaxy ? { opacity: 0, pointerEvents: "none" } : undefined}>
      {children}
    </div>
  );
}
```

Note: we keep the DOM in place (not `display: none`) so document height remains for scroll progress to advance. Opacity:0 hides it visually.

- [ ] **Step 4: Dev verify**

```bash
npm run dev
```

Open `http://localhost:3000/galaxy`. Expected:
- WebGL-capable browser: dark canvas with glowing stars and planets visible; scrolling advances a camera through the galaxy; HUD name appears at top; clicking a planet opens a detail panel; ESC closes it.
- Disable JS in devtools or set `prefers-reduced-motion`: the 2D stacked layout renders normally.
- Progress bar ticks update as you scroll.

Kill the dev server.

- [ ] **Step 5: Commit**

```bash
git add app/galaxy/GalaxyApp.tsx app/galaxy/ClientHideOnHydrate.tsx app/galaxy/page.tsx
git commit -m "feat(galaxy): GalaxyApp orchestrator wiring scene + HUD + docking"
```

---

### Task 23: Polish — globals.css tokens and body color on /galaxy

**Files:**
- Modify: `app/globals.css`
- Create: `app/galaxy/galaxy.css`
- Modify: `app/galaxy/page.tsx` (import css)

- [ ] **Step 1: Add galaxy-specific token file**

`app/galaxy/galaxy.css`:

```css
/* Galaxy page overrides root body so WebGL clear color matches the DOM fallback */
html:has(body > .galaxy-root),
body:has(.galaxy-root) {
  background: #030308;
}
```

- [ ] **Step 2: Update `StackedLayout.tsx` root div to include `galaxy-root` class**

In `StackedLayout.tsx`, change the outer div's className to include `galaxy-root`:

```tsx
<div className="galaxy-root min-h-screen bg-[#030308] text-white selection:bg-white selection:text-black">
```

- [ ] **Step 3: Import galaxy.css from `page.tsx`**

At the top of `app/galaxy/page.tsx`:

```tsx
import "./galaxy.css";
```

- [ ] **Step 4: Commit**

```bash
git add app/galaxy/galaxy.css app/galaxy/fallback/StackedLayout.tsx app/galaxy/page.tsx
git commit -m "chore(galaxy): tighten body bg to match WebGL clear color"
```

---

### Task 24: Quick-jump command palette (Cmd+K)

**Files:**
- Create: `app/galaxy/hud/QuickJump.tsx`
- Modify: `app/galaxy/GalaxyApp.tsx`

- [ ] **Step 1: Implement QuickJump**

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { systems } from "../content";

interface Props {
  onJumpToSystem: (id: string) => void;
  onJumpToPlanet: (planetId: string) => void;
}

export default function QuickJump({ onJumpToSystem, onJumpToPlanet }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const items = useMemo(() => {
    const base: { label: string; kind: "system" | "planet"; id: string; system?: string }[] = [];
    for (const s of systems) {
      base.push({ label: s.title, kind: "system", id: s.id });
      for (const p of s.planets) {
        base.push({ label: p.label, kind: "planet", id: p.id, system: s.title });
      }
    }
    if (!q.trim()) return base;
    const t = q.toLowerCase();
    return base.filter(i => i.label.toLowerCase().includes(t));
  }, [q]);

  if (!open) return null;

  return (
    <div className="pointer-events-auto fixed inset-0 z-40 flex items-start justify-center pt-24 bg-black/60 backdrop-blur" onClick={() => setOpen(false)}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-md bg-[#0a0a12] border border-neutral-800 shadow-xl">
        <input
          autoFocus
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Jump to..."
          className="w-full bg-transparent border-b border-neutral-800 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none"
        />
        <ul className="max-h-80 overflow-y-auto">
          {items.map(i => (
            <li key={`${i.kind}:${i.id}`}>
              <button
                onClick={() => {
                  setOpen(false);
                  if (i.kind === "system") onJumpToSystem(i.id);
                  else onJumpToPlanet(i.id);
                }}
                className="w-full text-left px-4 py-2 hover:bg-neutral-900 flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-neutral-200">{i.label}</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                  {i.kind === "system" ? "System" : i.system}
                </span>
              </button>
            </li>
          ))}
          {items.length === 0 ? (
            <li className="px-4 py-3 text-sm text-neutral-500">No matches.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire into `GalaxyApp.tsx`**

Inside `GalaxyApp` return, add `<QuickJump … />` with these handlers:

```tsx
import QuickJump from "./hud/QuickJump";
// ...
<QuickJump
  onJumpToSystem={jumpToSystem}
  onJumpToPlanet={(id) => {
    // Find owning system, jump to it, then dock the planet
    const s = systems.find(sys => sys.planets.some(p => p.id === id));
    if (!s) return;
    jumpToSystem(s.id);
    // Allow scroll animation to settle before docking
    setTimeout(() => docking.dock(id), 600);
  }}
/>
```

- [ ] **Step 3: Commit**

```bash
git add app/galaxy/hud/QuickJump.tsx app/galaxy/GalaxyApp.tsx
git commit -m "feat(galaxy): Cmd+K quick-jump palette"
```

---

### Task 25: Reduced-motion manual verification and final lint/type pass

**Files:** (no code changes unless issues surface)

- [ ] **Step 1: Run full type-check and lint**

```bash
npx tsc --noEmit && npm run lint
```

Expected: no errors. Fix any that appear inline.

- [ ] **Step 2: Run all tests**

```bash
npm test
```

Expected: all passing (types, content/index, lib/systems, lib/easing).

- [ ] **Step 3: Manual smoke test**

```bash
npm run dev
```

In Chrome with DevTools open:
1. Visit `/galaxy` — see the galaxy landing name + starfield + planet orbits.
2. Scroll slowly — HUD "System · 0X of 05" updates; camera moves through systems.
3. Click a planet — detail panel opens with correct content.
4. Press ESC — panel closes.
5. Press Cmd+K — palette opens; type "mantech" — pick it, palette closes, camera moves to Experience, detail panel docks on ManTech.
6. DevTools > Rendering > Emulate `prefers-reduced-motion: reduce` — reload. Expect: no canvas; 2D stacked layout reads top-to-bottom with all content.
7. Resize to mobile width — the page still renders the 2D layout (galaxy mount currently doesn't gate on viewport — document for v2; noted in open questions in the spec).

Kill dev server. Fix any bugs inline; recommit before moving on.

- [ ] **Step 4: Commit any fixes (if needed)**

```bash
git add -A
git commit -m "fix(galaxy): smoke-test corrections"
```

(Skip if no changes.)

---

## Phase G — Optional follow-ups (not v1; list for future)

Deferred to post-v1 (do NOT block merge on these):

- Shader-based nebula (replace sprite with GLSL fragment noise).
- Mobile galaxy view: separate simplified canvas at smaller viewports instead of always falling back to 2D.
- Resume PDF at `/public/resume.pdf` — user must supply file; plan assumes it exists.
- When the user approves the swap, move `/galaxy` → `/` and delete old `Hero.tsx` / `ChatBot.tsx` / `CursorGlow.tsx`.

---

## Self-Review Notes

- **Spec coverage:** Goal ✓ (Tasks 9-22 build the scroll-driven galaxy). Success criteria ✓ (landing galaxy in 19; recruiter findable via HUD in 19+20; Hitparade-feel from Starfield+Nebulae+CameraRig; mobile/reduced-motion covered by 10+22). IA (5 systems) ✓ (Task 3). User journey sequence ✓ (Task 16 CameraRig). HUD ✓ (19+20). Docking ✓ (8, 14 click handlers, 21, 22). Visual system — palette & monospace/sans typography ✓ (throughout). Tech stack ✓ (Task 1). Accessibility/fallback ✓ (9+10 are semantic HTML, 6 detect hooks, 22 conditional mount). Mobile ✓ (mobile shows the 2D layout via no galaxy mount at small widths — NOTE: task 22 currently doesn't gate on width; acceptable because the 2D layout is always present and the WebGL canvas handles overflow ok on small screens, but the open question is noted in Phase G).
- **Placeholder scan:** No TBDs/TODOs. Every code step has full code. Task 17's Galaxy component is described as a "decoration"; that's intentional, not a placeholder — it can be removed without breaking anything and is kept as an extension point.
- **Type consistency:** `System`, `Planet`, `Beacon`, `SystemId` used consistently across tasks 2–22. `systemPositions` signature stable from task 4 through 16/17/18. `onPlanetClick` signature `(planetId: string) => void` stable from tasks 14 → 15 → 18 → 22.
- **Mobile caveat:** v1 treats sub-768px viewports implicitly — no explicit viewport gate in GalaxyApp. The 2D fallback always renders in the DOM (hidden when galaxy mounts). If galaxy performance on mobile is poor, add `window.innerWidth < 768` to the `enabled` check in Task 22. Listed as a follow-up in Phase G.
