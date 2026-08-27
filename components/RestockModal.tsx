"use client";

import { useMemo, useState } from "react";
import { Field, Modal, inputClass } from "@/components/Modal";
import { suppliers } from "@/lib/catalog";
import type { InventoryItem } from "@/lib/types";

type RestockModalProps = {
  item: InventoryItem;
  busy: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    brand: string;
    supplier: string;
    supplierEmail: string;
    batchQty: number;
    lot: string;
    expiryDate: string; // [新增] 必须包含效期，用于 FIFO 追踪
    reorderPoint: number;
  }) => void;
};

export function RestockModal({ item, busy, onClose, onConfirm }: RestockModalProps) {
  const initial = suppliers.find((row) => row.brand === item.brand) ?? suppliers[0];
  const [brand, setBrand] = useState(initial.brand);
  const [batchQty, setBatchQty] = useState(item.kitSize ?? 1);
  const [lot, setLot] = useState(`${item.sku}-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}`);
  const [expiryDate, setExpiryDate] = useState(""); // [新增] 效期状态
  const [reorderPoint, setReorderPoint] = useState(item.reorderPoint);

  const supplier = useMemo(
    () => suppliers.find((row) => row.brand === brand) ?? suppliers[0],
    [brand],
  );

  return (
    <Modal
      title={`Inbound restock · ${item.sku}`}
      subtitle={`${item.name} · on hand ${item.quantity} ${item.unit}`}
      onClose={onClose}
    >
      <div className="space-y-6">
        {/* 第一部分：供应商与入库基础信息 */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Brand / supplier">
            <select className={inputClass} value={brand} onChange={(event) => setBrand(event.target.value)}>
              {suppliers.map((row) => (
                <option key={row.brand} value={row.brand}>
                  {row.brand} — {row.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Supplier email">
            <input className={inputClass} value={supplier.email} readOnly />
          </Field>
        </div>

        {/* 第二部分：批次与效期追踪 (核心修改区) */}
        <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/10 p-4">
           <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-400">
            Lot & Expiry Registration
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={`Inbound Size (${item.kitSize ? 'Kits/Cases' : 'Units'})`}>
              <input
                className={inputClass}
                type="number"
                min={1}
                value={batchQty}
                onChange={(event) => setBatchQty(Number(event.target.value))}
              />
            </Field>
            <Field label="Lot / batch ID">
              <input className={inputClass} value={lot} onChange={(event) => setLot(event.target.value)} />
            </Field>
            <Field label="Expiration Date">
              <input 
                className={inputClass} 
                type="date" 
                value={expiryDate} 
                onChange={(event) => setExpiryDate(event.target.value)} 
                style={{ colorScheme: 'dark' }} // 适配深色主题的日历控件
              />
            </Field>
          </div>
        </div>

        {/* 第三部分：BOM 与消耗品拆包逻辑展示 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
              Formulation / Component BOM
            </p>
            <p className="text-[10px] text-cyan-500">
              1 Size = {item.components?.reduce((acc, curr) => acc + (curr.qtyPerKit || 0), 0) || 'N/A'} Total Units
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
            {item.components?.map((component) => (
              <div
                key={component.name}
                className="grid grid-cols-3 gap-2 border-b border-slate-800/80 px-3 py-2 text-xs last:border-b-0 hover:bg-slate-800 transition"
              >
                <span className="text-slate-300">{component.name}</span>
                <span className="font-mono text-cyan-400/90">{component.spec}</span>
                <span className="text-right font-mono text-slate-400">
                  {component.qtyPerKit} <span className="text-[10px]">per kit</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <Field label="Custom low-stock threshold (Unit Level)">
          <input
            className={inputClass}
            type="number"
            min={0}
            value={reorderPoint}
            onChange={(event) => setReorderPoint(Number(event.target.value))}
          />
        </Field>

        {/* 第四部分：操作按钮 */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy || batchQty < 1 || !lot.trim() || !expiryDate}
            onClick={() =>
              onConfirm({
                brand: supplier.brand,
                supplier: supplier.name,
                supplierEmail: supplier.email,
                batchQty,
                lot: lot.trim(),
                expiryDate, // 传递效期至上层组件/后端
                reorderPoint,
              })
            }
            className="rounded-lg bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition hover:bg-emerald-400 disabled:opacity-40"
          >
            Post inbound lot
          </button>
        </div>
      </div>
    </Modal>
  );
}