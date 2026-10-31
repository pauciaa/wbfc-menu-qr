import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface FloatingCartBarProps {
  totalItemsCount: number;
  subtotal: number;
  tableNumber: string;
  onOpenCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  totalItemsCount,
  subtotal,
  tableNumber,
  onOpenCart,
}) => {
  if (totalItemsCount === 0) return null;

  return (
    <aside
      aria-label="Keranjang Belanja"
      className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none"
    >
      <div className="max-w-xl mx-auto pointer-events-auto">
        <button
          onClick={onOpenCart}
          className="w-full py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-bold shadow-xl shadow-red-950/60 flex items-center justify-between border border-red-500/50 transition-all"
        >
          {/* Left: Cart Icon & Item Count */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black/25 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="text-xs sm:text-sm font-extrabold block">
                Lihat Keranjang ({totalItemsCount} item)
              </span>
              <span className="text-[11px] text-red-200 font-normal">
                Pesanan Meja {tableNumber}
              </span>
            </div>
          </div>

          {/* Right: Subtotal & Arrow */}
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-extrabold tabular-nums">
              {formatRupiah(subtotal)}
            </span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
};
