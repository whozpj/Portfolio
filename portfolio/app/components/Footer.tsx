import { contactSystem } from "../galaxy/content";
import type { Beacon } from "../galaxy/content/types";

const beacons = (contactSystem.planets as Beacon[]).filter(
  (p) => p.kind === "beacon"
);

export default function Footer() {
  return (
    <footer id="contact" className="px-8 py-10 px-16">
      <div className="h-px bg-[#1a1a1a] mb-8" />
      <p className="font-mono text-[10px] tracking-[4px] text-[#e63946] mb-6">
        CONTACT
      </p>
      <div className="flex flex-wrap gap-6">
        {beacons.map((b) => (
          <a
            key={b.id}
            href={b.href}
            target={b.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            aria-label={b.label}
            className="font-mono text-[11px] tracking-[2px] text-[#333] hover:text-[#e63946] transition-colors"
          >
            {b.label.toUpperCase()} ↗
          </a>
        ))}
      </div>
      <p className="font-mono text-[9px] tracking-[2px] text-[#1f1f1f] mt-8">
        © 2026 PRITHVI RAJ
      </p>
    </footer>
  );
}
