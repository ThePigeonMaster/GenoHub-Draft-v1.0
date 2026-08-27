"use client";

type TooltipProps = {
  label: string;
  text: string;
};

export function Tooltip({ label, text }: TooltipProps) {
  return (
    <span className="group relative inline-flex items-center">
      <button
        type="button"
        aria-label={label}
        className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 font-mono text-[9px] font-bold text-cyan-300 ring-1 ring-cyan-400/30 transition hover:bg-cyan-400 hover:text-slate-950"
      >
        i
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 translate-y-1 scale-95 rounded-xl bg-slate-950 px-3 py-2.5 text-left text-[11px] font-medium leading-relaxed text-slate-100 opacity-0 shadow-[0_0_24px_rgba(34,211,238,0.15)] ring-1 ring-cyan-400/20 transition-all duration-200 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
