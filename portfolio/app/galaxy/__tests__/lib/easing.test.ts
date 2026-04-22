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
