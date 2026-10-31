import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, QrCode, Check, Copy, ExternalLink, RefreshCw } from 'lucide-react';

interface TableQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTable: string;
  onSelectTable: (table: string) => void;
}

export const TableQrModal: React.FC<TableQrModalProps> = ({
  isOpen,
  onClose,
  currentTable,
  onSelectTable,
}) => {
  if (!isOpen) return null;

  const [inputTable, setInputTable] = useState(currentTable);
  const [qrUrl, setQrUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Common cafe tables for quick select
  const popularTables = ['01', '02', '07', '12', '24', '43'];

  useEffect(() => {
    // Determine the base URL
    const baseUrl = window.location.origin + window.location.pathname;
    const fullUrl = `${baseUrl}?table=${inputTable || '43'}`;
    setTargetUrl(fullUrl);

    QRCode.toDataURL(fullUrl, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#121212',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error(err));
  }, [inputTable]);

  const handleApply = (tableVal: string) => {
    setInputTable(tableVal);
    onSelectTable(tableVal);
    // Update browser URL without reload
    const newUrl = `${window.location.pathname}?table=${tableVal}`;
    window.history.replaceState({ path: newUrl }, '', newUrl);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-white font-display">
              Generator QR Code Meja
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Sistem membaca parameter URL <code className="text-amber-400 bg-zinc-800 px-1 py-0.5 rounded">?table=43</code> secara otomatis saat pengunjung kafe memindai QR code di meja.
        </p>

        {/* Input & Quick Select */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 block">
            Pilih atau Ketik Nomor Meja
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputTable}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9a-zA-Z]/g, '');
                setInputTable(val);
                if (val) handleApply(val);
              }}
              placeholder="Contoh: 43"
              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 focus:border-amber-500 rounded-xl text-sm font-bold text-amber-400 placeholder-zinc-500 focus:outline-none"
            />
            <button
              onClick={() => handleApply(inputTable || '43')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition-colors"
            >
              Terapkan
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] text-zinc-500">Pilihan Cepat:</span>
            {popularTables.map((t) => (
              <button
                key={t}
                onClick={() => handleApply(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  inputTable === t
                    ? 'bg-amber-500 text-zinc-950 font-bold'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                Meja {t}
              </button>
            ))}
          </div>
        </div>

        {/* Generated QR Code Preview */}
        <div className="p-4 bg-white rounded-2xl flex flex-col items-center justify-center shadow-inner">
          {qrUrl ? (
            <img src={qrUrl} alt={`QR Meja ${inputTable}`} className="w-48 h-48 object-contain" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-zinc-400">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
          )}
          <div className="text-center mt-2">
            <span className="text-xs font-black uppercase text-zinc-900 tracking-wider block">
              WAANAL BROTHERS FOOD & COFFEE
            </span>
            <span className="text-base font-extrabold text-amber-600 block">
              MEJA {inputTable || '43'}
            </span>
            <span className="text-[10px] text-zinc-500">Scan untuk langsung pesan dari meja Anda</span>
          </div>
        </div>

        {/* URL Target & Copy */}
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
            Target URL QR Code
          </span>
          <div className="flex items-center justify-between gap-2 text-xs text-zinc-300 font-mono break-all">
            <span className="truncate">{targetUrl}</span>
            <button
              onClick={handleCopyLink}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg shrink-0 transition-colors"
              title="Salin tautan"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-colors"
        >
          Selesai / Tutup
        </button>
      </div>
    </div>
  );
};
