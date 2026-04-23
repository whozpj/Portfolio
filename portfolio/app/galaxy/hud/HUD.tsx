"use client";

import { useMemo } from "react";
import { systems } from "../content";
import { easeInOutCubic } from "../lib/easing";

interface Props {
  progress: number;
  systemIndex: number;
  onJumpToSystem: (id: string) => void;
  onOpenResume?: () => void;
}

const GALAXY_END = 0.08;

export default function HUD({ progress, systemIndex, onJumpToSystem, onOpenResume }: Props) {
  const { landingOpacity, inSystemOpacity } = useMemo(() => {
    const landing = progress <= GALAXY_END ? 1 - easeInOutCubic(progress / GALAXY_END) : 0;
    return {
      landingOpacity: landing,
      inSystemOpacity: progress > GALAXY_END ? 1 : 0,
    };
  }, [progress]);

  const current = systems[systemIndex] ?? systems[0];

  return (
    <div className="pointer-events-none fixed inset-0 z-20">
      {/* ─── Persistent status chip (top-left) ─────────────────────────── */}
      <div className="pointer-events-auto absolute top-4 left-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        <span>Open · Summer / Fall 2026</span>
      </div>

      {/* ─── Top-right persistent nav ──────────────────────────────────── */}
      <div className="pointer-events-auto absolute top-4 right-4 flex gap-3 text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400">
        {onOpenResume ? (
          <button onClick={onOpenResume} className="hover:text-white transition-colors">[ Résumé ]</button>
        ) : (
          <a href="/resume.pdf" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">[ Résumé ]</a>
        )}
        <button onClick={() => onJumpToSystem("projects")} className="hover:text-white transition-colors">[ Projects ]</button>
        <button onClick={() => onJumpToSystem("experience")} className="hover:text-white transition-colors">[ Experience ]</button>
        <button onClick={() => onJumpToSystem("contact")} className="hover:text-white transition-colors">[ Contact ]</button>
      </div>

      {/* ─── Landing hero (fades out as you scroll past galaxy view) ───── */}
      <div
        className="absolute inset-x-0 top-0 flex flex-col items-center pt-[7vh] transition-opacity duration-300"
        style={{ opacity: landingOpacity }}
      >
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-500">
          The portfolio of
        </p>
        <h1 className="mt-3 text-5xl md:text-7xl font-extralight tracking-[0.12em] text-white">
          Prithvi Raj
        </h1>
        <p className="mt-4 text-xs md:text-sm font-mono tracking-[0.28em] uppercase text-neutral-400">
          Software Engineer · Applied AI · UVA CS
        </p>

        {/* Now / Incoming chip row */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-mono uppercase tracking-[0.22em]">
          <span className="flex items-center gap-1.5 text-neutral-300">
            <span className="h-1 w-1 rounded-full bg-violet-300" />
            Now · Candlefish
          </span>
          <span className="text-neutral-700">·</span>
          <span className="flex items-center gap-1.5 text-neutral-300">
            <span className="h-1 w-1 rounded-full bg-amber-200" />
            Incoming · Fannie Mae · IBM
          </span>
        </div>

        {/* Tagline */}
        <p className="mt-6 max-w-xl px-6 text-center text-sm md:text-base font-light leading-relaxed text-neutral-400">
          Shipping AI systems in production — from a LangGraph query engine cutting DoD search times
          20× to a PyTorch U-Net segmenting architectural blueprints at 0.89 mIoU.
        </p>

        {/* CTAs */}
        <div className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => (onOpenResume ? onOpenResume() : onJumpToSystem("experience"))}
            className="px-5 py-2 text-[11px] font-mono uppercase tracking-[0.25em] bg-white text-black hover:bg-neutral-200 transition-colors"
          >
            Read Résumé
          </button>
          <button
            onClick={() => onJumpToSystem("projects")}
            className="px-5 py-2 text-[11px] font-mono uppercase tracking-[0.25em] border border-neutral-700 text-neutral-300 hover:border-white hover:text-white transition-colors"
          >
            View Projects
          </button>
          <a
            href="mailto:wyp9mq@virginia.edu"
            className="px-5 py-2 text-[11px] font-mono uppercase tracking-[0.25em] border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
          >
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/prithvi-raj-7015a0250/"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2 text-[11px] font-mono uppercase tracking-[0.25em] border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/whozpj"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2 text-[11px] font-mono uppercase tracking-[0.25em] border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>

      {/* ─── Scroll hint (landing) ─────────────────────────────────────── */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center transition-opacity duration-300"
        style={{ opacity: landingOpacity }}
      >
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-500">
          Scroll to traverse the galaxy
          <span className="mx-3 text-neutral-700">·</span>
          Click the star for full résumé
        </p>
        <div className="mx-auto mt-2 h-7 w-px bg-gradient-to-b from-neutral-500 to-transparent" />
      </div>

      {/* ─── In-system: compact title block ────────────────────────────── */}
      <div
        className="absolute top-14 left-1/2 -translate-x-1/2 text-center transition-opacity duration-300"
        style={{ opacity: inSystemOpacity }}
      >
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase" style={{ color: current.accentHex, opacity: 0.85 }}>
          System · 0{current.index + 1} of 05
        </p>
        <h2 className="mt-2 text-2xl font-light tracking-[0.2em] uppercase text-white">{current.title}</h2>
        {current.subtitle ? (
          <p className="mt-1 text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-500">{current.subtitle}</p>
        ) : null}
      </div>

      {/* ─── Persistent bottom nav hint (in-system) ────────────────────── */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center transition-opacity duration-300"
        style={{ opacity: inSystemOpacity * 0.75 }}
      >
        <p className="text-[9px] font-mono tracking-[0.3em] uppercase text-neutral-500">
          <span>Scroll to traverse</span>
          <span className="mx-3 text-neutral-700">·</span>
          <span>Click a planet to dock</span>
          <span className="mx-3 text-neutral-700">·</span>
          <span className="text-neutral-400">⌘K</span>
          <span className="ml-1.5">to jump</span>
        </p>
      </div>
    </div>
  );
}
