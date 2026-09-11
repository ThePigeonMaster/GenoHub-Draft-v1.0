"use client";
import React, { useState, useEffect } from 'react';

type StyleType = 'MG' | 'MGEN';

interface QuoteItem {
  id: string;
  catNo: string;
  desc: string;
  qty: number;
  price: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let newItemCounter = 0;
function createEmptyItem(): QuoteItem {
  newItemCounter += 1;
  return {
    id: `new-${Date.now()}-${newItemCounter}`,
    catNo: '',
    desc: '',
    qty: 1,
    price: 0,
  };
}

function formatCurrency(value: number): string {
  return value.toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Renders a multi-line item description, styling any "Size:" sub-line in italic
 *  to match the reference quotations. */
function DescriptionLines({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) => (
        <div key={i} className={i === 0 ? '' : 'italic text-gray-600'}>
          {line || '\u00A0'}
        </div>
      ))}
    </>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-500/80 mb-1">
      {children}
    </label>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400 border-b border-slate-700 pb-2 mb-4 mt-8 first:mt-0">
      {children}
    </h3>
  );
}

// ---------------------------------------------------------------------------
// Default seed data — mirrors the two reference quotations exactly
// ---------------------------------------------------------------------------

const MG_DEFAULTS = {
  quoteNo: '220049173',
  date: '19.02.2024',
  billTo:
    'Assc. Prof. Dr. Nurul Asma Abdullah\nHealth Campus\nUniversity Sains Malaysia\n16150 Kubang Kerian\nKelantan Darul Naim\nMalaysia',
  shipTo:
    'Assc. Prof. Dr. Nurul Asma Abdullah\nHealth Campus\nUniversity Sains Malaysia\n16150 Kubang Kerian\nKelantan Darul Naim\nMalaysia',
  phone: '+609-766 3000',
  fax: '',
  email: 'soledad0703@yahoo.com',
  validity: '20.03.2024',
  payment: 'Prepayment',
  delivery: '8',
  salesperson: 'Noel Wong',
  mobile: '90668514',
  items: [
    { id: 'item-1', catNo: 'BZS_041', desc: 'Cap Insert for 2 mL Cryogenic Vial, Red\nSize: 100 units/pack', qty: 2, price: 35.0 },
    { id: 'item-2', catNo: 'BZS_048', desc: 'Cap Insert for 2 mL Cryogenic Vial, Red\nSize: 100 units/pack', qty: 2, price: 35.0 },
    { id: 'item-3', catNo: 'BZS_051', desc: 'Cap Insert for 2 mL Cryogenic Vial, Red\nSize: 100 units/pack', qty: 2, price: 35.0 },
    { id: 'item-4', catNo: 'RG_PBS_03X', desc: 'PBS Concentrate, 10X\nSize: 1 L', qty: 1, price: 800.0 },
  ] as QuoteItem[],
};

const MGEN_DEFAULTS = {
  quoteNo: 'MPB/ 20-2565-32',
  date: '15 Apr 2026',
  billTo:
    "Mr. Rocky Vester Anak Richmond\nUKM Specialist Children's Hospital (HPKK)\nJalan Yaakob Latif,\nBandar Tun Razak\n56000 Cheras\nMalaysia",
  phone: '+6011-3656 5009',
  email: 'rockyvr96@gmail.com',
  validity: '90 days',
  payment: '30 days',
  delivery: '06-08',
  salesperson: 'Ngatijah bt Saimin',
  items: [
    { id: 'item-1', catNo: 'VR100', desc: 'Viral Nucleic Acid Extraction Kit II\nSize: 100 preps/kit', qty: 4, price: 997.5 },
    { id: 'item-2', catNo: 'MRX_1203103', desc: 'MiRXES BlitzAmp cDNA Synthesis System\nSize: 60 rxns', qty: 7, price: 1430.0 },
  ] as QuoteItem[],
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function QuotationModule() {
  const [style, setStyle] = useState<StyleType>('MG');

  const [quoteNo, setQuoteNo] = useState(MG_DEFAULTS.quoteNo);
  const [date, setDate] = useState(MG_DEFAULTS.date);
  const [billTo, setBillTo] = useState(MG_DEFAULTS.billTo);
  const [shipTo, setShipTo] = useState(MG_DEFAULTS.shipTo);
  const [phone, setPhone] = useState(MG_DEFAULTS.phone);
  const [fax, setFax] = useState(MG_DEFAULTS.fax);
  const [email, setEmail] = useState(MG_DEFAULTS.email);
  const [validity, setValidity] = useState(MG_DEFAULTS.validity);
  const [payment, setPayment] = useState(MG_DEFAULTS.payment);
  const [delivery, setDelivery] = useState(MG_DEFAULTS.delivery);
  const [salesperson, setSalesperson] = useState(MG_DEFAULTS.salesperson);
  const [mobile, setMobile] = useState(MG_DEFAULTS.mobile);
  const [items, setItems] = useState<QuoteItem[]>(MG_DEFAULTS.items);

  // Swap in the canonical demo data for whichever template is active. This
  // mirrors the two reference quotations exactly whenever the user toggles
  // style, so both templates always render a fully-populated, correct example.
  useEffect(() => {
    if (style === 'MGEN') {
      setQuoteNo(MGEN_DEFAULTS.quoteNo);
      setDate(MGEN_DEFAULTS.date);
      setBillTo(MGEN_DEFAULTS.billTo);
      setPhone(MGEN_DEFAULTS.phone);
      setEmail(MGEN_DEFAULTS.email);
      setValidity(MGEN_DEFAULTS.validity);
      setPayment(MGEN_DEFAULTS.payment);
      setDelivery(MGEN_DEFAULTS.delivery);
      setSalesperson(MGEN_DEFAULTS.salesperson);
      setItems(MGEN_DEFAULTS.items);
    } else {
      setQuoteNo(MG_DEFAULTS.quoteNo);
      setDate(MG_DEFAULTS.date);
      setBillTo(MG_DEFAULTS.billTo);
      setShipTo(MG_DEFAULTS.shipTo);
      setPhone(MG_DEFAULTS.phone);
      setFax(MG_DEFAULTS.fax);
      setEmail(MG_DEFAULTS.email);
      setValidity(MG_DEFAULTS.validity);
      setPayment(MG_DEFAULTS.payment);
      setDelivery(MG_DEFAULTS.delivery);
      setSalesperson(MG_DEFAULTS.salesperson);
      setMobile(MG_DEFAULTS.mobile);
      setItems(MG_DEFAULTS.items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style]);

  const handlePrint = () => window.print();

  // --- Items editor actions --------------------------------------------------
  const addItem = () => setItems((prev) => [...prev, createEmptyItem()]);
  const removeItem = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));
  function updateItem<K extends keyof Omit<QuoteItem, 'id'>>(id: string, field: K, value: QuoteItem[K]) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }

  const subtotal = items.reduce((acc, item) => acc + item.qty * item.price, 0);

  const inputClass =
    'w-full bg-slate-800 text-white p-2 border border-slate-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400';
  const smallInputClass =
    'w-full bg-slate-900 text-white p-1.5 border border-slate-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400';

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex gap-6">
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      {/* ================= Control Panel (hidden on print) ================= */}
      <div className="w-1/3 bg-slate-900 border border-slate-700 rounded-xl p-6 overflow-y-auto h-[90vh] print:hidden">
        <h2 className="text-xl font-bold text-white mb-6">
          <span className="text-cyan-400">Quotation</span> Generator
        </h2>

        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setStyle('MG')}
            className={`flex-1 py-2 rounded font-bold text-sm transition-colors ${
              style === 'MG' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            MG Style
          </button>
          <button
            onClick={() => setStyle('MGEN')}
            className={`flex-1 py-2 rounded font-bold text-sm transition-colors ${
              style === 'MGEN' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            MGEN Style
          </button>
        </div>

        {/* ---------- Document Details ---------- */}
        <SectionHeading>Document Details</SectionHeading>
        <div className="space-y-4">
          <div>
            <FieldLabel>Quotation No.</FieldLabel>
            <input className={inputClass} value={quoteNo} onChange={(e) => setQuoteNo(e.target.value)} placeholder="Quotation No" />
          </div>
          <div>
            <FieldLabel>Date</FieldLabel>
            <input className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date" />
          </div>
          <div>
            <FieldLabel>Validity</FieldLabel>
            <input
              className={inputClass}
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
              placeholder="e.g. 20.03.2024 or 90 days"
            />
          </div>
        </div>

        {/* ---------- Client Information ---------- */}
        <SectionHeading>Client Information</SectionHeading>
        <div className="space-y-4">
          <div>
            <FieldLabel>{style === 'MG' ? 'Bill To' : 'To'}</FieldLabel>
            <textarea
              className={`${inputClass} h-24`}
              value={billTo}
              onChange={(e) => setBillTo(e.target.value)}
              placeholder={style === 'MG' ? 'Bill To' : 'To'}
            />
          </div>

          {style === 'MG' && (
            <div>
              <FieldLabel>Ship To</FieldLabel>
              <textarea className={`${inputClass} h-24`} value={shipTo} onChange={(e) => setShipTo(e.target.value)} placeholder="Ship To" />
            </div>
          )}

          <div className="flex gap-2">
            <div className="w-1/2">
              <FieldLabel>{style === 'MG' ? 'Phone' : 'Tel'}</FieldLabel>
              <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
            </div>
            <div className="w-1/2">
              <FieldLabel>Email</FieldLabel>
              <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            </div>
          </div>

          {style === 'MG' && (
            <div>
              <FieldLabel>Fax</FieldLabel>
              <input className={inputClass} value={fax} onChange={(e) => setFax(e.target.value)} placeholder="Fax" />
            </div>
          )}
        </div>

        {/* ---------- Terms ---------- */}
        <SectionHeading>Terms</SectionHeading>
        <div className="flex gap-2">
          <div className="w-1/3">
            <FieldLabel>Delivery</FieldLabel>
            <input className={inputClass} value={delivery} onChange={(e) => setDelivery(e.target.value)} placeholder="e.g. 06-08" />
          </div>
          <div className="w-2/3">
            <FieldLabel>Payment Terms</FieldLabel>
            <select className={inputClass} value={payment} onChange={(e) => setPayment(e.target.value)}>
              <option>30 days</option>
              <option>COD</option>
              <option>Prepayment</option>
            </select>
          </div>
        </div>

        {/* ---------- Sales Representative ---------- */}
        <SectionHeading>Sales Representative</SectionHeading>
        <div className="space-y-4">
          <div>
            <FieldLabel>Salesperson</FieldLabel>
            <input className={inputClass} value={salesperson} onChange={(e) => setSalesperson(e.target.value)} placeholder="Salesperson" />
          </div>
          {style === 'MG' && (
            <div>
              <FieldLabel>Mobile</FieldLabel>
              <input className={inputClass} value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile" />
            </div>
          )}
        </div>

        {/* ---------- Items Editor ---------- */}
        <SectionHeading>Items ({items.length})</SectionHeading>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={item.id} className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-slate-500">ITEM #{idx + 1}</span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-[10px] font-bold text-red-400 hover:text-red-300 uppercase tracking-wide"
                >
                  ✕ Delete
                </button>
              </div>

              <div>
                <FieldLabel>{style === 'MG' ? 'Cat No.' : 'Product No.'}</FieldLabel>
                <input
                  className={smallInputClass}
                  value={item.catNo}
                  onChange={(e) => updateItem(item.id, 'catNo', e.target.value)}
                  placeholder="e.g. BZS_041"
                />
              </div>

              <div>
                <FieldLabel>Description</FieldLabel>
                <textarea
                  className={`${smallInputClass} h-16`}
                  value={item.desc}
                  onChange={(e) => updateItem(item.id, 'desc', e.target.value)}
                  placeholder={'Product description\nSize: ...'}
                />
              </div>

              <div className="flex gap-2">
                <div className="w-1/2">
                  <FieldLabel>Qty</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className={smallInputClass}
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="w-1/2">
                  <FieldLabel>Unit Price (MYR)</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={smallInputClass}
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addItem}
            className="w-full border-2 border-dashed border-slate-600 hover:border-cyan-400 text-slate-400 hover:text-cyan-400 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors"
          >
            + Add Item
          </button>
        </div>

        <button
          onClick={handlePrint}
          className="w-full mt-8 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-lg shadow-lg transition-colors"
        >
          Print / Save to PDF
        </button>
      </div>

      {/* ================= A4 Print Preview ================= */}
      <div className="flex-1 flex justify-center overflow-y-auto print:block print:w-full print:m-0 print:p-0">
        <div className="bg-white text-black shadow-2xl print:shadow-none print:border-none border border-gray-300 w-[210mm] min-h-[297mm] p-[15mm] text-xs font-sans relative">
          {style === 'MG' && (
            <div>
              {/* MG Header */}
              <div className="flex justify-between items-start mb-6 border-b-2 border-blue-600 pb-4">
                <h1 className="text-3xl font-extrabold text-blue-600 tracking-wide">Molecular Genomics</h1>
                <div className="border border-blue-600 text-right overflow-hidden">
                  <div className="bg-blue-600 text-white font-bold px-3 py-1 text-[11px]">Agilent Certified</div>
                  <div className="text-blue-700 px-3 py-1 text-[9px] leading-tight">
                    Services Provider
                    <br />
                    Microarray-based
                    <br />
                    Genomics Analysis
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-black text-blue-600">QUOTATION</h2>
                <div className="flex gap-4">
                  <span className="font-semibold">Date</span>
                  <span>{date}</span>
                </div>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <div className="grid grid-cols-[60px_1fr] mb-1">
                    <span className="font-semibold">No :</span>
                    <span>{quoteNo}</span>
                  </div>
                  <div className="grid grid-cols-[60px_1fr]">
                    <span className="font-semibold">Bill To :</span>
                    <span className="whitespace-pre-line">{billTo}</span>
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-[60px_1fr] mb-4">
                    <span className="font-semibold">Ship To :</span>
                    <span className="whitespace-pre-line">{shipTo}</span>
                  </div>
                  <div className="grid grid-cols-[60px_1fr]">
                    <span className="font-semibold">Phone :</span>
                    <span>{phone}</span>
                  </div>
                  <div className="grid grid-cols-[60px_1fr]">
                    <span className="font-semibold">Fax :</span>
                    <span>{fax}</span>
                  </div>
                  <div className="grid grid-cols-[60px_1fr]">
                    <span className="font-semibold">Email :</span>
                    <span>{email}</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full border-collapse border border-black mb-6 [break-inside:auto]">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border border-black p-2 w-[8%]">No.</th>
                    <th className="border border-black p-2 w-[10%]">Qty</th>
                    <th className="border border-black p-2 w-[18%]">Cat No.</th>
                    <th className="border border-black p-2 w-[38%]">Description</th>
                    <th className="border border-black p-2 w-[13%]">
                      Unit Price
                      <br />
                      MYR
                    </th>
                    <th className="border border-black p-2 w-[13%]">
                      Total
                      <br />
                      MYR
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={it.id} className="break-inside-avoid align-top">
                      <td className="border-x border-black p-2 text-center">{idx + 1}</td>
                      <td className="border-x border-black p-2 text-center">{it.qty.toFixed(2)}</td>
                      <td className="border-x border-black p-2">{it.catNo}</td>
                      <td className="border-x border-black p-2">
                        <DescriptionLines text={it.desc} />
                      </td>
                      <td className="border-x border-black p-2 text-right">{formatCurrency(it.price)}</td>
                      <td className="border-x border-black p-2 text-right">{formatCurrency(it.qty * it.price)}</td>
                    </tr>
                  ))}
                  {/* Spacer row for visual extension when the item list is short */}
                  <tr className="h-16 border-x border-black">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="border-t border-black font-semibold break-inside-avoid">
                    <td colSpan={4} className="border-r border-black border-t border-black p-2 text-right">
                      Subtotal
                    </td>
                    <td colSpan={2} className="border border-black p-2 text-right">
                      {formatCurrency(subtotal)}
                    </td>
                  </tr>
                  <tr className="font-bold break-inside-avoid">
                    <td colSpan={4} className="border-r border-black p-2 text-right">
                      Total
                    </td>
                    <td colSpan={2} className="border border-black p-2 text-right">
                      MYR {formatCurrency(subtotal)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Terms */}
              <div className="grid grid-cols-[140px_1fr] mb-6">
                <span className="font-bold">Terms and Conditions :</span>
                <span></span>
                <span>Valid until :</span>
                <span>{validity}</span>
                <span>Payment :</span>
                <span>{payment}</span>
                <span>Delivery :</span>
                <span>{delivery} weeks</span>
              </div>

              <p className="mb-4">
                We hope the above package is favorable to you and are looking forward to your confirmed order.
                <br />
                Thank You!
              </p>
              <p className="mb-8">Yours truly,</p>
              <p>
                {salesperson}
                <br />
                Mobile: {mobile}
              </p>

              <div className="text-[10px] text-center mt-12 pt-4 border-t border-gray-400">
                51 Science Park Road, #04-16 The Aries, Singapore 117586 | Tel: 68739881 Fax: 68739897 | email: info@moleculargenomics.com.sg
                | website: www.moleculargenomics.com.sg
                <br />
                RCB/ GST Reg No: 201101212G
                <br />
                This is computer generated quotation. No signature is required.
              </div>
            </div>
          )}

          {style === 'MGEN' && (
            <div>
              {/* MGEN Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="bg-gray-500 text-white font-black text-4xl px-5 py-4 tracking-wide">MGEN</div>
                <div className="text-right text-[10px] font-bold leading-tight">
                  MGEN Bioteknologi Sdn Bhd
                  <br />
                  No 61-02, Medan Cahaya
                  <br />
                  Jalan Tun Abd Razak (Susur 1/1)
                  <br />
                  Johor Bahru 80000, Malaysia
                  <br />
                  Tel: (60) 7 2235620 Fax: (60) 7-2235620
                  <br />
                  Company Registration No. 801938-K
                </div>
              </div>

              <div className="flex justify-between font-bold text-sm mb-6 pb-2 border-b-2 border-black">
                <span>Quotation No: {quoteNo}</span>
                <span>Date: {date}</span>
              </div>

              <div className="grid grid-cols-[50px_1fr] mb-6 gap-y-1">
                <span>To:</span>
                <span className="whitespace-pre-line">{billTo}</span>
                <span className="mt-4">Tel:</span>
                <span className="mt-4">{phone}</span>
                <span>Email:</span>
                <span>{email}</span>
              </div>

              <div className="font-bold mb-2">PLEASE FIND BELOW ITEMS FOR YOUR CONSIDERATION:</div>

              <table className="w-full border-collapse border-y border-black mb-6 [break-inside:auto]">
                <thead>
                  <tr className="border-b border-black">
                    <th className="p-2 text-center w-[5%]"></th>
                    <th className="p-2 text-left w-[20%]">Product No.</th>
                    <th className="p-2 text-left w-[37%]">Description</th>
                    <th className="p-2 text-center w-[10%]">QTY</th>
                    <th className="p-2 text-center w-[14%]">
                      Unit Price
                      <br />
                      (RM$)
                    </th>
                    <th className="p-2 text-center w-[14%]">
                      Total Price
                      <br />
                      (RM$)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={it.id} className="break-inside-avoid align-top border-b border-gray-300">
                      <td className="p-2 text-center border-r border-gray-300">{idx + 1}</td>
                      <td className="p-2 border-r border-gray-300">{it.catNo}</td>
                      <td className="p-2 border-r border-gray-300">
                        <DescriptionLines text={it.desc} />
                      </td>
                      <td className="p-2 text-center border-r border-gray-300">{it.qty}</td>
                      <td className="p-2 text-center border-r border-gray-300">
                        RM$
                        <br />
                        {formatCurrency(it.price)}
                      </td>
                      <td className="p-2 text-center">
                        RM$
                        <br />
                        {formatCurrency(it.qty * it.price)}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold break-inside-avoid">
                    <td colSpan={5} className="p-2 text-right">
                      TOTAL
                    </td>
                    <td className="p-2 text-center">
                      RM$
                      <br />
                      {formatCurrency(subtotal)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between items-end gap-6">
                <div className="w-1/2">
                  <h3 className="font-bold mb-2">Terms and Conditions</h3>
                  <div className="grid grid-cols-[80px_1fr] mb-6">
                    <span>Validity:</span>
                    <span>{validity}</span>
                    <span>Payment:</span>
                    <span>{payment}</span>
                    <span>Delivery:</span>
                    <span>{delivery} weeks</span>
                  </div>
                  <p className="mb-2">
                    Looking forward to your order.
                    <br />
                    <br />
                    Thank You!
                  </p>
                  <p>
                    Yours truly,
                    <br />
                    <br />
                    {salesperson}
                  </p>
                </div>

                {/* Confirmation box */}
                <div className="w-[45%] border border-black mb-4 break-inside-avoid">
                  <div className="border-b border-black p-2 bg-gray-100 text-[10px]">I would like to confirm the above order</div>
                  <div className="h-24 p-2 flex items-end text-[10px]">Signature and Company Chop</div>
                  <div className="border-t border-black p-2 text-[10px]">Name:</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
