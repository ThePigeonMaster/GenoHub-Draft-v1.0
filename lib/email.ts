import { formatRm } from "./format";
import type { EmailDraft, InventoryItem, Tender } from "./types";

export function lowStockEmail(item: InventoryItem): EmailDraft {
  const shortfall = Math.max(item.reorderPoint - item.quantity, item.reorderPoint);
  return {
    kind: "low-stock-po",
    to: item.supplierEmail,
    cc: "ops@pigeonhub.example",
    subject: `[PigeonHub] Auto-PO draft — ${item.sku} below threshold`,
    body: [
      `Supplier: ${item.supplier}`,
      `SKU: ${item.sku} · ${item.name}`,
      `On hand: ${item.quantity} ${item.unit}`,
      `Low-stock threshold: ${item.reorderPoint} ${item.unit}`,
      `Suggested replenishment: ${shortfall} ${item.unit}`,
      `Brand: ${item.brand}`,
      "",
      "This is a simulated dispatch. Confirm to queue the PO notification.",
    ].join("\n"),
  };
}

export function awardEmail(tender: Tender): EmailDraft {
  const margin = tender.valueRm - tender.estimatedCogs;
  const marginPct = tender.valueRm === 0 ? 0 : (margin / tender.valueRm) * 100;
  return {
    kind: "tender-award",
    to: "commercial@pigeonhub.example",
    cc: "finance@pigeonhub.example, compliance@pigeonhub.example",
    subject: `[PigeonHub] Award notice — ${tender.reference}`,
    body: [
      `Buyer: ${tender.buyer}`,
      `Title: ${tender.title}`,
      `Contract value: ${formatRm(tender.valueRm)}`,
      `Estimated COGS: ${formatRm(tender.estimatedCogs)}`,
      `Projected gross margin: ${formatRm(margin)} (${marginPct.toFixed(1)}%)`,
      "",
      "Compliance pack must be frozen before kickoff. This is a simulated stakeholder notification.",
    ].join("\n"),
  };
}
