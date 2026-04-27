# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Three.js galaxy portfolio with a clean, scroll-based single-page portfolio — black background, large red (#e63946) accents, bento-inspired hero, accordion experience, project cards, skills, and footer.

**Architecture:** Single Next.js page (`app/page.tsx`) composed of focused section components under `app/components/`. All content is pulled from existing `app/galaxy/content/*.ts` files — no content migration needed. The galaxy directory is deleted at the end.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, Framer Motion (accordion), TypeScript, Vitest + @testing-library/react

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `app/components/Nav.tsx` | Sticky top nav — monogram + section links |
| Create | `app/components/Hero.tsx` | Name, eyebrow, bio, CTA buttons |
| Create | `app/components/Experience.tsx` | Accordion list of roles, expand/collapse |
| Create | `app/components/Projects.tsx` | 2-col card grid |
| Create | `app/components/Skills.tsx` | Grouped pill tags |
| Create | `app/components/Footer.tsx` | Contact links |
| Modify | `app/page.tsx` | Compose all sections, remove galaxy imports |
| Modify | `app/layout.tsx` | Remove Inter font weight restrictions, keep bg color |
| Delete | `app/galaxy/` | Entire galaxy directory |

Content files (`app/galaxy/content/*.ts`) are **read-only** — imported but not modified.

---

## Task 1: Create branch and scaffold component files

**Files:**
- Create: `app/components/Nav.tsx`
- Create: `app/components/Hero.tsx`
- Create: `app/components/Experience.tsx`
- Create: `app/components/Projects.tsx`
- Create: `app/components/Skills.tsx`
- Create: `app/components/Footer.tsx`

- [ ] **Step 1: Create the branch**

```bash
cd /path/to/Portfolio
git checkout main
git checkout -b portfolio-redesign
```

- [ ] **Step 2: Create Nav.tsx**

```tsx
// app/components/Nav.tsx
"use client";
export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
      <span className="font-mono text-sm tracking-[4px] text-white">PR</span>
      <div className="flex gap-6 font-mono text-[10px] tracking-[2px] text-[#333]">
        <a href="#experience" className="hover:text-[#e63946] transition-colors">EXPERIENCE</a>
        <a href="#projects" className="hover:text-[#e63946] transition-colors">PROJECTS</a>
        <a href="#contact" className="text-[#e63946]">CONTACT ↗</a>
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Create Hero.tsx**

```tsx
// app/components/Hero.tsx
export default function Hero() {
  return (
    <section className="pt-40 pb-20 px-8 max-w-4xl mx-auto">
      <p className="font-mono text-[10px] tracking-[4px] text-[#e63946] mb-4">
        SOFTWARE ENGINEER · APPLIED AI · UVA
      </p>
      <h1 className="text-[72px] font-black leading-none tracking-[-3px] text-white">
        Prithvi<br />
        <span className="text-[#e63946]">Raj.</span>
      </h1>
      <p className="mt-5 text-[15px] text-[#444] font-light leading-relaxed max-w-md">
        I build AI systems that ship — LLM pipelines, agentic workflows, and the infrastructure to run them reliably.
      </p>
      <div className="flex items-center gap-6 mt-8">
        <a
          href="#experience"
          className="font-mono text-[10px] tracking-[2px] bg-[#e63946] text-black font-bold px-5 py-2.5 rounded-sm hover:bg-[#cc2f3b] transition-colors"
        >
          VIEW WORK ↓
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[10px] tracking-[2px] text-[#333] hover:text-[#e63946] transition-colors"
        >
          RESUME ↗
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create stub files for the remaining components** (will be filled in later tasks)

```tsx
// app/components/Experience.tsx
export default function Experience() { return <section id="experience" />; }
```

```tsx
// app/components/Projects.tsx
export default function Projects() { return <section id="projects" />; }
```

```tsx
// app/components/Skills.tsx
export default function Skills() { return <section id="skills" />; }
```

```tsx
// app/components/Footer.tsx
export default function Footer() { return <footer id="contact" />; }
```

- [ ] **Step 5: Wire up page.tsx**

```tsx
// app/page.tsx
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Footer from "./components/Footer";

export const metadata = {
  title: "Prithvi Raj · Software Engineer",
  description: "Software Engineer focused on applied AI and backend systems. CS @ UVA.",
};

export default function Home() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <Nav />
      <Hero />
      <Experience />
      <Projects />
      <Skills />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 6: Start dev server and confirm page loads without errors**

```bash
cd portfolio && npm run dev
```

Open http://localhost:3000 — should show the hero text on a black background. No galaxy, no errors.

- [ ] **Step 7: Commit**

```bash
git add app/components/ app/page.tsx
git commit -m "feat: scaffold redesigned portfolio — nav, hero, stub sections"
```

---

## Task 2: Build Experience accordion

**Files:**
- Modify: `app/components/Experience.tsx`
- Test: `app/components/__tests__/Experience.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `app/components/__tests__/Experience.test.tsx`:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Experience from "../Experience";

describe("Experience accordion", () => {
  it("renders all three companies", () => {
    render(<Experience />);
    expect(screen.getByText("ManTech")).toBeInTheDocument();
    expect(screen.getByText("Candlefish")).toBeInTheDocument();
    expect(screen.getByText("MyEdMaster")).toBeInTheDocument();
  });

  it("ManTech is expanded by default", () => {
    render(<Experience />);
    expect(screen.getByText(/Built 4 prod Django/)).toBeVisible();
  });

  it("clicking a collapsed row expands it", () => {
    render(<Experience />);
    const candlefish = screen.getByText("Candlefish").closest("[data-role='exp-row']")!;
    fireEvent.click(candlefish);
    expect(screen.getByText(/200\+ hour manual labeling/)).toBeVisible();
  });

  it("clicking an open row collapses it", () => {
    render(<Experience />);
    const mantech = screen.getByText("ManTech").closest("[data-role='exp-row']")!;
    fireEvent.click(mantech);
    expect(screen.queryByText(/Built 4 prod Django/)).not.toBeVisible();
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
cd portfolio && npx vitest run app/components/__tests__/Experience.test.tsx
```

Expected: FAIL — Experience is a stub.

- [ ] **Step 3: Implement Experience.tsx**

```tsx
// app/components/Experience.tsx
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
              onClick={() => setOpenId(isOpen ? "" : exp.id)}
              className={`rounded-md border cursor-pointer transition-all duration-150 ${
                isOpen
                  ? "border-[#e6394655] bg-[#0d0d0d]"
                  : "border-transparent hover:border-[#e6394633] hover:bg-[#0d0d0d]"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 gap-4">
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
                  <span className="text-sm text-[#333] font-light">{exp.role}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] tracking-[1px] text-[#2a2a2a] whitespace-nowrap">
                    {exp.dateRange}
                  </span>
                  <span
                    className={`font-mono text-sm text-[#2a2a2a] transition-transform duration-200 ${
                      isOpen ? "rotate-90 text-[#e63946]" : "hover:text-[#e63946]"
                    }`}
                  >
                    ›
                  </span>
                </div>
              </div>

              {/* Detail */}
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
```

- [ ] **Step 4: Run tests**

```bash
cd portfolio && npx vitest run app/components/__tests__/Experience.test.tsx
```

Expected: all 4 pass.

- [ ] **Step 5: Confirm visually in browser** — accordion rows expand/collapse, ManTech open by default, chevron rotates.

- [ ] **Step 6: Commit**

```bash
git add app/components/Experience.tsx app/components/__tests__/Experience.test.tsx
git commit -m "feat: experience accordion with expand/collapse"
```

---

## Task 3: Build Projects section

**Files:**
- Modify: `app/components/Projects.tsx`
- Test: `app/components/__tests__/Projects.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// app/components/__tests__/Projects.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Projects from "../Projects";

describe("Projects section", () => {
  it("renders all three projects", () => {
    render(<Projects />);
    expect(screen.getByText("Argus")).toBeInTheDocument();
    expect(screen.getByText("GitGuard")).toBeInTheDocument();
    expect(screen.getByText("FeatherDB")).toBeInTheDocument();
  });

  it("renders GitHub link for FeatherDB", () => {
    render(<Projects />);
    const link = screen.getByRole("link", { name: /GITHUB/i });
    expect(link).toHaveAttribute("href", "https://github.com/whozpj/featherdb");
  });

  it("renders tags for each project", () => {
    render(<Projects />);
    expect(screen.getByText(/PYTHON/)).toBeInTheDocument();
    expect(screen.getByText(/LANGGRAPH/)).toBeInTheDocument();
    expect(screen.getByText(/JAVA/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
cd portfolio && npx vitest run app/components/__tests__/Projects.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Implement Projects.tsx**

```tsx
// app/components/Projects.tsx
import { projectsSystem } from "../galaxy/content";
import type { ProjectPlanet } from "../galaxy/content/types";

const projects = (projectsSystem.planets as ProjectPlanet[]).filter(
  (p) => p.kind === "project"
);

export default function Projects() {
  return (
    <section id="projects" className="px-8 py-20 max-w-4xl mx-auto">
      <div className="h-px bg-[#1a1a1a] mb-12" />
      <p className="font-mono text-[10px] tracking-[4px] text-[#e63946] mb-6">
        PROJECTS
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                rel="noreferrer"
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
```

- [ ] **Step 4: Run tests**

```bash
cd portfolio && npx vitest run app/components/__tests__/Projects.test.tsx
```

Expected: all 3 pass.

- [ ] **Step 5: Confirm visually** — 3 cards, red border glow on hover.

- [ ] **Step 6: Commit**

```bash
git add app/components/Projects.tsx app/components/__tests__/Projects.test.tsx
git commit -m "feat: projects card grid"
```

---

## Task 4: Build Skills section

**Files:**
- Modify: `app/components/Skills.tsx`
- Test: `app/components/__tests__/Skills.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// app/components/__tests__/Skills.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Skills from "../Skills";

describe("Skills section", () => {
  it("renders all skill category headings", () => {
    render(<Skills />);
    expect(screen.getByText("Languages")).toBeInTheDocument();
    expect(screen.getByText("Frameworks & Libraries")).toBeInTheDocument();
    expect(screen.getByText("AI / ML")).toBeInTheDocument();
    expect(screen.getByText("Cloud & Infrastructure")).toBeInTheDocument();
  });

  it("renders individual skill pills", () => {
    render(<Skills />);
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("LangGraph")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
cd portfolio && npx vitest run app/components/__tests__/Skills.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Implement Skills.tsx**

```tsx
// app/components/Skills.tsx
import { skillsSystem } from "../galaxy/content";
import type { SkillCluster } from "../galaxy/content/types";

const clusters = (skillsSystem.planets as SkillCluster[]).filter(
  (p) => p.kind === "skillCluster"
);

export default function Skills() {
  return (
    <section id="skills" className="px-8 py-20 max-w-4xl mx-auto">
      <div className="h-px bg-[#1a1a1a] mb-12" />
      <p className="font-mono text-[10px] tracking-[4px] text-[#e63946] mb-8">
        SKILLS
      </p>
      <div className="flex flex-col gap-6">
        {clusters.map((c) => (
          <div key={c.id} className="grid grid-cols-[180px_1fr] gap-4 items-start">
            <span className="font-mono text-[10px] tracking-[2px] text-[#333] pt-1">
              {c.title}
            </span>
            <div className="flex flex-wrap gap-2">
              {c.items.map((item) => (
                <span
                  key={item}
                  className="font-mono text-[9px] tracking-[1px] border border-[#1f1f1f] rounded-sm px-2 py-1 text-[#444]"
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
```

- [ ] **Step 4: Run tests**

```bash
cd portfolio && npx vitest run app/components/__tests__/Skills.test.tsx
```

Expected: all 2 pass.

- [ ] **Step 5: Commit**

```bash
git add app/components/Skills.tsx app/components/__tests__/Skills.test.tsx
git commit -m "feat: skills section with grouped pill tags"
```

---

## Task 5: Build Footer / Contact

**Files:**
- Modify: `app/components/Footer.tsx`
- Test: `app/components/__tests__/Footer.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// app/components/__tests__/Footer.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "../Footer";

describe("Footer", () => {
  it("renders email link", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /email/i })).toHaveAttribute(
      "href",
      "mailto:wyp9mq@virginia.edu"
    );
  });

  it("renders LinkedIn and GitHub links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
cd portfolio && npx vitest run app/components/__tests__/Footer.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Implement Footer.tsx**

```tsx
// app/components/Footer.tsx
import { contactSystem } from "../galaxy/content";
import type { Beacon } from "../galaxy/content/types";

const beacons = (contactSystem.planets as Beacon[]).filter(
  (p) => p.kind === "beacon"
);

export default function Footer() {
  return (
    <footer id="contact" className="px-8 py-16 max-w-4xl mx-auto">
      <div className="h-px bg-[#1a1a1a] mb-12" />
      <p className="font-mono text-[10px] tracking-[4px] text-[#e63946] mb-6">
        CONTACT
      </p>
      <div className="flex flex-wrap gap-6">
        {beacons.map((b) => (
          <a
            key={b.id}
            href={b.href}
            target={b.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            aria-label={b.label}
            className="font-mono text-[11px] tracking-[2px] text-[#333] hover:text-[#e63946] transition-colors"
          >
            {b.label.toUpperCase()} ↗
          </a>
        ))}
      </div>
      <p className="font-mono text-[9px] tracking-[2px] text-[#1f1f1f] mt-12">
        © 2026 PRITHVI RAJ
      </p>
    </footer>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
cd portfolio && npx vitest run app/components/__tests__/Footer.test.tsx
```

Expected: all 2 pass.

- [ ] **Step 5: Commit**

```bash
git add app/components/Footer.tsx app/components/__tests__/Footer.test.tsx
git commit -m "feat: footer with contact links"
```

---

## Task 6: Run full test suite, delete galaxy, clean up

**Files:**
- Delete: `app/galaxy/` (entire directory)
- Modify: `app/layout.tsx`

- [ ] **Step 1: Run full test suite**

```bash
cd portfolio && npx vitest run
```

Expected: all tests pass. Fix any failures before proceeding.

- [ ] **Step 2: Delete the galaxy directory**

```bash
rm -rf portfolio/app/galaxy
```

- [ ] **Step 3: Update layout.tsx — remove Inter weights restriction, keep bg**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prithvi Raj · Software Engineer",
  description: "Software Engineer focused on applied AI and backend systems. CS @ UVA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Confirm build passes**

```bash
cd portfolio && npx next build
```

Expected: no errors. If import errors appear from deleted galaxy files, trace them in page.tsx and component files — they should all use `./galaxy/content` which we kept.

**Note:** The content files (`app/galaxy/content/`) are inside the galaxy directory. Since we're importing from them, do NOT delete `app/galaxy/content/`. Only delete the scene, hud, hooks, fallback, lib subdirectories and GalaxyApp.tsx/ClientHideOnHydrate.tsx/galaxy.css.

Revised delete command:
```bash
rm -rf portfolio/app/galaxy/scene
rm -rf portfolio/app/galaxy/hud
rm -rf portfolio/app/galaxy/hooks
rm -rf portfolio/app/galaxy/fallback
rm -rf portfolio/app/galaxy/lib
rm -f portfolio/app/galaxy/GalaxyApp.tsx
rm -f portfolio/app/galaxy/ClientHideOnHydrate.tsx
rm -f portfolio/app/galaxy/galaxy.css
```

- [ ] **Step 5: Re-run tests and build**

```bash
cd portfolio && npx vitest run && npx next build
```

Expected: all green.

- [ ] **Step 6: Check visually in browser** — scroll through all sections, test accordion, hover project cards, click nav links for smooth scroll.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: complete portfolio redesign — remove galaxy, clean layout"
```

---

## Task 7: Push branch

- [ ] **Step 1: Push to remote**

```bash
git push --set-upstream origin portfolio-redesign
```

- [ ] **Step 2: Verify Vercel preview deploys** (if Vercel is watching all branches) or merge to main if ready to ship.
