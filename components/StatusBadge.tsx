type Tone = "pending" | "ok" | "partial" | "warn" | "danger";

const tones: Record<Tone, string> = {
  pending: "bg-amber-400/10 text-amber-200 ring-1 ring-amber-400/30 shadow-[0_0_12px_rgba(251,191,36,0.2)]",
  ok: "bg-emerald-400/10 text-emerald-200 ring-1 ring-emerald-400/30 shadow-[0_0_12px_rgba(52,211,153,0.2)]",
  partial: "bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-400/30 shadow-[0_0_12px_rgba(34,211,238,0.2)]",
  warn: "bg-violet-400/10 text-violet-200 ring-1 ring-violet-400/30",
  danger: "bg-rose-400/10 text-rose-200 ring-1 ring-rose-400/30 shadow-[0_0_12px_rgba(251,113,133,0.2)]",
};

const dots: Record<Tone, string> = {
  pending: "bg-amber-400 animate-pulse",
  ok: "bg-emerald-400",
  partial: "bg-cyan-400",
  warn: "bg-violet-400",
  danger: "bg-rose-400",
};

export function statusTone(status: string): Tone {
  if (status === "Pending" || status === "Draft" || status === "Submitted") return "pending";
  if (status === "Approved" || status === "Fully Delivered" || status === "Awarded" || status === "Active") return "ok";
  if (status === "Partial Delivery" || status === "Shortlisted") return "partial";
  if (status === "Lost") return "danger";
  return "warn";
}

export function StatusBadge({ status }: { status: string }) {
  const tone = statusTone(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide ${tones[tone]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[tone]}`} />
      {status}
    </span>
  );
}
