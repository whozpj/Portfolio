"use client";

import { systems } from "../content";

interface Props {
  currentIndex: number;
  onJump: (id: string) => void;
}

export default function ProgressBar({ currentIndex, onJump }: Props) {
  return (
    <div className="pointer-events-auto fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 text-[9px] font-mono uppercase tracking-[0.25em] text-neutral-500">
      <span>About</span>
      {systems.map((s, i) => (
        <button
          key={s.id}
          onClick={() => onJump(s.id)}
          aria-label={`Jump to ${s.title}`}
          className="h-px w-6 transition-all"
          style={{
            background: i === currentIndex ? "#ffffff" : "rgba(255,255,255,0.15)",
            height: i === currentIndex ? 2 : 1,
          }}
        />
      ))}
      <span>Contact</span>
    </div>
  );
}
