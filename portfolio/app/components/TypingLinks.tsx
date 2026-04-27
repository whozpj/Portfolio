"use client";

import { useState, useEffect } from "react";

const LINKS = [
  { label: "github.com/whozpj", href: "https://github.com/whozpj" },
  { label: "linkedin.com/in/prithvi-raj-7015a0250", href: "https://www.linkedin.com/in/prithvi-raj-7015a0250/" },
  { label: "pypi.org/project/argus-sdk", href: "https://pypi.org/project/argus-sdk/" },
  { label: "wyp9mq@virginia.edu", href: "mailto:wyp9mq@virginia.edu" },
];

const TYPE_SPEED = 40;
const DELETE_SPEED = 20;
const PAUSE_AFTER = 2000;

export default function TypingLinks() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    const target = LINKS[index].label;

    if (phase === "typing") {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), TYPE_SPEED);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("deleting"), PAUSE_AFTER);
        return () => clearTimeout(t);
      }
    }

    if (phase === "deleting") {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), DELETE_SPEED);
        return () => clearTimeout(t);
      } else {
        setIndex((i) => (i + 1) % LINKS.length);
        setPhase("typing");
      }
    }
  }, [displayed, phase, index]);

  const current = LINKS[index];

  return (
    <div className="flex flex-col justify-center h-full pl-16">
      <p className="font-mono text-[10px] tracking-[4px] text-[#333] mb-6">FIND ME AT</p>
      <div className="flex items-center gap-3">
        <span className="text-[#e63946] font-mono text-sm select-none">›</span>
        <a
          href={current.href}
          target={current.href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="font-mono text-2xl font-light text-white hover:text-[#e63946] transition-colors"
        >
          {displayed}
        </a>
        <span className="w-[2px] h-7 bg-[#e63946] animate-pulse" />
      </div>
      <div className="flex gap-2 mt-8">
        {LINKS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIndex(i); setDisplayed(""); setPhase("typing"); }}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? "bg-[#e63946]" : "bg-[#333]"}`}
            aria-label={`Switch to link ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
