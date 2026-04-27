# Portfolio Redesign — Design Spec
**Date:** 2026-04-26

## Overview
Replace the current Three.js galaxy portfolio with a clean, scroll-based single-page portfolio. Design direction: creative & polished, black background, large red accents (#e63946), white text. Bento-inspired layout on the hero, clean sections below.

---

## Visual Identity
- **Background:** #0a0a0a (near-black)
- **Accent:** #e63946 (red) — used large and deliberately, not sparingly
- **Text:** #fff primary, #444 secondary, #333 muted
- **Cards/cells:** #000 with #1a1a1a borders
- **Font:** System sans-serif for body, monospace for labels/tags/dates
- **Type scale:** Hero at 64px+ heavy weight, section labels 10px monospace all-caps

---

## Page Structure (single page, scroll-based)

### 1. Nav
- Left: monogram `PR`
- Right: `EXPERIENCE · PROJECTS · CONTACT ↗`
- Sticky, minimal, no background blur needed

### 2. Hero
- Eyebrow: `SOFTWARE ENGINEER · APPLIED AI · UVA` in red monospace
- Name: `Prithvi` / `Raj.` — large, heavy, `Raj.` in red
- Bio: one sentence, light weight, #444
- CTAs: `VIEW WORK ↓` (red filled button) + `RESUME ↗` (ghost text link)

### 3. Experience Section
- Section label: `EXPERIENCE` in red monospace
- Each role is a full-width accordion row:
  - Red dot indicator for active/current roles
  - Company name (red if active), role title, date on right, `›` chevron
  - Hover: subtle red border + dark bg
  - Click: chevron rotates 90°, detail panel slides open
  - Detail: bullet list with `—` red prefix, light text
  - Roles: ManTech (open by default), Candlefish, MyEdMaster

### 4. Projects Section
- Section label: `PROJECTS` in red monospace
- 2-column grid of cards (3 cards, last one spans or sits left-aligned)
- Each card: project name (large, bold), tag line (monospace, muted), one-line description, `VIEW PROJECT ↗` / `GITHUB ↗` link in red
- Cards: black bg, dark border, border glows red on hover
- Projects: Argus, GitGuard, FeatherDB

### 5. Skills Section
- Section label: `SKILLS` in red monospace
- Grouped by category (Languages, Frameworks, Cloud & Infra)
- Each category: label + pill tags (monospace, dark border, muted text)

### 6. Footer / Contact
- Simple: email link, LinkedIn, GitHub — monospace, red on hover
- Copyright line

---

## Interactions
- Experience accordion: smooth height transition on expand/collapse
- Project card: red border glow on hover (box-shadow)
- Nav links: smooth scroll to section
- All transitions: 150–200ms ease

---

## Implementation Notes
- Next.js app router, single `page.tsx` at root
- Replace current galaxy page entirely — delete `/app/galaxy` directory
- Reuse existing content files: `experience.ts`, `projects.ts`, `skills.ts`, `contact.ts`, `about.ts`
- No Three.js, no WebGL, no canvas — pure HTML/CSS/React
- Tailwind for layout, inline styles or CSS modules for custom values
- Framer Motion for accordion animation (already likely in deps, otherwise CSS transitions)
- Keep existing `ResumeSummary` modal or replace with direct PDF link

---

## Out of Scope
- Dark/light mode toggle
- Animations beyond accordion + hover states
- Blog or writing section
- Mobile-specific layout changes (responsive but not redesigned for mobile)
