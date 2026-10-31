import React from 'react';
import { Coffee, MapPin, QrCode, Search, FileCode, Check } from 'lucide-react';

interface HeaderProps {
  tableNumber: string;
  onOpenTableModal: () => void;
  onOpenStandaloneModal: () => void;
  onFocusSearch: () => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({
  tableNumber,
  onOpenTableModal,
  onOpenStandaloneModal,
  onFocusSearch,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#121212]/95 backdrop-blur-md border-b border-zinc-800/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Brand Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-bold shadow-lg shadow-amber-500/20 shrink-0">
              <Coffee className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white uppercase truncate font-display">
                  WAANAL BROTHERS
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
                  Food & Coffee
                </span>
              </div>
              <p className="flex items-center gap-1 text-[11px] sm:text-xs text-zinc-400 truncate">
                <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                <span className="truncate">Jl. Batununggal Indah I No. 66, Bandung</span>
              </p>
            </div>
          </div>

          {/* Action Area: Dynamic Table Badge & Utility Tools */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Table Number Badge (Interactive) */}
            <button
              onClick={onOpenTableModal}
              title="Klik untuk ganti atau uji QR Meja"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/90 hover:bg-zinc-700/90 text-amber-400 border border-amber-500/30 transition-all shadow-sm active:scale-95 text-xs font-semibold"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Meja {tableNumber}</span>
              <span className="text-[10px] text-zinc-400 font-normal hidden xs:inline">(Ubah)</span>
            </button>

            {/* Standalone 1-File Code Viewer */}
            <button
              onClick={onOpenStandaloneModal}
              title="Lihat & Salin Kode 1 File index.html Standalone untuk Tugas/Skripsi"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Kode 1-File</span>
            </button>

            {/* Quick Search Trigger */}
            <button
              onClick={onFocusSearch}
              aria-label="Cari Menu"
              className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
