"use client";

import { useMemo, useState } from "react";
import { Field, Modal, inputClass } from "@/components/Modal";
import { formatPct, formatRm } from "@/lib/format";
import type { Tender, TenderStatus } from "@/lib/types";

type TenderReviewModalProps = {
  tender: Tender;
  busy: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    status: Extract<TenderStatus, "Shortlisted" | "Awarded">;
    estimatedCogs: number;
    compliance: Tender["compliance"];
  }) => void;
};

export function TenderReviewModal({ tender, busy, onClose, onConfirm }: TenderReviewModalProps) {
  const [status, setStatus] = useState<Extract<TenderStatus, "Shortlisted" | "Awarded">>(
    tender.status === "Awarded" ? "Awarded" : "Shortlisted",
  );
  const [cogs, setCogs] = useState(tender.estimatedCogs);
  const [compliance, setCompliance] = useState(tender.compliance);

  const margin = tender.valueRm - cogs;
  const marginPct = tender.valueRm === 0 ? 0 : (margin / tender.valueRm) * 100;
  const requiredDone = compliance.filter((item) => item.done).length;
  const awardBlocked = status === "Awarded" && compliance.some((item) => !item.done);

  const next = useMemo(() => (status === "Awarded" ? "Awarded" : "Shortlisted"), [status]);

  return (
    <Modal
      title={`Bid review · ${tender.reference}`}
      subtitle={`${tender.buyer} · ${tender.title}`}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Bid value</p>
            <p className="mt-1 font-mono text-sm text-slate-100">{formatRm(tender.valueRm)}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Est. COGS</p>
            <p className="mt-1 font-mono text-sm text-slate-100">{formatRm(cogs)}</p>
          </div>
          <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Gross margin</p>
            <p className="mt-1 font-mono text-sm text-cyan-300">
              {formatRm(margin)} · {formatPct(marginPct)}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Decision">
            <select
              className={inputClass}
              value={next}
              onChange={(event) => setStatus(event.target.value as "Shortlisted" | "Awarded")}
            >
              <option value="Shortlisted">Shortlisted — commercial shortlist</option>
              <option value="Awarded">Awarded — contract win</option>
            </select>
          </Field>
          <Field label="Estimated COGS (RM)">
            <input
              className={inputClass}
              type="number"
              min={0}
              value={cogs}
              onChange={(event) => setCogs(Number(event.target.value))}
            />
          </Field>
        </div>

        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
            Compliance pack {requiredDone}/{compliance.length}
          </p>
          <div className="space-y-2">
            {compliance.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() =>
                    setCompliance((current) =>
                      current.map((row) => (row.id === item.id ? { ...row, done: !row.done } : row)),
                    )
                  }
                  className="h-4 w-4 accent-cyan-400"
                />
                {item.label}
              </label>
            ))}
          </div>
          {awardBlocked ? (
            <p className="mt-2 text-xs text-amber-300">
              Award is blocked until every compliance item is cleared.
            </p>
          ) : null}
        </div>

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
            disabled={busy || awardBlocked}
            onClick={() => onConfirm({ status: next, estimatedCogs: cogs, compliance })}
            className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)] disabled:opacity-40"
          >
            Commit {next.toLowerCase()}
          </button>
        </div>
      </div>
    </Modal>
  );
}
