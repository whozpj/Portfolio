export default function Hero() {
  return (
    <section className="pt-40 pb-20 px-8 max-w-4xl mx-auto">
      <p className="font-mono text-[10px] tracking-[4px] text-[#e63946] mb-4">
        SOFTWARE ENGINEER · APPLIED AI · UVA
      </p>
      <h1 className="text-[72px] font-black leading-none tracking-[-3px] text-white">
        Prithvi<br />
        <span className="text-[#e63946]">Raj.</span>
      </h1>
      <p className="mt-5 text-[15px] text-[#444] font-light leading-relaxed max-w-md">
        I build AI systems that ship — LLM pipelines, agentic workflows, and the infrastructure to run them reliably.
      </p>
      <div className="flex items-center gap-6 mt-8">
        <a
          href="#experience"
          className="font-mono text-[10px] tracking-[2px] bg-[#e63946] text-black font-bold px-5 py-2.5 rounded-sm hover:bg-[#cc2f3b] transition-colors"
        >
          VIEW WORK ↓
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[10px] tracking-[2px] text-[#333] hover:text-[#e63946] transition-colors"
        >
          RESUME ↗
        </a>
      </div>
    </section>
  );
}
