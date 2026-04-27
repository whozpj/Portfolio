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

  it("has at least one active status in experience", () => {
    const exp = systems.find(s => s.id === "experience")!;
    const active = exp.planets.find(p => p.kind === "experience" && p.status === "active");
    expect(active).toBeDefined();
  });
});
