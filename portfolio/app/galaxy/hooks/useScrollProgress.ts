"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

/**
 * Returns:
 *  - progressRef: a ref updated every Lenis tick — safe to read inside useFrame without triggering re-renders
 *  - progress: React state version for DOM overlays (HUD, ProgressBar) — updated on scroll events only
 */
export function useScrollProgress(enabled: boolean): {
  progress: number;
  progressRef: React.MutableRefObject<number>;
} {
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({ smoothWheel: true, duration: 1.2 });

    lenis.on("scroll", ({ progress: p }: { progress: number }) => {
      progressRef.current = p;
      setProgress(p);
    });

    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [enabled]);

  return { progress, progressRef };
}
