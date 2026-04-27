"use client";
export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-[#0a0a0a] border-b border-[#111]">
      <span className="font-mono text-sm tracking-[4px] text-white">PR</span>
      <div className="flex gap-6 font-mono text-[10px] tracking-[2px] text-[#333]">
        <a href="#experience" className="hover:text-[#e63946] transition-colors">EXPERIENCE</a>
        <a href="#projects" className="hover:text-[#e63946] transition-colors">PROJECTS</a>
        <a href="#contact" className="text-[#e63946]">CONTACT ↗</a>
      </div>
    </nav>
  );
}
