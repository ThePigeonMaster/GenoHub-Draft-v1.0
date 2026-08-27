"use client";

import { useMemo, useState } from "react";
import { Field, Modal, inputClass } from "@/components/Modal";
import { formatRm } from "@/lib/format";
import { paymentTerms } from "@/lib/catalog";
import type { InventoryItem, Order, PaymentTerms } from "@/lib/types";

type ApproveOrderModalProps = {
  order: Order;
  inventory: InventoryItem[];
  dispatchNote: string;
  busy: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    paymentTerms: PaymentTerms;
    dispatchNote: string;
  }) => void;
};

export function ApproveOrderModal({
  order,
  inventory,
  dispatchNote,
  busy,
  onClose,
  onConfirm,
}: ApproveOrderModalProps) {
  const [terms, setTerms] = useState<PaymentTerms>(order.paymentTerms);
  const [note, setNote] = useState(dispatchNote);
  const headroom = order.creditLimit - order.creditExposure;
  const creditOk = order.amount <= headroom;

  const allocation = useMemo(
    () =>
      order.lines.map((line) => {
        const sku = inventory.find((item) => item.id === line.skuId);
        const onHand = sku?.quantity ?? 0;
        return {
          ...line,
          onHand,
          ok: onHand >= line.qty,
          after: onHand - line.qty,
          reorderPoint: sku?.reorderPoint ?? 0,
        };
      }),
    [inventory, order.lines],
  );

  const stockOk = allocation.every((line) => line.ok);
  const canRelease = creditOk && stockOk && note.trim().length > 0;

  return (
    <Modal
      title={`Release ${order.quotationId}`}
      subtitle={`${order.partnerName} · ${formatRm(order.amount)} · credit ${terms}`}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Credit limit</p>
            <p className="mt-1 font-mono text-sm text-slate-100">{formatRm(order.creditLimit)}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Exposure</p>
            <p className="mt-1 font-mono text-sm text-slate-100">{formatRm(order.creditExposure)}</p>
          </div>
          <div className={`rounded-xl border p-3 ${creditOk ? "border-emerald-400/30 bg-emerald-400/5" : "border-rose-400/40 bg-rose-400/5"}`}>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Headroom</p>
            <p className={`mt-1 font-mono text-sm ${creditOk ? "text-emerald-300" : "text-rose-300"}`}>
              {formatRm(headroom)}
            </p>
          </div>
        </div>

        <Field label="Credit terms">
          <select className={inputClass} value={terms} onChange={(event) => setTerms(event.target.value as PaymentTerms)}>
            {paymentTerms.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
        </Field>

        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
            Inventory lock
          </p>
          <div className="overflow-hidden rounded-xl border border-slate-800">
            {allocation.map((line) => (
              <div
                key={line.skuId}
                className="flex items-center justify-between border-b border-slate-800 px-3 py-2 last:border-b-0"
              >
                <div>
                  <p className="text-sm text-slate-200">{line.sku}</p>
                  <p className="text-[11px] text-slate-500">{line.name}</p>
                </div>
                <p className={`font-mono text-xs ${line.ok ? "text-cyan-300" : "text-rose-300"}`}>
                  lock {line.qty} · on hand {line.onHand} → {line.after}
                </p>
              </div>
            ))}
          </div>
          {!stockOk ? (
            <p className="mt-2 text-xs text-rose-300">Insufficient stock to lock allocation.</p>
          ) : null}
        </div>

        <Field label="Fulfillment dispatch note">
          <input className={inputClass} value={note} onChange={(event) => setNote(event.target.value)} />
        </Field>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canRelease || busy}
            onClick={() => onConfirm({ paymentTerms: terms, dispatchNote: note.trim() })}
            className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)] transition hover:bg-cyan-300 disabled:opacity-40"
          >
            Verify & release
          </button>
        </div>
      </div>
    </Modal>
  );
}
