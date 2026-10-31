import React, { useState } from 'react';
import { Plus, Coffee, Sparkles, Check, AlertCircle } from 'lucide-react';
import { MenuItem } from '../types';
import { formatRupiah } from '../utils/formatters';

interface ProductCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case '100% Kopi Papua':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
      case 'Best Seller':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
      case 'Signature':
        return 'bg-purple-500/20 text-purple-300 border border-purple-500/40';
      case 'Stok Habis':
        return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
      default:
        return 'bg-zinc-800/80 text-zinc-300';
    }
  };

  const isOutOfStock = !item.isAvailable;

  return (
    <article
      onClick={() => !isOutOfStock && onSelect(item)}
      className={`group relative bg-zinc-900/90 rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col ${
        isOutOfStock
          ? 'border-zinc-800/50 opacity-60 cursor-not-allowed'
          : 'border-zinc-800 hover:border-amber-500/50 hover:shadow-xl hover:shadow-black/40 cursor-pointer active:scale-[0.99]'
      }`}
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] w-full bg-zinc-950 overflow-hidden">
        {!imageError && item.image ? (
          <img
            src={item.image}
            alt={item.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isOutOfStock ? 'grayscale' : 'group-hover:scale-105'
            }`}
          />
        ) : (
          /* Styled Fallback Container (Zero-Broken-Image Policy) */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 text-center">
            <Coffee className="w-8 h-8 text-amber-500/50 mb-1" />
            <span className="text-[11px] font-medium text-zinc-400 line-clamp-1">{item.name}</span>
          </div>
        )}

        {/* Gradient Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          {item.badge ? (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide backdrop-blur-md ${getBadgeStyle(item.badge)}`}>
              {item.badge}
            </span>
          ) : <span />}

          {isOutOfStock && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-950/90 text-red-300 border border-red-800/60 backdrop-blur-md">
              Stok Habis
            </span>
          )}
        </div>

        {/* Tasting Notes Tags (if coffee) */}
        {item.tastingNotes && item.tastingNotes.length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 pointer-events-none">
            {item.tastingNotes.map((note) => (
              <span
                key={note}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/75 text-amber-300 backdrop-blur-md border border-amber-500/30"
              >
                Notes: {note}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 font-display">
            {item.name}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Bottom Bar: Price & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Harga</span>
            <span className="text-sm font-extrabold text-amber-400 tabular-nums">
              {formatRupiah(item.price)}
            </span>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) onSelect(item);
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
              isOutOfStock
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-900/30'
            }`}
          >
            {isOutOfStock ? (
              <span>Habis</span>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Pesan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
