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
