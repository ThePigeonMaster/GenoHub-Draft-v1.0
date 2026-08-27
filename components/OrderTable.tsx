"use client";

import { StatusBadge } from "@/components/StatusBadge";
import { formatRm } from "@/lib/format";
import type { Order } from "@/lib/types";

type OrderTableProps = {
  orders: Order[];
  pendingIds: Set<string>;
  onApprove: (id: string) => void;
};

export function OrderTable({ orders, pendingIds, onApprove }: OrderTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-[0_0_40px_rgba(15,23,42,0.45)] backdrop-blur">
      <div className="border-b border-slate-800 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-100">
          Order release queue <span className="font-mono text-slate-500">({orders.length})</span>
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead className="bg-slate-950/60">
            <tr>
              {["Quotation", "Account", "Credit", "Commitment", "Status", "Action"].map((heading) => (
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
            {orders.map((order) => {
              const busy = pendingIds.has(order.id);
              const headroom = order.creditLimit - order.creditExposure;
              return (
                <tr
                  key={order.id}
                  className="border-t border-slate-800/80 transition duration-200 hover:bg-cyan-400/5"
                >
                  <td className="px-4 py-3.5">
                    <p className="font-mono text-sm text-cyan-200">{order.quotationId}</p>
                    <p className="text-[11px] text-slate-500">{order.invNumber}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-200">
                    {order.partnerName}
                    <p className="font-mono text-[11px] text-slate-500">{order.partnerCode}</p>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-300">
                    {formatRm(order.amount)}
                    <p className="text-[11px] text-slate-500">
                      {order.paymentTerms} · headroom {formatRm(headroom)}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-[11px] text-slate-400">
                    {order.lines.map((line) => `${line.sku}×${line.qty}`).join(" · ") || "—"}
                    {order.dispatchNote ? (
                      <p className="font-mono text-cyan-400/80">{order.dispatchNote}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    {order.status === "Pending" ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onApprove(order.id)}
                        className="rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-[0_0_16px_rgba(34,211,238,0.35)] transition hover:bg-cyan-300 disabled:opacity-40"
                      >
                        Release
                      </button>
                    ) : (
                      <span className="font-mono text-[10px] uppercase tracking-widest text-slate-600">locked</span>
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
