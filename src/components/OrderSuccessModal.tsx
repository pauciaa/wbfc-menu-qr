import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { CheckCircle2, QrCode, Copy, Check, MessageSquare, RefreshCw, X, MapPin } from 'lucide-react';
import { PlacedOrder } from '../types';
import { formatRupiah, formatWhatsAppMessage } from '../utils/formatters';

interface OrderSuccessModalProps {
  order: PlacedOrder | null;
  onClose: () => void;
  onNewOrder: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onNewOrder,
}) => {
  if (!order) return null;

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#DC2626', '#FFFFFF', '#D97706'],
      });
    } catch {
      // Ignore if unavailable
    }

    // Generate real QR code image for cashier scanning
    const payload = JSON.stringify({
      orderCode: order.orderCode,
      table: order.customer.tableNumber,
      name: order.customer.name,
      total: order.grandTotal,
      time: order.createdAt,
    });

    QRCode.toDataURL(payload, {
      width: 260,
      margin: 1.5,
      color: {
        dark: '#121212',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR', err));
  }, [order]);

  const handleCopySummary = () => {
    const message = formatWhatsAppMessage(order);
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(formatWhatsAppMessage(order));
    // Provide general WhatsApp link
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">Pesanan Berhasil Dikirim</h3>
              <span className="text-[11px] text-zinc-400">Meja {order.customer.tableNumber} • {order.createdAt}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Highlighted Order Code Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/40 text-center space-y-1">
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-widest block">
            Kode Transaksi Kasir
          </span>
          <div className="text-2xl font-black text-white tracking-wider font-mono">
            {order.orderCode}
          </div>
          <p className="text-[11px] text-zinc-300">
            Atas Nama: <strong className="text-white">{order.customer.name}</strong>
          </p>
        </div>

        {/* QR Code Container for Cashier Scanning */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-inner">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code ${order.orderCode}`}
              className="w-44 h-44 object-contain rounded-lg"
            />
          ) : (
            <div className="w-44 h-44 flex items-center justify-center text-zinc-400">
              <QrCode className="w-12 h-12 animate-pulse" />
            </div>
          )}
          <span className="text-[11px] text-zinc-800 font-semibold mt-2 text-center">
            Tunjukkan QR Code ini ke Kasir WBFC Bandung
          </span>
        </div>

        {/* Order Details Brief */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
          <div className="flex justify-between text-zinc-400 font-semibold pb-1 border-b border-zinc-800">
            <span>Ringkasan Menu ({order.items.length} jenis)</span>
            <span className="text-white tabular-nums font-bold">{formatRupiah(order.grandTotal)}</span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {order.items.map((it) => (
              <div key={it.cartItemId} className="flex justify-between items-start text-[11px]">
                <div className="text-zinc-300">
                  <span className="font-bold text-white">{it.quantity}x</span> {it.menuItem.name}
                  {it.selectedOptions.temperature && (
                    <span className="text-zinc-500 ml-1">({it.selectedOptions.temperature})</span>
                  )}
                  {it.selectedOptions.note && (
                    <div className="text-[10px] text-zinc-500 italic">"{it.selectedOptions.note}"</div>
                  )}
                </div>
                <span className="text-zinc-400 tabular-nums shrink-0 ml-2">
                  {formatRupiah(it.itemTotalPrice)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-800 flex justify-between text-[11px]">
            <span className="text-zinc-400">Lokasi Kasir:</span>
            <span className="text-amber-400 font-medium">WBFC Batununggal Indah I No. 66</span>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleOpenWhatsApp}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Kirim WhatsApp</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-zinc-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Struk'}</span>
          </button>
        </div>

        {/* New Order Trigger */}
        <button
          onClick={onNewOrder}
          className="w-full py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Buat Pesanan Baru</span>
        </button>
      </div>
    </div>
  );
};
