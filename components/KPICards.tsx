import { formatRm } from "@/lib/format";
import type { InventoryItem, Order, Tender } from "@/lib/types";

type KPICardsProps = {
  orders: Order[];
  inventory: InventoryItem[];
  tenders: Tender[];
};

export function KPICards({ orders, inventory, tenders }: KPICardsProps) {
  const book = orders.reduce((sum, order) => sum + order.amount, 0);
  const pending = orders.filter((order) => order.status === "Pending").length;
  const low = inventory.filter((item) => item.quantity <= item.reorderPoint).length;
  const pipeline = tenders.filter((tender) => tender.status !== "Awarded" && tender.status !== "Lost").length;

  const cards = [
    { label: "Order book", value: formatRm(book), hint: "Committed + pending", glow: "shadow-[0_0_24px_rgba(34,211,238,0.08)]" },
    { label: "Credit holds", value: String(pending), hint: "Awaiting release", glow: "shadow-[0_0_24px_rgba(251,191,36,0.08)]" },
    { label: "Low-stock SKUs", value: String(low), hint: "At or below threshold", glow: "shadow-[0_0_24px_rgba(251,113,133,0.08)]" },
    { label: "Live bids", value: String(pipeline), hint: "Not awarded / lost", glow: "shadow-[0_0_24px_rgba(52,211,153,0.08)]" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur transition duration-200 hover:border-cyan-400/30 ${card.glow}`}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
          <p className="mt-2 font-mono text-[1.6rem] font-semibold tracking-tight text-slate-50">{card.value}</p>
          <p className="mt-1.5 text-xs text-slate-500">{card.hint}</p>
        </div>
      ))}
    </div>
  );
}
