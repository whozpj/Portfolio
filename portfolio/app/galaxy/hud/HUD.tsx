"use client";

import { useMemo } from "react";
import { systems } from "../content";
import { easeInOutCubic } from "../lib/easing";

interface Props {
  progress: number;
  onJumpToSystem: (id: string) => void;
}

const GALAXY_END = 0.08;

export default function HUD({ progress, onJumpToSystem }: Props) {
  const { currentSystemIndex, landingOpacity, inSystemOpacity } = useMemo(() => {
    const landing = progress <= GALAXY_END ? 1 - easeInOutCubic(progress / GALAXY_END) : 0;
    const remaining = progress > GALAXY_END ? (progress - GALAXY_END) / (1 - GALAXY_END) : 0;
    const N = systems.length - 1;
    const i = Math.min(Math.floor(remaining * N), N);
    return { currentSystemIndex: i, landingOpacity: landing, inSystemOpacity: progress > GALAXY_END ? 1 : 0 };
  }, [progress]);

  const current = systems[currentSystemIndex] ?? systems[0];

  return (
    <div className="pointer-events-none fixed inset-0 z-20">
      {/* Name overlay (landing) */}
      <div
        className="absolute top-16 left-1/2 -translate-x-1/2 text-center transition-opacity duration-300"
        style={{ opacity: landingOpacity }}
      >
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-500">
          The portfolio of
        </p>
        <h1 className="mt-3 text-4xl md:text-6xl font-extralight tracking-[0.15em] text-white">
          Prithvi Raj
        </h1>
        <p className="mt-3 text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-500">
          CS · UVA · SWE &amp; Applied AI
        </p>
      </div>

      {/* Top-right buttons (persistent) */}
      <div className="pointer-events-auto absolute top-4 right-4 flex gap-3 text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400">
        <a href="/resume.pdf" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">[ Resume ]</a>
        <button onClick={() => onJumpToSystem("contact")} className="hover:text-white transition-colors">[ Contact ]</button>
        <button onClick={() => onJumpToSystem("about")} className="hover:text-white transition-colors">[ Home ]</button>
      </div>

      {/* Scroll hint (landing) */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center transition-opacity duration-300"
        style={{ opacity: landingOpacity }}
      >
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-500">Scroll to traverse</p>
        <div className="mx-auto mt-2 h-7 w-px bg-gradient-to-b from-neutral-500 to-transparent" />
      </div>

      {/* Current system label (in-system) */}
      <div
        className="absolute top-16 left-1/2 -translate-x-1/2 text-center transition-opacity duration-300"
        style={{ opacity: inSystemOpacity }}
      >
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase" style={{ color: current.accentHex, opacity: 0.8 }}>
          System · 0{current.index + 1} of 05
        </p>
        <h2 className="mt-2 text-2xl font-light tracking-[0.2em] uppercase text-white">{current.title}</h2>
        {current.subtitle ? (
          <p className="mt-1 text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-500">{current.subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
