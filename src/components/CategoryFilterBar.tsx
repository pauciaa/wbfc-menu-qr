import React, { useRef } from 'react';
import { Search, X, Filter, Sparkles, Coffee, CupSoda, Milk, UtensilsCrossed, Cookie, Compass, Star } from 'lucide-react';
import { CategoryId } from '../types';
import { CATEGORIES, TASTING_NOTES_LIST } from '../data/menuData';

interface CategoryFilterBarProps {
  selectedCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTastingNote: string;
  onSelectTastingNote: (note: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  totalResultsCount: number;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedTastingNote,
  onSelectTastingNote,
  searchInputRef,
  totalResultsCount,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Star':
        return <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />;
      case 'Coffee':
        return <Coffee className="w-3.5 h-3.5" />;
      case 'CupSoda':
        return <CupSoda className="w-3.5 h-3.5" />;
      case 'Milk':
        return <Milk className="w-3.5 h-3.5" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-3.5 h-3.5" />;
      case 'Cookie':
        return <Cookie className="w-3.5 h-3.5" />;
      default:
        return <Compass className="w-3.5 h-3.5" />;
    }
  };

  const isFilterActive = searchQuery.trim().length > 0 || selectedTastingNote !== 'Semua Notes';

  return (
    <div className="sticky top-[57px] z-20 bg-[#121212]/95 backdrop-blur-md border-b border-zinc-800/80 pt-2 pb-2.5 transition-all">
      <div className="max-w-6xl mx-auto px-4 space-y-2.5">
        {/* Row 1: Search & Tasting Note Filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Instant Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari kopi V60, espresso, nasgor, snack..."
              className="w-full pl-9 pr-8 py-2 bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-0.5"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tasting Note Filter Dropdown (Khusus Kopi Papua & V60) */}
          <div className="relative shrink-0 flex items-center gap-1.5">
            <div className="relative w-full sm:w-auto">
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-amber-500">
                <Filter className="w-3.5 h-3.5" />
              </div>
              <select
                value={selectedTastingNote}
                onChange={(e) => {
                  onSelectTastingNote(e.target.value);
                  if (e.target.value !== 'Semua Notes' && selectedCategory !== 'papua-v60' && selectedCategory !== 'all') {
                    onSelectCategory('papua-v60');
                  }
                }}
                className={`w-full sm:w-auto appearance-none pl-8 pr-7 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer focus:outline-none ${
                  selectedTastingNote !== 'Semua Notes'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {TASTING_NOTES_LIST.map((note) => (
                  <option key={note} value={note} className="bg-zinc-900 text-zinc-200">
                    {note === 'Semua Notes' ? '🔍 Filter Tasting Notes Papua' : `Notes: ${note}`}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-[10px]">
                ▼
              </div>
            </div>

            {/* Clear Filter button if active */}
            {isFilterActive && (
              <button
                onClick={() => {
                  onSearchChange('');
                  onSelectTastingNote('Semua Notes');
                }}
                className="px-2.5 py-2 text-[11px] text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-xl transition-colors whitespace-nowrap shrink-0"
                title="Reset semua filter"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Category Tabs (Scrollable Horizontal) */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5"
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all active:scale-95 ${
                  isActive
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                }`}
              >
                {getCategoryIcon(cat.iconName)}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Filter Indicator / Result Count */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 px-0.5">
          <div className="flex items-center gap-2">
            <span>Menampilkan <strong className="text-zinc-200 tabular-nums">{totalResultsCount}</strong> menu</span>
            {selectedTastingNote !== 'Semua Notes' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                Notes: {selectedTastingNote}
                <button
                  onClick={() => onSelectTastingNote('Semua Notes')}
                  className="hover:text-white"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
          </div>
          <span className="hidden xs:inline text-zinc-500">Scan QR • Pilih • Bayar Kasir</span>
        </div>
      </div>
    </div>
  );
};
