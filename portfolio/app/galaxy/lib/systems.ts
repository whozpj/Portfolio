import type { SystemId } from "../content/types";
import { systems } from "../content";

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
