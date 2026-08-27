"use client";

import { useMemo, useState } from "react";
import { Field, Modal, inputClass } from "@/components/Modal";

type Lot = {
  id: string;
  lot: string;
  qty: number;
  exp: string;
};

type BomItem = {
  id: string;
  name: string;
  catNo: string;
  size: string;
  unit: string;
  perRun: string;
  lots: Lot[];
};

type Equipment = {
  id: string;
  name: string;
  refNumber: string;
  location: string;
  salespersonEmail: string;
  lastPpm: string;
  nextPpm: string;
  bom: BomItem[];
};

type StockFlag =
  | { kind: "oos"; catNo: string; label: string }
  | { kind: "expiring"; catNo: string; label: string; exp: string };

const MS_PER_DAY = 86_400_000;

const seedEquipments: Equipment[] = [
  {
    id: "eq-seahorse-xf-pro",
    name: "Agilent Seahorse XF Pro Analyzer Complete",
    refNumber: "2026001234",
    location: "FHMS UTAR Sg Long",
    salespersonEmail: "jingfong_ewe@genomax.com.my",
    lastPpm: "2026-05-10",
    nextPpm: "2027-05-10",
    bom: [
      {
        id: "bom-103680-100",
        name: "Seahorse XF DMEM assay medium pack",
        catNo: "103680-100",
        size: "1 bundle",
        unit: "500 mL",
        perRun: "100 mL",
        lots: [
          { id: "lot-1-0", lot: "testlot1.0", qty: 1, exp: "2026-08-30" },
          { id: "lot-1-1", lot: "testlot1.1", qty: 2, exp: "2026-12-30" },
        ],
      },
      {
        id: "bom-103792-100",
        name: "Seahorse XFe96/XF Pro FluxPak",
        catNo: "103792-100",
        size: "1 kit",
        unit: "12 plates",
        perRun: "1 plate",
        lots: [{ id: "lot-2-0", lot: "testlot2.0", qty: 1, exp: "2026-09-15" }],
      },
      {
        id: "bom-103015-100",
        name: "Seahorse XF Cell Mito Stress Test Kit",
        catNo: "103015-100",
        size: "1 kit",
        unit: "6 pouches",
        perRun: "1 pouch",
        lots: [],
      },
    ],
  },
  {
    id: "eq-novocyte",
    name: "Agilent NovoCyte Advanteon V5B7R4 (Demo Instrument)",
    refNumber: "2026002201",
    location: "Genomax Demo Lab",
    salespersonEmail: "jingfong_ewe@genomax.com.my",
    lastPpm: "2026-03-18",
    nextPpm: "2027-03-18",
    bom: [],
  },
  {
    id: "eq-nulisa",
    name: "Alamar BioScience NULISA™ platform",
    refNumber: "2026003308",
    location: "Core Proteomics",
    salespersonEmail: "jingfong_ewe@genomax.com.my",
    lastPpm: "2026-01-22",
    nextPpm: "2027-01-22",
    bom: [],
  },
  {
    id: "eq-cube30",
    name: "Diesse CUBE 30 ESR",
    refNumber: "2026004412",
    location: "Clinical Haematology",
    salespersonEmail: "jingfong_ewe@genomax.com.my",
    lastPpm: "2026-04-02",
    nextPpm: "2027-04-02",
    bom: [],
  },
];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseDay(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function daysUntil(iso: string, from = new Date()) {
  return Math.round((parseDay(iso).getTime() - startOfDay(from).getTime()) / MS_PER_DAY);
}

function isLotExpiring(lot: Lot, thresholdDays: number) {
  return lot.qty > 0 && daysUntil(lot.exp) <= thresholdDays;
}

function activeLots(item: BomItem) {
  return item.lots.filter((lot) => lot.qty > 0);
}

function onHandQty(item: BomItem) {
  return item.lots.reduce((sum, lot) => sum + lot.qty, 0);
}

function evaluateFlags(item: BomItem, thresholdDays: number): StockFlag | null {
  const lots = activeLots(item);
  if (lots.length === 0) {
    return { kind: "oos", catNo: item.catNo, label: `Cat# ${item.catNo}: stock not available` };
  }
  const expiring = lots
    .filter((lot) => isLotExpiring(lot, thresholdDays))
    .sort((a, b) => a.exp.localeCompare(b.exp));
  if (expiring[0]) {
    return {
      kind: "expiring",
      catNo: item.catNo,
      label: `Cat# ${item.catNo}: expiring on ${expiring[0].exp}`,
      exp: expiring[0].exp,
    };
  }
  return null;
}

function needsRestock(item: BomItem, thresholdDays: number) {
  const lots = activeLots(item);
  if (lots.length === 0) return true;
  return lots.every((lot) => isLotExpiring(lot, thresholdDays));
}

function restockCandidates(equipment: Equipment, thresholdDays: number) {
  const oos: BomItem[] = [];
  const expiring: BomItem[] = [];
  for (const item of equipment.bom) {
    if (!needsRestock(item, thresholdDays)) continue;
    if (activeLots(item).length === 0) oos.push(item);
    else expiring.push(item);
  }
  return [...oos, ...expiring];
}

export function EquipmentList() {
  const [equipments, setEquipments] = useState<Equipment[]>(seedEquipments);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expiryThresholdDays, setExpiryThresholdDays] = useState(30);
  const [restockOpen, setRestockOpen] = useState(false);
  const [inboundOpen, setInboundOpen] = useState(false);
  const [ppmOpen, setPpmOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const selected = equipments.find((row) => row.id === selectedId) ?? null;
  const flags = selected
    ? selected.bom.map((item) => evaluateFlags(item, expiryThresholdDays)).filter((flag): flag is StockFlag => Boolean(flag))
    : [];

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 4200);
  }

  function updatePpm(payload: { equipmentId: string; nextPpm: string; completedBy: string }) {
    setEquipments((current) =>
      current.map((machine) => {
        if (machine.id !== payload.equipmentId) return machine;
        return {
          ...machine,
          lastPpm: new Date().toISOString().split("T")[0],
          nextPpm: payload.nextPpm,
        };
      })
    );
    showToast(`PPM completed by ${payload.completedBy}. Next PPM updated to ${payload.nextPpm}`);
  }

  function inboundLot(payload: {
    equipmentId: string;
    refNumber: string;
    catNo: string;
    lot: string;
    qty: number;
    exp: string;
  }) {
    setEquipments((current) =>
      current.map((machine) => {
        if (machine.id !== payload.equipmentId) return machine;
        return {
          ...machine,
          refNumber: payload.refNumber.trim() || machine.refNumber,
          bom: machine.bom.map((item) => {
            if (item.catNo !== payload.catNo) return item;
            return {
              ...item,
              lots: [
                ...item.lots,
                {
                  id: `lot-${payload.catNo}-${Date.now()}`,
                  lot: payload.lot.trim(),
                  qty: payload.qty,
                  exp: payload.exp,
                },
              ],
            };
          }),
        };
      }),
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-[0_0_40px_rgba(15,23,42,0.45)] backdrop-blur">
      <div className="border-b border-slate-800 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-100">
          Equipment assets <span className="font-mono text-slate-500">({equipments.length})</span>
        </h2>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
          Master data · BOM · lot / expiry · restock routing
        </p>
      </div>

      {selected ? (
        <EquipmentDetail
          equipment={selected}
          expiryThresholdDays={expiryThresholdDays}
          flags={flags}
          onThresholdChange={setExpiryThresholdDays}
          onBack={() => {
            setSelectedId(null);
            setRestockOpen(false);
            setInboundOpen(false);
            setPpmOpen(false);
          }}
          onRestock={() => setRestockOpen(true)}
          onInbound={() => setInboundOpen(true)}
          onOpenPpm={() => setPpmOpen(true)}
        />
      ) : (
        <EquipmentTable rows={equipments} onOpen={(id) => setSelectedId(id)} />
      )}

      {selected && restockOpen ? (
        <RestockRequestModal
          equipment={selected}
          thresholdDays={expiryThresholdDays}
          onClose={() => setRestockOpen(false)}
          onSent={() => {
            setRestockOpen(false);
            showToast("Your message has been received! Email sent successfully!");
          }}
        />
      ) : null}

      {selected && inboundOpen ? (
        <InboundDoModal
          equipment={selected}
          onClose={() => setInboundOpen(false)}
          onSave={(payload) => {
            inboundLot({ ...payload, equipmentId: selected.id });
            setInboundOpen(false);
            showToast(`Inbound posted for Cat# ${payload.catNo}. Stock engine refreshed.`);
          }}
        />
      ) : null}

      {selected && ppmOpen ? (
        <PpmCompleteModal
          equipment={selected}
          onClose={() => setPpmOpen(false)}
          onConfirm={(payload) => {
            updatePpm({ ...payload, equipmentId: selected.id });
            setPpmOpen(false);
          }}
        />
      ) : null}

      {toast ? (
        <div className="fixed bottom-5 right-5 z-[60] max-w-sm rounded-xl border border-emerald-400/40 bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(16,185,129,0.45)]">
          {toast}
        </div>
      ) : null}
    </section>
  );
}

function EquipmentTable({
  rows,
  onOpen,
}: {
  rows: Equipment[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px]">
        <thead className="bg-slate-950/60">
          <tr>
            {["Machine", "DO / Ref", "Location", "Last PPM", "Next PPM", "Action"].map((heading) => (
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
          {rows.map((machine) => (
            <tr
              key={machine.id}
              className="border-t border-slate-800/80 transition duration-200 hover:bg-cyan-400/5"
            >
              <td className="px-4 py-3.5 text-sm font-semibold text-slate-100">{machine.name}</td>
              <td className="px-4 py-3.5 font-mono text-xs text-cyan-200">{machine.refNumber}</td>
              <td className="px-4 py-3.5 text-sm text-slate-300">{machine.location}</td>
              <td className="px-4 py-3.5 font-mono text-xs text-slate-400">{machine.lastPpm}</td>
              <td className="px-4 py-3.5 font-mono text-xs text-slate-400">{machine.nextPpm}</td>
              <td className="px-4 py-3.5">
                <button
                  type="button"
                  onClick={() => onOpen(machine.id)}
                  className="rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-[0_0_16px_rgba(34,211,238,0.35)] transition hover:bg-cyan-300"
                >
                  View/Formulate BOM & Stock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EquipmentDetail({
  equipment,
  expiryThresholdDays,
  flags,
  onThresholdChange,
  onBack,
  onRestock,
  onInbound,
  onOpenPpm,
}: {
  equipment: Equipment;
  expiryThresholdDays: number;
  flags: StockFlag[];
  onThresholdChange: (value: number) => void;
  onBack: () => void;
  onRestock: () => void;
  onInbound: () => void;
  onOpenPpm: () => void;
}) {
  return (
    <div className="space-y-5 px-5 py-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-400/80 transition hover:text-cyan-200"
          >
            ← Equipment list
          </button>
          <h3 className="mt-2 text-base font-semibold text-slate-50">{equipment.name}</h3>
          <p className="mt-1 font-mono text-xs text-slate-400">
            Ref {equipment.refNumber} · {equipment.location}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Sales route <span className="font-mono text-cyan-300">{equipment.salespersonEmail}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onRestock}
            className="rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-[0_0_16px_rgba(34,211,238,0.35)] transition hover:bg-cyan-300"
          >
            Request for Restock
          </button>
          <button
            type="button"
            onClick={onInbound}
            className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/20"
          >
            Inbound New DO
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetaCard label="Last PPM" value={equipment.lastPpm} />
        
        {/* Next PPM 带 [Completed] 按钮 */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 flex flex-col justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Next PPM</p>
            <p className="mt-1 font-mono text-sm text-slate-100">{equipment.nextPpm}</p>
          </div>
          <div className="mt-2">
            <button
              type="button"
              onClick={onOpenPpm}
              className="rounded bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition"
            >
              [Completed]
            </button>
          </div>
        </div>

        <label className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
            Expiry threshold (days)
          </span>
          <input
            className={`${inputClass} mt-2`}
            type="number"
            min={1}
            value={expiryThresholdDays}
            onChange={(event) => onThresholdChange(Math.max(1, Number(event.target.value) || 1))}
          />
        </label>
      </div>

      {flags.length > 0 ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-rose-300">Stock engine *</p>
          <ul className="mt-2 space-y-1 text-sm text-rose-300">
            {flags.map((flag) => (
              <li key={flag.catNo}>
                * {flag.label}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-200">
          No expiry or stock gaps inside the current threshold.
        </p>
      )}

      {equipment.bom.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-500">
          BOM not formulated for this asset yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full min-w-[860px]">
            <thead className="bg-slate-950/60">
              <tr>
                {["Reagent / BOM", "Cat#", "Size / unit", "Per run", "Lots", "On hand"].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {equipment.bom.map((item) => {
                const flag = evaluateFlags(item, expiryThresholdDays);
                return (
                  <tr key={item.id} className="border-t border-slate-800/80 align-top">
                    <td className="px-4 py-3.5 text-sm text-slate-100">{item.name}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-cyan-300">{item.catNo}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-400">
                      {item.size} · {item.unit}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-400">{item.perRun}</td>
                    <td className="px-4 py-3.5">
                      {item.lots.length === 0 ? (
                        <span className="font-mono text-[11px] text-rose-300">No lots</span>
                      ) : (
                        <ul className="space-y-1">
                          {item.lots.map((lot) => {
                            const hot = isLotExpiring(lot, expiryThresholdDays);
                            return (
                              <li key={lot.id} className="font-mono text-[11px] text-slate-400">
                                {lot.lot} · qty {lot.qty} · exp {lot.exp}
                                {hot ? <span className="ml-1 text-rose-300">*</span> : null}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs">
                      <span className={onHandQty(item) === 0 ? "text-rose-300" : "text-emerald-300"}>
                        {onHandQty(item)}
                      </span>
                      {flag ? <p className="mt-1 text-[10px] text-rose-300">*</p> : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 font-mono text-sm text-slate-100">{value}</p>
    </div>
  );
}

// PPM 完成确认弹窗
function PpmCompleteModal({
  equipment,
  onClose,
  onConfirm,
}: {
  equipment: Equipment;
  onClose: () => void;
  onConfirm: (payload: { nextPpm: string; completedBy: string }) => void;
}) {
  const [completedBy, setCompletedBy] = useState("Beh Meng Hua");
  const [nextPpm, setNextPpm] = useState("");

  const canConfirm = nextPpm.trim().length > 0;

  return (
    <Modal
      title="Complete PPM Service"
      subtitle={`Equipment: ${equipment.name}`}
      onClose={onClose}
    >
      <div className="space-y-4">
        <Field label="Completed by">
          <select
            className={inputClass}
            value={completedBy}
            onChange={(e) => setCompletedBy(e.target.value)}
          >
            <option value="Beh Meng Hua">Beh Meng Hua</option>
            <option value="David Chung Tze Yang">David Chung Tze Yang</option>
          </select>
        </Field>

        <Field label="Next PPM date">
          <input
            className={inputClass}
            type="date"
            value={nextPpm}
            onChange={(e) => setNextPpm(e.target.value)}
            style={{ colorScheme: "dark" }}
          />
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
            disabled={!canConfirm}
            onClick={() => onConfirm({ nextPpm, completedBy })}
            className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-40"
          >
            Confirm PPM Complete
          </button>
        </div>
      </div>
    </Modal>
  );
}

// 升级版 RestockRequestModal：带国家代码、>8位电话校验、真实邮件发送及自由可编辑的 To / Cc 输入框
function RestockRequestModal({
  equipment,
  thresholdDays,
  onClose,
  onSent,
}: {
  equipment: Equipment;
  thresholdDays: number;
  onClose: () => void;
  onSent: () => void;
}) {
  const lines = useMemo(() => restockCandidates(equipment, thresholdDays), [equipment, thresholdDays]);
  const [endUser, setEndUser] = useState("");
  const [countryCode, setCountryCode] = useState("+60");
  const [phone, setPhone] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  // 核心：让 To 和 Cc 变成绝对可自由输入的 State
  const [emailTo, setEmailTo] = useState(equipment.salespersonEmail || "jingfong_ewe@genomax.com.my");
  const [emailCc, setEmailCc] = useState("genomaxstaff@gmail.com");

  const [qtyByCat, setQtyByCat] = useState<Record<string, number>>(() =>
    Object.fromEntries(lines.map((item) => [item.catNo, 1])),
  );

  const rawDigits = phone.replace(/[^0-9]/g, "");
  const isPhoneValid = rawDigits.length >= 8;
  const canSend = endUser.trim().length > 0 && isPhoneValid && lines.length > 0 && emailTo.trim() !== "" && !isSending;

  const body = [
    "Dear GTMY Team,",
    "",
    `I am ${endUser.trim() || "[End-User Name]"} from ${equipment.location}. We require restock of these reagents for our ${equipment.name}:`,
    ...lines.map(
      (item, index) => `${index + 1}. cat# ${item.catNo} [qty: ${qtyByCat[item.catNo] ?? 1}]`,
    ),
    "",
    "Thanks and regards",
    "",
    endUser.trim() || "[End-User Name]",
    "",
    `GTMY DO Ref: ${equipment.refNumber}`,
  ].join("\n");

  const handleSendEmail = async () => {
    if (!canSend) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailTo,
          cc: emailCc,
          subject: `Restock Request - Ref ${equipment.refNumber}`,
          text: body,
        }),
      });

      if (res.ok) {
        alert("Email sent successfully!");
        onSent();
      } else {
        alert("Failed to send email via server.");
        setIsSending(false);
      }
    } catch (err) {
      console.error(err);
      alert("Network error while sending email.");
      setIsSending(false);
    }
  };

  return (
    <Modal
      title="Request for restock"
      subtitle="Smart filter: out of stock, or every remaining lot is inside the expiry threshold"
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="End-user name">
            <input
              className={inputClass}
              value={endUser}
              onChange={(event) => setEndUser(event.target.value)}
              placeholder="Name on the request"
            />
          </Field>
          
          <Field label="Phone number (mandatory)">
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="+60">+60</option>
                <option value="+65">+65</option>
                <option value="+62">+62</option>
                <option value="+86">+86</option>
              </select>
              <input
                className={`${inputClass} flex-1`}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="e.g. 4-8294019"
              />
            </div>
            {!isPhoneValid && phone.length > 0 && (
              <span className="text-[10px] text-rose-400 mt-1 block">Must be at least 8 digits</span>
            )}
          </Field>
        </div>

        {/* 真正完全解锁、可自由输入的 To 和 Cc 输入框区域 */}
        <div className="bg-slate-900 border border-cyan-500/40 rounded-lg p-3 space-y-2 text-sm font-mono shadow-inner">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 w-8 text-xs font-bold">To:</span>
            <input 
              type="email"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 w-8 text-xs font-bold">Cc:</span>
            <input 
              type="email"
              value={emailCc}
              onChange={(e) => setEmailCc(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {lines.length === 0 ? (
          <p className="text-sm text-emerald-200">No restock lines. Healthy backup lots remain on all BOM items.</p>
        ) : (
          <div className="space-y-2">
            {lines.map((item) => (
              <div
                key={item.catNo}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 px-3 py-2"
              >
                <div>
                  <p className="font-mono text-xs text-cyan-200">cat# {item.catNo}</p>
                  <p className="text-[11px] text-slate-500">{item.name}</p>
                </div>
                <input
                  className={`${inputClass} w-20`}
                  type="number"
                  min={1}
                  value={qtyByCat[item.catNo] ?? 1}
                  onChange={(event) =>
                    setQtyByCat((current) => ({
                      ...current,
                      [item.catNo]: Math.max(1, Number(event.target.value) || 1),
                    }))
                  }
                />
              </div>
            ))}
          </div>
        )}

        <pre className="whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-950/70 p-3 font-mono text-[11px] leading-relaxed text-slate-300">
          {body}
        </pre>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSend}
            onClick={handleSendEmail}
            className="rounded-lg bg-emerald-400 px-3 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.35)] disabled:opacity-40"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function InboundDoModal({
  equipment,
  onClose,
  onSave,
}: {
  equipment: Equipment;
  onClose: () => void;
  onSave: (payload: { refNumber: string; catNo: string; lot: string; qty: number; exp: string }) => void;
}) {
  const firstCat = equipment.bom[0]?.catNo ?? "";
  const [refNumber, setRefNumber] = useState("");
  const [catNo, setCatNo] = useState(firstCat);
  const [lot, setLot] = useState("");
  const [qty, setQty] = useState(1);
  const [exp, setExp] = useState("");

  const canSave =
    equipment.bom.length > 0 &&
    refNumber.trim().length > 0 &&
    catNo.length > 0 &&
    lot.trim().length > 0 &&
    qty >= 1 &&
    exp.length > 0;

  return (
    <Modal
      title="Inbound new DO"
      subtitle={`Scan simulation · ${equipment.name}`}
      onClose={onClose}
    >
      {equipment.bom.length === 0 ? (
        <p className="text-sm text-slate-400">This asset has no BOM lines to receive against.</p>
      ) : (
        <div className="space-y-4">
          <Field label="DO / Ref number">
            <input
              className={inputClass}
              value={refNumber}
              onChange={(event) => setRefNumber(event.target.value)}
              placeholder="Scan or key new DO"
            />
          </Field>
          <Field label="Catalog #">
            <select className={inputClass} value={catNo} onChange={(event) => setCatNo(event.target.value)}>
              {equipment.bom.map((item) => (
                <option key={item.catNo} value={item.catNo}>
                  {item.catNo} — {item.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Lot">
              <input className={inputClass} value={lot} onChange={(event) => setLot(event.target.value)} />
            </Field>
            <Field label="Size qty">
              <input
                className={inputClass}
                type="number"
                min={1}
                value={qty}
                onChange={(event) => setQty(Math.max(1, Number(event.target.value) || 1))}
              />
            </Field>
            <Field label="Expiration date">
              <input
                className={inputClass}
                type="date"
                value={exp}
                onChange={(event) => setExp(event.target.value)}
                style={{ colorScheme: "dark" }}
              />
            </Field>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canSave}
              onClick={() => onSave({ refNumber, catNo, lot, qty, exp })}
              className="rounded-lg bg-emerald-400 px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-40"
            >
              Post inbound lot
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}