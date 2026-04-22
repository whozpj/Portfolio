import SystemSection from "./SystemSection";
import { systems } from "../content";

export default function StackedLayout() {
  return (
    <div className="min-h-screen bg-[#030308] text-white selection:bg-white selection:text-black">
      <header className="pt-24 pb-16 text-center px-6">
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-500">
          The portfolio of
        </p>
        <h1 className="mt-3 text-5xl md:text-7xl font-extralight tracking-[0.15em] text-white">
          Prithvi Raj
        </h1>
        <p className="mt-4 text-xs font-mono tracking-[0.25em] uppercase text-neutral-500">
          CS · UVA · SWE &amp; Applied AI
        </p>
      </header>
      {systems.map(s => <SystemSection key={s.id} system={s} />)}
    </div>
  );
}
