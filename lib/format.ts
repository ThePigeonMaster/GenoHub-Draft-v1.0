export function formatRm(value: number, fractionDigits = 0) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatPct(value: number) {
  return `${value.toFixed(1)}%`;
}

export function nextDispatchNote(existing: string[]) {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const seq = existing.length + 1;
  return `DN-${stamp}-${String(seq).padStart(3, "0")}`;
}
