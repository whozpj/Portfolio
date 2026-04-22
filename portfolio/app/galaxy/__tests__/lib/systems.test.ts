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
