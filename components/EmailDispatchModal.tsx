"use client";

import { Modal } from "@/components/Modal";
import type { EmailDraft } from "@/lib/types";

type EmailDispatchModalProps = {
  draft: EmailDraft;
  onClose: () => void;
  onSend: () => void;
};

export function EmailDispatchModal({ draft, onClose, onSend }: EmailDispatchModalProps) {
  return (
    <Modal
      title="Auto-email dispatch"
      subtitle={draft.kind === "low-stock-po" ? "Supplier PO notification" : "Internal award notification"}
      onClose={onClose}
    >
      <div className="space-y-3 font-mono text-xs">
        <p className="text-slate-400">
          To <span className="text-cyan-300">{draft.to}</span>
        </p>
        <p className="text-slate-400">
          Cc <span className="text-cyan-300">{draft.cc}</span>
        </p>
        <p className="text-slate-200">{draft.subject}</p>
        <pre className="whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-[11px] leading-relaxed text-slate-300">
          {draft.body}
        </pre>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={onSend}
            className="rounded-lg bg-emerald-400 px-3 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.35)]"
          >
            Queue send
          </button>
        </div>
      </div>
    </Modal>
  );
}
