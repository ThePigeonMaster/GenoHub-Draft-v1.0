"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InventoryTable } from "@/components/InventoryTable";
import { KPICards } from "@/components/KPICards";
import { OrderTable } from "@/components/OrderTable";
import { Sidebar } from "@/components/Sidebar";
import { KPICardsSkeleton, TableSkeleton } from "@/components/Skeleton";
import { EquipmentList } from "@/components/EquipmentList";
import { TenderTable } from "@/components/TenderTable";
import { fallbackInventory, fallbackOrders, fallbackTenders } from "@/lib/fallback-data";
import {
  fetchOperationsData,
  persistInventoryQuantity,
  persistOrderStatus,
  persistTenderStatus,
} from "@/lib/operations";
import type { AppView, ConnectionMode, InventoryItem, Order, Tender } from "@/lib/types";

const titles: Record<AppView, { heading: string; sub: string }> = {
  overview: { heading: "Operations overview", sub: "Sales, stock risk, and tender pipeline" },
  orders: { heading: "Order management", sub: "Approve and track fulfillment" },
  inventory: { heading: "Inventory", sub: "Consumable kits and formulation parameters" },
  tenders: { heading: "Tender management", sub: "Review submissions before award" },
  equipment: { heading: "Equipment", sub: "Assets and bill of materials" },
};

export function Dashboard() {
  const [view, setView] = useState<AppView>("overview");
  const [mode, setMode] = useState<ConnectionMode>("loading");
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [busyOrders, setBusyOrders] = useState<Set<string>>(new Set());
  const [busyInventory, setBusyInventory] = useState<Set<string>>(new Set());
  const [busyTenders, setBusyTenders] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchOperationsData()
      .then((data) => {
        if (cancelled) return;
        setOrders(data.orders);
        setInventory(data.inventory);
        setTenders(data.tenders);
        setMode(data.mode);
      })
      .catch(() => {
        if (cancelled) return;
        setOrders(fallbackOrders);
        setInventory(fallbackInventory);
        setTenders(fallbackTenders);
        setMode("demo");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const loading = mode === "loading";
  const page = titles[view];
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const approveOrder = useCallback(async (id: string) => {
    const previous = orders.find((order) => order.id === id);
    if (!previous || previous.status !== "Pending") return;

    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status: "Approved" } : order)),
    );
    setBusyOrders((current) => new Set(current).add(id));

    const { error } =
      modeRef.current === "live" ? await persistOrderStatus(id, "Approved") : { error: null };

    setBusyOrders((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });

    if (error) {
      setOrders((current) => current.map((order) => (order.id === id ? previous : order)));
      setNotice("Approve could not sync. The previous status was restored.");
    }
  }, [orders]);

  const restockItem = useCallback(
    async (id: string) => {
      const previous = inventory.find((item) => item.id === id);
      if (!previous) return;
      const nextQty = previous.quantity + 10;

      setInventory((current) =>
        current.map((item) => (item.id === id ? { ...item, quantity: nextQty } : item)),
      );
      setBusyInventory((current) => new Set(current).add(id));

      const { error } =
        modeRef.current === "live"
          ? await persistInventoryQuantity(id, nextQty)
          : { error: null };
      setBusyInventory((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });

      if (error) {
        setInventory((current) =>
          current.map((item) => (item.id === id ? previous : item)),
        );
        setNotice("Restock could not sync. On-hand quantity was restored.");
      }
    },
    [inventory],
  );

  const approveTender = useCallback(
    async (id: string) => {
      const previous = tenders.find((tender) => tender.id === id);
      if (!previous) return;

      setTenders((current) =>
        current.map((tender) =>
          tender.id === id ? { ...tender, status: "Approved" } : tender,
        ),
      );
      setBusyTenders((current) => new Set(current).add(id));

      const { error } =
        modeRef.current === "live"
          ? await persistTenderStatus(id, "Approved")
          : { error: null };
      setBusyTenders((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });

      if (error) {
        setTenders((current) =>
          current.map((tender) => (tender.id === id ? previous : tender)),
        );
        setNotice("Tender approve could not sync. Status was restored.");
      }
    },
    [tenders],
  );

  const badge = useMemo(() => {
    if (mode === "loading") {
      return { label: "Loading…", className: "bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200/80" };
    }
    if (mode === "live") {
      return {
        label: "Live · Supabase",
        className: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80 shadow-[0_0_12px_rgba(16,185,129,0.16)]",
      };
    }
    return {
      label: "Demo data",
      className: "bg-amber-50 text-amber-800 ring-1 ring-amber-200/80 shadow-[0_0_12px_rgba(245,158,11,0.16)]",
    };
  }, [mode]);

  return (
    <div className="flex min-h-full flex-col bg-[linear-gradient(180deg,#fafafa_0%,#f4f4f5_45%,#f1f5f9_100%)] text-zinc-800 md:flex-row">
      <Sidebar active={view} onChange={setView} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/60 bg-white/75 px-4 py-3.5 backdrop-blur-xl">
          <div>
            <h1 className="text-[15px] font-semibold tracking-tight text-zinc-900">{page.heading}</h1>
            <p className="text-[12px] font-medium text-zinc-500">{page.sub}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${badge.className}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {badge.label}
          </span>
        </header>

        <div className="flex-1 space-y-5 px-4 py-5 md:px-6 md:py-7">
          {notice ? (
            <div className="flex items-start justify-between rounded-xl border border-amber-200/70 bg-amber-50/90 px-3 py-2.5 text-xs font-medium text-amber-900 shadow-sm">
              <p>{notice}</p>
              <button
                type="button"
                className="ml-3 font-semibold transition-all duration-200 ease-in-out hover:text-amber-700"
                onClick={() => setNotice(null)}
              >
                Dismiss
              </button>
            </div>
          ) : null}

          {loading ? (
            <>
              <KPICardsSkeleton />
              <TableSkeleton />
            </>
          ) : (
            <>
              {(view === "overview" || view === "orders") && (
                <KPICards orders={orders} inventory={inventory} tenders={tenders} />
              )}
              {(view === "overview" || view === "orders") && (
                <OrderTable orders={orders} pendingIds={busyOrders} onApprove={approveOrder} />
              )}
              {(view === "overview" || view === "inventory") && (
                <InventoryTable
                  items={inventory}
                  pendingIds={busyInventory}
                  onRestock={restockItem}
                />
              )}
              {(view === "overview" || view === "tenders") && (
                <TenderTable
                  tenders={tenders}
                  pendingIds={busyTenders}
                  onReview={approveTender}
                />
              )}
              {(view === "overview" || view === "equipment") && <EquipmentList />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
