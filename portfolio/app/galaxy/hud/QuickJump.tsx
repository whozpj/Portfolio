"use client";

import { useEffect, useMemo, useState } from "react";
import { systems } from "../content";

interface Props {
  onJumpToSystem: (id: string) => void;
  onJumpToPlanet: (planetId: string) => void;
}

export default function QuickJump({ onJumpToSystem, onJumpToPlanet }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const items = useMemo(() => {
    const base: { label: string; kind: "system" | "planet"; id: string; system?: string }[] = [];
    for (const s of systems) {
      base.push({ label: s.title, kind: "system", id: s.id });
      for (const p of s.planets) {
        base.push({ label: p.label, kind: "planet", id: p.id, system: s.title });
      }
    }
    if (!q.trim()) return base;
    const t = q.toLowerCase();
    return base.filter(i => i.label.toLowerCase().includes(t));
  }, [q]);

  if (!open) return null;

  return (
    <div className="pointer-events-auto fixed inset-0 z-40 flex items-start justify-center pt-24 bg-black/60 backdrop-blur" onClick={() => setOpen(false)}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-md bg-[#0a0a12] border border-neutral-800 shadow-xl">
        <input
          autoFocus
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Jump to..."
          className="w-full bg-transparent border-b border-neutral-800 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none"
        />
        <ul className="max-h-80 overflow-y-auto">
          {items.map(i => (
            <li key={`${i.kind}:${i.id}`}>
              <button
                onClick={() => {
                  setOpen(false);
                  if (i.kind === "system") onJumpToSystem(i.id);
                  else onJumpToPlanet(i.id);
                }}
                className="w-full text-left px-4 py-2 hover:bg-neutral-900 flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-neutral-200">{i.label}</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                  {i.kind === "system" ? "System" : i.system}
                </span>
              </button>
            </li>
          ))}
          {items.length === 0 ? (
            <li className="px-4 py-3 text-sm text-neutral-500">No matches.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
