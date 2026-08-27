"use client";

import { StatusBadge } from "@/components/StatusBadge";
import { formatPct, formatRm } from "@/lib/format";
import type { Tender } from "@/lib/types";

type TenderTableProps = {
  tenders: Tender[];
  pendingIds: Set<string>;
  onReview: (id: string) => void;
};

export function TenderTable({ tenders, pendingIds, onReview }: TenderTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur">
      <div className="border-b border-slate-800 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-100">Bid desk</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px]">
          <thead className="bg-slate-950/60">
            <tr>
              {["Reference", "Buyer", "Margin", "Status", "Action"].map((heading) => (
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
            {tenders.map((tender) => {
              const busy = pendingIds.has(tender.id);
              const margin = tender.valueRm - tender.estimatedCogs;
              const marginPct = tender.valueRm === 0 ? 0 : (margin / tender.valueRm) * 100;
              const canReview = tender.status === "Submitted" || tender.status === "Draft" || tender.status === "Shortlisted";
              return (
                <tr
                  key={tender.id}
                  className="border-t border-slate-800/80 transition duration-200 hover:bg-cyan-400/5"
                >
                  <td className="px-4 py-3.5">
                    <p className="font-mono text-sm text-cyan-200">{tender.reference}</p>
                    <p className="text-[11px] text-slate-500">Due {tender.dueDate}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-200">
                    {tender.buyer}
                    <p className="text-[11px] text-slate-500">{tender.title}</p>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-emerald-300">
                    {formatRm(margin)}
                    <p className="text-slate-500">{formatPct(marginPct)} GM</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={tender.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    {canReview ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onReview(tender.id)}
                        className="rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-[0_0_16px_rgba(34,211,238,0.35)] transition hover:bg-cyan-300 disabled:opacity-40"
                      >
                        Review
                      </button>
                    ) : (
                      <span className="font-mono text-[10px] uppercase tracking-widest text-slate-600">closed</span>
                    )}
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
