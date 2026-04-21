# Portfolio Galaxy — Design Spec

**Date:** 2026-04-21
**Branch:** `portfolio-galaxy`
**Dev route:** `/galaxy` (existing `/` preserved until switch)
**Status:** approved through brainstorming; implementation plan next

---

## 1. Goal

Rebuild the personal portfolio (`/Users/prithviraj/Documents/CS/Portfolio/portfolio`) as a scroll-driven WebGL galaxy. The site is not a resume page with decoration — the site **is** the interaction.

**Success criteria:**
- A first-time visitor lands, sees the portfolio laid out as a distant galaxy, scrolls, and experiences each section as a discrete solar system.
- A recruiter can find the resume and contact details within 5 seconds via a persistent HUD.
- The site feels closer to *50-jahre-hitparade.ch* than to a bootstrapped template.
- Mobile visitors get a coherent, reduced-motion fallback that preserves the cosmic identity.

---

## 2. Organizing metaphor

**The portfolio is a galaxy. Each section is a solar system. Each solar system's star is the section header. Planets orbiting the star are the items in that section.**

Scroll moves a virtual camera through the galaxy: from a wide establishing view down into each system in sequence, then out and on to the next. There are no free-flight controls; scroll is the only driver.

---

## 3. Information architecture

### The five systems

| # | System | Star (header) | Planets (items) | Accent |
|---|---|---|---|---|
| 01 | About | "Prithvi Raj" — bio hub | Location, current focus, status ("open to Summer/Fall 2026 internships") | white |
| 02 | Experience | "Experience" | ManTech (active), Candlefish (active), MyEdMaster (past), IBM (incoming — rendered as approaching comet) | `#c4b5fd` violet |
| 03 | Projects | "Projects" | FeatherDB, GitGuard, MLB Pitcher Injury Predictor, Animal Behavior Recognition | `#fbbf24` amber |
| 04 | Skills | "Skills" | 5 category clusters (Languages, Frameworks, AI/ML, Infrastructure, Certifications) — each cluster is a planet with orbiting moonlets for individual techs | `#67e8f9` cyan |
| 05 | Contact | "Contact" | GitHub, LinkedIn, Email, Resume — rendered as deep-space beacons | `#fca5a5` coral |

Copy is reused verbatim from the current site. New copy is a separate pass.

### The galaxy view (frame 0)

Visible only at top of page. Shows all five systems as distant labeled stars arranged across a diagonal galactic dust band. The name "Prithvi Raj" and a one-line subtitle ("CS · UVA · SWE & Applied AI") overlay the top. A "scroll to traverse" hint sits at the bottom.

Stars in the galaxy view are clickable — clicking any star scroll-animates directly to that system (recruiter escape hatch; no forced linear scroll).

---

## 4. User journey

Scroll-driven linear narrative. The camera animates through these states as the viewport scrolls:

1. **0% — Galaxy view.** All five systems visible as distant clusters. Name overlay.
2. **~10–18% — Approach About.** Camera moves toward the first system. Other systems fade.
3. **~18–30% — Inside About.** Star resolves to name/bio hub. Planets of small facts orbit.
4. **~30–34% — Transit.** Camera leaves About and drifts toward Experience.
5. **~34–52% — Inside Experience.** Star = "EXPERIENCE." Planets = roles. Planet visuals distinguish current vs past; IBM renders as a comet on an elliptical approach.
6. **Same pattern** for Projects, Skills, Contact.
7. **100% — Contact reached.** Subtle "end of system" indicator. Persistent HUD still offers resume/contact.

**Persistent HUD** (always on, top-right corner):
- `[ Resume ]` link — direct PDF download
- `[ Contact ]` scroll-snap to Contact system
- `[ Home ]` scroll-snap to top
- Bottom-center: progress bar of 5 ticks, current system highlighted

**Docking (expanded read):**
Clicking a planet pauses scroll hijack and "docks" the camera at that planet. The planet renders large, off-center; expanded copy (role bullets, project how-it-works/design/challenges) reveals on the opposite side. While docked, page scroll is routed to the detail panel's internal scroll (not to the galaxy camera), so long content is readable. `ESC` or click on empty space returns to system orbit and re-engages camera scroll.

---

## 5. Visual system

- **Palette:** near-black `#030308` background, white stars, per-system accent colors (see table above). Muted purples/blues for nebula atmospherics.
- **Typography:**
  - Headings: sans-serif display, weight 200–300, wide letter-spacing for titles, tight for names.
  - Body: sans-serif, weight 400 at small sizes for readability.
  - HUD and technical labels: monospace (`ui-monospace`, system-mono stack), 9–10px, 0.25em letter-spacing, uppercase.
  - No decorative typefaces. Contrast comes from scale and weight, not fonts.
- **Motion:**
  - Planet orbits animate continuously. Orbital speed encodes recency: current roles orbit fastest, past roles slower, comet on elliptical path.
  - Scroll transitions are eased (`easeOutCubic`). No linear 1:1 scroll.
  - Nebulae drift in the background.
- **Imagery:** No photos, no logos, no stock illustrations. Everything is WebGL-rendered. The only raster asset is the resume PDF and potentially a favicon.

---

## 6. Interaction details

- **Galaxy-view stars:** clickable; scroll-animate to the associated system.
- **Planets in a system:** clickable; camera docks, detail panel reveals on the side.
- **Keyboard:** `ESC` undocks a planet. Arrow keys move to neighbor planets while docked. `Cmd+K` / `Ctrl+K` opens a quick-jump command palette (list of systems + planets).
- **Scroll:** hijacked via Lenis for smooth buttery scroll. `prefers-reduced-motion` disables hijack (see §8).
- **Cursor:** default OS cursor. No custom glow. Hoverable elements get subtle opacity/scale feedback.

---

## 7. Tech stack

- **Framework:** Next.js 16 (existing) with the App Router.
- **3D:** `three` + `@react-three/fiber` + `@react-three/drei`.
- **Scroll:** `@studio-freight/lenis` (or current `lenis`) for smooth scroll; `framer-motion`'s `useScroll` for progress values.
- **Motion (DOM overlays):** `framer-motion` (existing).
- **Styling:** Tailwind 4 (existing). Global tokens in `globals.css`.
- **Typescript:** strict.
- **Data:** content lives in a typed module under `app/galaxy/content/` (one file per system). No CMS.

---

## 8. Accessibility & fallbacks

- **`prefers-reduced-motion: reduce`:** no scroll hijack, no orbital animation. Instead, render each system as a stacked 2D layout — still cosmic-styled (dark background, accent-colored headers, monospace HUD) — but static. All content reachable.
- **Screen readers:** each system has semantic `<section>` with heading, and planets have semantic child elements. Canvas overlays use `aria-hidden="true"`; the DOM overlay carries the real text.
- **Keyboard:** full navigation via tab order + arrow keys. Every planet is a focusable button.
- **No-JS / SSR fallback:** the page's server-rendered HTML is the 2D stacked layout (semantic sections, headings, full text content). On hydration, if WebGL2 is available and `prefers-reduced-motion` is not set, the client replaces the 2D layout with the WebGL galaxy canvas + DOM overlays. The WebGL scene is never part of the server output.
- **Low GPU / WebGL2 missing:** detect on mount; keep the 2D layout in place, never mount the canvas.

---

## 9. Mobile

Mobile viewports (<768px width) render the 2D stacked layout. The galaxy canvas is desktop-only; the cosmic identity is preserved through typography, palette, and static starfield backgrounds on each section.

Scroll on mobile is native (not hijacked). Each section is full-viewport-height with its system illustration + content below. IBM comet is a static illustration; "orbits" are represented as dotted concentric circles with planets pinned to them.

---

## 10. Scope cuts (v1)

Explicitly **not** in v1 to keep scope finite:

- Server-side rendering of the full galaxy scene (ship client-side-rendered first).
- Multi-language.
- Audio / ambient sound.
- AI chatbot (removed entirely; can return later as an "AI terminal" satellite).
- Project-specific inner pages beyond the docked detail panel.
- Analytics beyond Vercel defaults.
- Tests for the visual scene itself. Unit tests only for pure data/transform modules.

---

## 11. Rollout

1. Build on branch `portfolio-galaxy`, expose at `/galaxy` while `/` continues to serve the current site.
2. Internal review (user previews, iterates).
3. When user approves, swap: rename `/galaxy` → `/`, remove old Hero/ChatBot/CursorGlow components, redirect legacy anchors.
4. Merge branch to `main`, deploy.

---

## 12. Open questions (to resolve during implementation, not blockers)

- Exact starfield density and depth (tune visually).
- Whether orbital speeds for past roles should be frozen or very slow.
- Whether the "About" system should be skipped and its content merged into the galaxy landing overlay (current plan: keep it).
- Resume PDF source and placement (needs user to confirm the file to ship).
