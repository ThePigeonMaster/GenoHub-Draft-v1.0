"use client";

import type { AppView } from "@/lib/types";

const items: { id: AppView; label: string; caption: string }[] = [
  { id: "overview", label: "Command", caption: "Live ops picture" },
  { id: "orders", label: "Orders", caption: "Credit & dispatch" },
  { id: "inventory", label: "Inventory", caption: "Lots & BOM" },
  { id: "tenders", label: "Tenders", caption: "Bid desk" },
  { id: "equipment", label: "Equipment", caption: "Assets & BOM" },
];

type SidebarProps = {
  active: AppView;
  onChange: (view: AppView) => void;
};

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-cyan-400/10 bg-slate-950/90 text-slate-300 md:min-h-full md:w-64 md:border-b-0 md:border-r">
      <div className="flex items-center gap-3 border-b border-white/5 px-4 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
          <span className="font-mono text-sm font-bold text-cyan-300">GH</span>
        </div>
        <div>
          <p className="text-[15px] font-semibold tracking-tight text-white">GenoHub</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-500/80">Sapphire</p>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 py-3 md:flex-1 md:flex-col md:overflow-visible md:py-4">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`min-w-[9.5rem] rounded-xl px-3 py-2.5 text-left transition-all duration-200 md:min-w-0 ${
                isActive
                  ? "bg-cyan-400/10 text-cyan-100 ring-1 ring-cyan-400/30 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
              }`}
            >
              <span className="block text-sm font-semibold tracking-tight">{item.label}</span>
              <span className="mt-0.5 hidden font-mono text-[10px] uppercase tracking-widest text-slate-500 md:block">
                {item.caption}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
