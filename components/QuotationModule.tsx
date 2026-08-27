"use client";
import React, { useState, useEffect } from 'react';

type StyleType = 'MG' | 'MGEN';

export default function QuotationModule() {
  const [style, setStyle] = useState<StyleType>('MG');
  const [quoteNo, setQuoteNo] = useState('220049173');
  const [date, setDate] = useState('19.02.2024');
  const [billTo, setBillTo] = useState('Assc. Prof. Dr. Nurul Asma Abdullah\nHealth Campus\nUniversity Sains Malaysia\n16150 Kubang Kerian\nKelantan Darul Naim\nMalaysia');
  const [shipTo, setShipTo] = useState('Assc. Prof. Dr. Nurul Asma Abdullah\nHealth Campus\nUniversity Sains Malaysia\n16150 Kubang Kerian\nKelantan Darul Naim\nMalaysia');
  const [phone, setPhone] = useState('+609-766 3000');
  const [fax, setFax] = useState('');
  const [email, setEmail] = useState('soledad0703@yahoo.com');
  const [validity, setValidity] = useState('20.03.2024');
  const [payment, setPayment] = useState('Prepayment');
  const [delivery, setDelivery] = useState('8');
  const [salesperson, setSalesperson] = useState('Noel Wong');
  const [mobile, setMobile] = useState('90668514');

  const [items, setItems] = useState([
    { qty: 2, catNo: 'BZS_041', desc: 'Cap Insert for 2 mL Cryogenic Vial, Red\nSize: 100 units/pack', price: 35.00 },
    { qty: 1, catNo: 'RG_PBS_03X', desc: 'PBS Concentrate, 10X\nSize: 1 L', price: 800.00 }
  ]);

  useEffect(() => {
    if (style === 'MGEN') {
      setQuoteNo('MPB/ 20-2565-32');
      setDate('15 Apr 2026');
      setBillTo('Mr. Rocky Vester Anak Richmond\nUKM Specialist Children\'s Hospital (HPKK)\nJalan Yaakob Latif,\nBandar Tun Razak\n56000 Cheras\nMalaysia');
      setSalesperson('Ngatijah bt Saimin');
      setValidity('90 days');
    } else {
      setQuoteNo('220049173');
      setDate('19.02.2024');
      setSalesperson('Noel Wong');
      setValidity('20.03.2024');
    }
  }, [style]);

  const handlePrint = () => window.print();

  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  
  return (
    <div className="min-h-screen bg-slate-950 p-6 flex gap-6">
      
      {/* 隐藏于打印的控制面板 (Control Panel) */}
      <div className="w-1/3 bg-slate-900 border border-slate-700 rounded-xl p-6 overflow-y-auto h-[90vh] print:hidden">
        <h2 className="text-xl font-bold text-white mb-6 text-cyan-400">Quotation Generator</h2>
        
        <div className="flex gap-2 mb-6">
          <button onClick={() => setStyle('MG')} className={`flex-1 py-2 rounded font-bold ${style === 'MG' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>MG Style</button>
          <button onClick={() => setStyle('MGEN')} className={`flex-1 py-2 rounded font-bold ${style === 'MGEN' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>MGEN Style</button>
        </div>

        <div className="space-y-4">
          <input className="w-full bg-slate-800 text-white p-2 border border-slate-700 rounded text-sm" value={quoteNo} onChange={e => setQuoteNo(e.target.value)} placeholder="Quote No" />
          <input className="w-full bg-slate-800 text-white p-2 border border-slate-700 rounded text-sm" value={date} onChange={e => setDate(e.target.value)} placeholder="Date" />
          
          <textarea className="w-full bg-slate-800 text-white p-2 border border-slate-700 rounded text-sm h-24" value={billTo} onChange={e => setBillTo(e.target.value)} placeholder={style === 'MG' ? "Bill To" : "To"} />
          {style === 'MG' && <textarea className="w-full bg-slate-800 text-white p-2 border border-slate-700 rounded text-sm h-24" value={shipTo} onChange={e => setShipTo(e.target.value)} placeholder="Ship To" />}
          
          <div className="flex gap-2">
            <input className="w-1/2 bg-slate-800 text-white p-2 border border-slate-700 rounded text-sm" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
            <input className="w-1/2 bg-slate-800 text-white p-2 border border-slate-700 rounded text-sm" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          </div>

          <div className="flex gap-2 items-center">
            <input className="w-1/3 bg-slate-800 text-white p-2 border border-slate-700 rounded text-sm" value={delivery} onChange={e => setDelivery(e.target.value)} placeholder="Delivery (e.g. 6-8)" />
            <span className="text-slate-400 text-sm">weeks</span>
            <select className="w-2/3 bg-slate-800 text-white p-2 border border-slate-700 rounded text-sm" value={payment} onChange={e => setPayment(e.target.value)}>
              <option>30 days</option>
              <option>COD</option>
              <option>Prepayment</option>
            </select>
          </div>

          <button onClick={handlePrint} className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-lg shadow-lg">
            Print / Save to PDF
          </button>
        </div>
      </div>

      {/* A4 打印预览区域 */}
      <div className="flex-1 flex justify-center overflow-y-auto print:block print:w-full print:m-0 print:p-0">
        <div className="bg-white text-black shadow-2xl print:shadow-none print:border-none border border-gray-300 w-[210mm] min-h-[297mm] p-[15mm] text-xs font-sans relative">
          
          {style === 'MG' && (
            <div>
              {/* MG Header */}
              <div className="flex justify-between items-start mb-6 border-b-2 border-blue-600 pb-4">
                <h1 className="text-3xl font-extrabold text-blue-600 tracking-wider">Molecular Genomics</h1>
                <div className="text-right border border-blue-600 text-blue-600 font-bold p-2 text-xs">Agilent Certified<br/>Services Provider</div>
              </div>

              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-black text-blue-600">QUOTATION</h2>
                <div className="flex gap-4"><span>Date</span><span>{date}</span></div>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <div className="grid grid-cols-[60px_1fr] mb-1">
                    <span className="font-semibold">No :</span><span>{quoteNo}</span>
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
                    <span className="font-semibold">Phone :</span><span>{phone}</span>
                  </div>
                  <div className="grid grid-cols-[60px_1fr]">
                    <span className="font-semibold">Fax :</span><span>{fax}</span>
                  </div>
                  <div className="grid grid-cols-[60px_1fr]">
                    <span className="font-semibold">Email :</span><span>{email}</span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <table className="w-full border-collapse border border-black mb-6 page-break-inside-auto">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border border-black p-2 w-[10%]">No.</th>
                    <th className="border border-black p-2 w-[10%]">Qty</th>
                    <th className="border border-black p-2 w-[20%]">Cat No.</th>
                    <th className="border border-black p-2 w-[40%]">Description</th>
                    <th className="border border-black p-2 w-[10%]">Unit Price<br/>MYR</th>
                    <th className="border border-black p-2 w-[10%]">Total<br/>MYR</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx} className="break-inside-avoid align-top">
                      <td className="border-x border-black p-2 text-center">{idx + 1}</td>
                      <td className="border-x border-black p-2 text-center">{it.qty.toFixed(2)}</td>
                      <td className="border-x border-black p-2">{it.catNo}</td>
                      <td className="border-x border-black p-2 whitespace-pre-line">{it.desc}</td>
                      <td className="border-x border-black p-2 text-right">{it.price.toFixed(2)}</td>
                      <td className="border-x border-black p-2 text-right">{(it.qty * it.price).toFixed(2)}</td>
                    </tr>
                  ))}
                  {/* Empty spacer row for visual extension */}
                  <tr className="h-20 border-x border-black"><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  {/* Subtotal & Total strictly at the end */}
                  <tr className="border-t border-black font-semibold break-inside-avoid">
                    <td colSpan={4} className="border-r border-black border-t border-black p-2 text-right">Subtotal</td>
                    <td colSpan={2} className="border border-black p-2 text-right">{subtotal.toFixed(2)}</td>
                  </tr>
                  <tr className="font-bold break-inside-avoid">
                    <td colSpan={4} className="border-r border-black p-2 text-right">Total</td>
                    <td colSpan={2} className="border border-black p-2 text-right">MYR {subtotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Footer */}
              <div className="grid grid-cols-[100px_1fr] mb-6">
                <span className="font-bold">Terms and Conditions :</span><span></span>
                <span>Valid until :</span><span>{validity}</span>
                <span>Payment :</span><span>{payment}</span>
                <span>Delivery :</span><span>{delivery} weeks</span>
              </div>
              
              <p className="mb-4">We hope the above package is favorable to you and are looking forward to your confirmed order.<br/>Thank You!</p>
              <p className="mb-8">Yours truly,</p>
              <p>{salesperson}<br/>Mobile: {mobile}</p>
              
              <div className="text-[10px] text-center mt-12 pt-4 border-t border-gray-400">
                51 Science Park Road, #04-16 The Aries, Singapore 117586 | Tel: 68739881 Fax: 68739897<br/>
                This is computer generated quotation. No signature is required.
              </div>
            </div>
          )}

          {style === 'MGEN' && (
            <div>
              {/* MGEN Header */}
              <div className="flex justify-between items-start mb-8">
                <h1 className="text-5xl font-black bg-gray-400 text-white p-4">MGEN</h1>
                <div className="text-right text-xs font-bold leading-tight">
                  MGEN Bioteknologi Sdn Bhd<br/>No 61-02, Medan Cahaya<br/>Jalan Tun Abd Razak (Susur 1/1)<br/>Johor Bahru 80000, Malaysia<br/>Tel: (60) 7 2235620 Fax: (60) 7-2235620
                </div>
              </div>

              <div className="flex justify-between font-bold text-sm mb-6 pb-2 border-b-2 border-black">
                <span>Quotation No: {quoteNo}</span>
                <span>Date: {date}</span>
              </div>

              <div className="grid grid-cols-[50px_1fr] mb-6 gap-y-1">
                <span>To:</span><span className="whitespace-pre-line">{billTo}</span>
                <span className="mt-4">Tel:</span><span className="mt-4">{phone}</span>
                <span>Email:</span><span>{email}</span>
              </div>

              <div className="font-bold mb-2">PLEASE FIND BELOW ITEMS FOR YOUR CONSIDERATION:</div>

              <table className="w-full border-collapse border-y border-black mb-6 page-break-inside-auto">
                <thead>
                  <tr className="border-b border-black">
                    <th className="p-2 text-center w-[5%]"></th>
                    <th className="p-2 text-left w-[20%]">Product No.</th>
                    <th className="p-2 text-left w-[40%]">Description</th>
                    <th className="p-2 text-center w-[10%]">QTY</th>
                    <th className="p-2 text-center w-[12%]">Unit Price<br/>(RM$)</th>
                    <th className="p-2 text-center w-[13%]">Total Price<br/>(RM$)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx} className="break-inside-avoid align-top border-b border-gray-300">
                      <td className="p-2 text-center border-r border-gray-300">{idx + 1}</td>
                      <td className="p-2 border-r border-gray-300">{it.catNo}</td>
                      <td className="p-2 border-r border-gray-300 whitespace-pre-line">{it.desc}</td>
                      <td className="p-2 text-center border-r border-gray-300">{it.qty}</td>
                      <td className="p-2 text-center border-r border-gray-300">RM$<br/>{it.price.toFixed(2)}</td>
                      <td className="p-2 text-center">RM$<br/>{(it.qty * it.price).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold break-inside-avoid">
                    <td colSpan={5} className="p-2 text-right">TOTAL</td>
                    <td className="p-2 text-center">RM$<br/>{subtotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between items-end">
                <div className="w-1/2">
                  <h3 className="font-bold mb-2">Terms and Conditions</h3>
                  <div className="grid grid-cols-[80px_1fr] mb-6">
                    <span>Validity:</span><span>{validity}</span>
                    <span>Payment:</span><span>{payment}</span>
                    <span>Delivery:</span><span>{delivery} weeks</span>
                  </div>
                  <p className="mb-8">Looking forward to your order.<br/><br/>Thank You!<br/><br/>Yours truly,<br/><br/>{salesperson}</p>
                </div>
                
                {/* Confirmation Box at bottom right */}
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