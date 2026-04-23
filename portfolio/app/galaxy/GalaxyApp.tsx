"use client";

import { useCallback, useMemo, useState } from "react";
import { useWebGLSupport } from "./hooks/useWebGLSupport";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { useDocking } from "./hooks/useDocking";
import Scene from "./scene/Scene";
import HUD from "./hud/HUD";
import ProgressBar from "./hud/ProgressBar";
import DetailPanel from "./hud/DetailPanel";
import QuickJump from "./hud/QuickJump";
import ResumeSummary from "./hud/ResumeSummary";
import SystemCard from "./hud/SystemCard";
import { systems } from "./content";
import { systemIndexAt, progressForSystem, GALAXY_END } from "./lib/scroll";

export default function GalaxyApp() {
  const webgl = useWebGLSupport();
  const reducedMotion = useReducedMotion();
  const enabled = webgl === true && !reducedMotion;

  const { progress, progressRef } = useScrollProgress(enabled);
  const docking = useDocking();
  const [resumeOpen, setResumeOpen] = useState(false);

  const currentIndex = useMemo(() => systemIndexAt(progress), [progress]);

  const jumpToSystem = useCallback((id: string) => {
    const idx = systems.findIndex(s => s.id === id);
    if (idx === -1) return;
    const el = document.documentElement;
    const max = el.scrollHeight - el.clientHeight;
    window.scrollTo({ top: progressForSystem(idx) * max, behavior: "smooth" });
  }, []);

  const handleStarClick = useCallback((systemId: string) => {
    if (systemId === "about") setResumeOpen(true);
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* progressRef drives the canvas (no re-renders); progress state drives DOM overlays */}
      <Scene progressRef={progressRef} onPlanetClick={docking.dock} onStarClick={handleStarClick} />
      <HUD progress={progress} systemIndex={currentIndex} onJumpToSystem={jumpToSystem} onOpenResume={() => setResumeOpen(true)} />
      <SystemCard
        systemIndex={currentIndex}
        visible={progress > GALAXY_END}
        onPlanetClick={docking.dock}
        onOpenResume={() => setResumeOpen(true)}
      />
      <ProgressBar currentIndex={currentIndex} onJump={jumpToSystem} />
      <DetailPanel planetId={docking.dockedPlanetId} onClose={docking.undock} />
      <QuickJump
        onJumpToSystem={jumpToSystem}
        onJumpToPlanet={(id) => {
          const s = systems.find(sys => sys.planets.some(p => p.id === id));
          if (!s) return;
          jumpToSystem(s.id);
          setTimeout(() => docking.dock(id), 600);
        }}
      />
      <ResumeSummary open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
