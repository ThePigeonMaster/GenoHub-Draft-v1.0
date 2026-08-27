"use client";

import { StatusBadge } from "@/components/StatusBadge";
import { Tooltip } from "@/components/Tooltip";
import type { InventoryItem } from "@/lib/types";

type InventoryTableProps = {
  items: InventoryItem[];
  pendingIds: Set<string>;
  onRestock: (id: string) => void;
};

export function InventoryTable({ items, pendingIds, onRestock }: InventoryTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur">
      <div className="border-b border-slate-800 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-100">
          Consumable lots <span className="font-mono text-slate-500">({items.length})</span>
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-950/60">
            <tr>
              {["SKU", "On hand", "Supplier", "BOM / formulation", "Action"].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const low = item.quantity <= item.reorderPoint;
              const busy = pendingIds.has(item.id);
              return (
                <tr
                  key={item.id}
                  className="border-t border-slate-800/80 align-top transition duration-200 hover:bg-cyan-400/5"
                >
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-semibold text-slate-100">{item.name}</p>
                    <p className="font-mono text-[11px] text-cyan-400/80">
                      {item.sku}
                      {item.kitSize ? ` · ${item.kitSize}-rxn` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className={`font-mono text-sm ${low ? "text-rose-300" : "text-emerald-300"}`}>
                      {item.quantity} {item.unit}
                    </p>
                    <p className="text-[11px] text-slate-500">Threshold {item.reorderPoint}</p>
                    {item.lastLot ? (
                      <p className="font-mono text-[10px] text-slate-600">
                        {item.lastLot} · +{item.lastBatchQty}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-300">
                    {item.brand}
                    <p className="text-[11px] text-slate-500">{item.supplier}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <ul className="space-y-1">
                      {item.formulation.map((param) => (
                        <li key={param.label} className="flex items-center text-[12px] text-slate-400">
                          <span className="text-slate-500">{param.label}:</span>
                          <span className="ml-1 font-mono text-slate-200">{param.value}</span>
                          <Tooltip label={`${param.label} details`} text={param.hint} />
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => onRestock(item.id)}
                      className="rounded-lg bg-emerald-400 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-[0_0_16px_rgba(52,211,153,0.3)] transition hover:bg-emerald-300 disabled:opacity-40"
                    >
                      Inbound
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
