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
