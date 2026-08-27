import React, { useState, useEffect } from 'react';

interface RestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: any;
  selectedItems: any[];
}

export default function RestockModal({ isOpen, onClose, equipment, selectedItems }: RestockModalProps) {
  const [endUserName, setEndUserName] = useState('');
  const [countryCode, setCountryCode] = useState('+60');
  const [phone, setPhone] = useState('');
  
  // 使用状态存储 To 和 Cc
  const [emailTo, setEmailTo] = useState('');
  const [emailCc, setEmailCc] = useState('genomaxstaff@gmail.com');
  
  const [isSending, setIsSending] = useState(false);

  // 每次 Modal 打开或切换设备时，强制把最新的邮箱赋给 state，确保可自由修改
  useEffect(() => {
    if (equipment) {
      setEmailTo(equipment.salesRoute || equipment.salespersonEmail || 'jingfong_ewe@genomax.com.my');
    }
  }, [equipment, isOpen]);

  if (!isOpen) return null;

  const isPhoneValid = phone.replace(/[^0-9]/g, '').length >= 8;
  const isFormValid = endUserName.trim() !== '' && isPhoneValid && emailTo.trim() !== '';

  const equipmentRef = equipment?.ref || equipment?.refNumber || '2026001234';

  const emailBody = `Dear GTMY Team,

I am ${endUserName || '[End-User Name]'} from ${equipment?.location || 'FHMS UTAR Sg Long'}. We require restock of these reagents for our ${equipment?.name || 'Equipment'}:

${selectedItems.map((item, index) => `${index + 1}. cat# ${item.catNo || item.id} [qty: ${item.qty || 1}]`).join('\n')}

Thanks and regards

${endUserName || '[End-User Name]'}

GTMY DO Ref: ${equipmentRef}`;

  const handleSend = async () => {
    if (!isFormValid) return;
    setIsSending(true);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailTo,
          cc: emailCc,
          subject: `Restock Request - ${equipmentRef}`,
          text: emailBody
        })
      });
      if (res.ok) {
        alert("Email sent successfully!");
        onClose();
      } else {
        alert("Failed to send email.");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending email.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Request for restock</h2>
            <p className="text-sm text-slate-400">Smart filter: out of stock, or every remaining lot is inside the expiry threshold</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white border border-slate-600 px-2 py-1 rounded text-xs">Esc</button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider">End-User Name</label>
            <input 
              type="text"
              value={endUserName}
              onChange={(e) => setEndUserName(e.target.value)}
              placeholder="Name on the request"
              className="bg-slate-900 border border-slate-700 rounded-md p-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider">Phone Number (Mandatory)</label>
            <div className="flex gap-2">
              <select 
                value={countryCode} 
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-md p-2 text-sm text-slate-200 w-24 focus:outline-none focus:border-cyan-500"
              >
                <option value="+60">+60</option>
                <option value="+65">+65</option>
                <option value="+62">+62</option>
                <option value="+86">+86</option>
              </select>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 4-8294019"
                className="bg-slate-900 border border-slate-700 rounded-md p-2 text-sm text-slate-200 flex-1 focus:outline-none focus:border-cyan-500"
              />
            </div>
            {!isPhoneValid && phone.length > 0 && (
              <span className="text-xs text-red-400 mt-1">Must be at least 8 digits</span>
            )}
          </div>
        </div>

        {/* 真正完全解锁、可自由输入的 To 和 Cc 输入框 */}
        <div className="bg-slate-900 border border-cyan-500/40 rounded-lg p-3 mb-4 space-y-2 text-sm font-mono shadow-inner">
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

        <div className="flex-1 overflow-y-auto min-h-[120px] mb-4 space-y-3">
          {selectedItems.map((item, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-700 rounded-md p-3 flex justify-between items-center">
              <div>
                <div className="text-slate-200 text-sm font-bold">cat# {item.catNo || item.id}</div>
                <div className="text-slate-400 text-xs">{item.name || 'Reagent'}</div>
              </div>
              <div className="text-white font-mono bg-slate-800 px-3 py-1 rounded border border-slate-600">
                {item.qty || 1}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-md p-4 mb-6">
          <textarea 
            readOnly
            value={emailBody}
            className="w-full bg-transparent text-slate-300 text-sm font-mono resize-none h-32 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 mt-auto">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-300 border border-slate-600 rounded-md hover:bg-slate-700">Cancel</button>
          <button 
            onClick={handleSend}
            disabled={!isFormValid || isSending}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-600 disabled:text-slate-400 text-slate-900 px-6 py-2 rounded-md text-sm font-bold transition-colors"
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}