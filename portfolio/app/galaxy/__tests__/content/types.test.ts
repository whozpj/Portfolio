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
