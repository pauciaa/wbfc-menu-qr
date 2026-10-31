import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, User, Phone, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { CartItem, PlacedOrder } from '../types';
import { formatRupiah, calculateCartTotals, generateOrderCode } from '../utils/formatters';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  tableNumber: string;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onOrderSuccess: (order: PlacedOrder) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  items,
  tableNumber,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { subtotal, tax, grandTotal, totalItemsCount } = calculateCartTotals(items);

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError('Silakan masukkan nama Anda untuk pemesanan');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    // Simulate instant process
    const orderCode = generateOrderCode(tableNumber);
    const orderRecord: PlacedOrder = {
      orderCode,
      customer: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        tableNumber,
      },
      items: [...items],
      subtotal,
      tax,
      grandTotal,
      createdAt: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB',
      status: 'Menunggu di Kasir',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderSuccess(orderRecord);
      onClearCart();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md bg-zinc-900 border-l border-zinc-800 h-full flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Keranjang Pesanan
              </h2>
              <span className="text-xs text-amber-400 font-medium">
                Meja {tableNumber} • {totalItemsCount} item
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-zinc-400 hover:text-red-400 px-2 py-1 transition-colors"
                title="Kosongkan keranjang"
              >
                Hapus Semua
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Tutup keranjang"
              className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cart Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/60 flex items-center justify-center text-zinc-600 mb-3">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-zinc-300">Keranjang masih kosong</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs">
              Pilih menu favorit Anda dari katalog WBFC untuk mulai memesan.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors"
            >
              Kembali ke Menu
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* List of Ordered Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3 rounded-2xl bg-zinc-800/60 border border-zinc-800 space-y-2 text-zinc-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        {item.menuItem.name}
                      </h4>
                      <span className="text-xs text-amber-400 font-semibold tabular-nums">
                        {formatRupiah(item.itemTotalPrice)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.cartItemId)}
                      className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                      aria-label={`Hapus ${item.menuItem.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Selected Variants & Add-ons */}
                  <div className="text-[11px] text-zinc-400 space-y-0.5">
                    {item.selectedOptions.temperature && (
                      <div>Suhu: <span className="text-zinc-300">{item.selectedOptions.temperature}</span></div>
                    )}
                    {item.selectedOptions.sweetness && (
                      <div>Gula: <span className="text-zinc-300">{item.selectedOptions.sweetness}</span></div>
                    )}
                    {item.selectedOptions.ice && (
                      <div>Es: <span className="text-zinc-300">{item.selectedOptions.ice}</span></div>
                    )}
                    {item.selectedOptions.flavor && (
                      <div>Varian: <span className="text-zinc-300">{item.selectedOptions.flavor}</span></div>
                    )}
                    {item.selectedOptions.selectedAddOns.length > 0 && (
                      <div>
                        Add-On:{' '}
                        <span className="text-amber-300">
                          {item.selectedOptions.selectedAddOns.map((a) => a.name).join(', ')}
                        </span>
                      </div>
                    )}
                    {item.selectedOptions.note && (
                      <div className="italic text-zinc-400">
                        Catatan: "{item.selectedOptions.note}"
                      </div>
                    )}
                  </div>

                  {/* Stepper for quantity */}
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-700/50">
                    <span className="text-[11px] text-zinc-500">Jumlah</span>
                    <div className="flex items-center gap-2 bg-zinc-900 px-2 py-0.5 rounded-lg border border-zinc-700">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        className="text-zinc-400 hover:text-white p-0.5"
                        aria-label="Kurangi"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white tabular-nums px-1">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="text-zinc-400 hover:text-white p-0.5"
                        aria-label="Tambah"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FORM IDENTITAS PELANGGAN */}
            <form onSubmit={handleSubmitCheckout} id="checkout-form" className="p-3.5 rounded-2xl bg-zinc-800/80 border border-zinc-700 space-y-3">
              <div className="flex items-center gap-2 text-white text-xs font-bold pb-1 border-b border-zinc-700">
                <User className="w-4 h-4 text-amber-500" />
                <span>Identitas Pelanggan (Meja {tableNumber})</span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                  Nama Lengkap / Panggilan <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="Contoh: Rian / Sarah"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 focus:border-amber-500 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                  Nomor WhatsApp <span className="text-zinc-500">(Opsional untuk struk)</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full pl-8 pr-3 py-2 bg-zinc-900 border border-zinc-700 focus:border-amber-500 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              {formError && (
                <p className="text-[11px] text-red-400 font-medium">{formError}</p>
              )}

              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Pembayaran dilakukan langsung di kasir (Tunai / QRIS / Debit).</span>
              </div>
            </form>

            {/* Price Breakdown */}
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal ({totalItemsCount} item)</span>
                <span className="tabular-nums font-medium text-zinc-200">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Pajak Restoran PB1 (10%)</span>
                <span className="tabular-nums font-medium text-zinc-200">{formatRupiah(tax)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-zinc-800">
                <span>Total Pembayaran</span>
                <span className="text-amber-400 font-extrabold tabular-nums">{formatRupiah(grandTotal)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Cart Footer CTA */}
        {items.length > 0 && (
          <div className="p-4 bg-zinc-950 border-t border-zinc-800 shrink-0">
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-bold text-sm shadow-xl shadow-red-950 flex items-center justify-between transition-all disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Memproses Pesanan...' : 'Bayar di Kasir'}</span>
              <div className="flex items-center gap-1.5">
                <span className="tabular-nums font-extrabold">{formatRupiah(grandTotal)}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
            <p className="text-center text-[10px] text-zinc-500 mt-2">
              Pesanan akan otomatis tercatat dan QR code transaksi akan diterbitkan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
