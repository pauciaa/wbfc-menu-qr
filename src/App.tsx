/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Smartphone, Monitor, Sparkles, Coffee, Heart, Info, ArrowUp } from 'lucide-react';
import { CategoryId, MenuItem, CartItem, PlacedOrder } from './types';
import { MENU_ITEMS } from './data/menuData';
import { parseTableNumber, calculateCartTotals } from './utils/formatters';
import { Header } from './components/Header';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { FloatingCartBar } from './components/FloatingCartBar';
import { CartModal } from './components/CartModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { TableQrModal } from './components/TableQrModal';
import { StandaloneCodeModal } from './components/StandaloneCodeModal';

export default function App() {
  // Table state (parsed from ?table=43 or ?meja=43)
  const [tableNumber, setTableNumber] = useState<string>('43');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTastingNote, setSelectedTastingNote] = useState<string>('Semua Notes');

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isStandaloneModalOpen, setIsStandaloneModalOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<PlacedOrder | null>(null);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Device simulation toggle for desktop reviewers
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Parse table parameter on initial load
  useEffect(() => {
    const table = parseTableNumber(window.location.search);
    setTableNumber(table);
  }, []);

  // Filter menu items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category filter
      let matchCategory = true;
      if (selectedCategory === 'rekomendasi') {
        matchCategory = !!item.isRecommended;
      } else if (selectedCategory !== 'all') {
        matchCategory = item.category === selectedCategory;
      }

      // Search query filter
      let matchSearch = true;
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const inName = item.name.toLowerCase().includes(query);
        const inDesc = item.description.toLowerCase().includes(query);
        const inComp = item.composition.toLowerCase().includes(query);
        const inStory = item.story ? item.story.toLowerCase().includes(query) : false;
        const inNotes = item.tastingNotes ? item.tastingNotes.some((n) => n.toLowerCase().includes(query)) : false;
        matchSearch = inName || inDesc || inComp || inStory || inNotes;
      }

      // Tasting notes filter (specifically for Papua V60)
      let matchTastingNote = true;
      if (selectedTastingNote !== 'Semua Notes') {
        matchTastingNote = !!(item.tastingNotes && item.tastingNotes.some((n) => n.includes(selectedTastingNote)));
      }

      return matchCategory && matchSearch && matchTastingNote;
    });
  }, [selectedCategory, searchQuery, selectedTastingNote]);

  // Cart actions
  const handleAddToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.cartItemId === newItem.cartItemId);
      if (existingIdx >= 0) {
        const updated = [...prev];
        const current = updated[existingIdx];
        const newQty = current.quantity + newItem.quantity;
        const unitPrice = current.itemTotalPrice / current.quantity;
        updated[existingIdx] = {
          ...current,
          quantity: newQty,
          itemTotalPrice: unitPrice * newQty,
        };
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const unitPrice = item.itemTotalPrice / item.quantity;
          return {
            ...item,
            quantity: newQty,
            itemTotalPrice: unitPrice * newQty,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const { subtotal, totalItemsCount } = calculateCartTotals(cartItems);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-[#121212] text-[#F4F4F5] flex flex-col items-center transition-all ${isPhoneFrame ? 'py-4 sm:py-8 bg-zinc-950/90' : ''}`}>
      {/* Top Device Simulation Bar (Only on Desktop) */}
      <div className="w-full max-w-6xl px-4 py-2 hidden md:flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/40 mb-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Waanal Brothers Digital Menu Live Preview (Meja {tableNumber})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPhoneFrame(false)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
              !isPhoneFrame ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Responsive Lebar</span>
          </button>
          <button
            onClick={() => setIsPhoneFrame(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
              isPhoneFrame ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Simulasi HP Mobile (390px)</span>
          </button>
        </div>
      </div>

      {/* Main Container / Mobile Frame Wrapper */}
      <div
        className={`w-full flex-1 flex flex-col bg-[#121212] transition-all ${
          isPhoneFrame
            ? 'max-w-[420px] rounded-[36px] border-4 border-zinc-800 shadow-2xl overflow-hidden my-2 min-h-[844px]'
            : 'max-w-6xl'
        }`}
      >
        {/* Header */}
        <Header
          tableNumber={tableNumber}
          onOpenTableModal={() => setIsTableModalOpen(true)}
          onOpenStandaloneModal={() => setIsStandaloneModalOpen(true)}
          onFocusSearch={() => {
            searchInputRef.current?.focus();
            scrollToTop();
          }}
          searchQuery={searchQuery}
        />

        {/* Category & Search Filter Bar */}
        <CategoryFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          selectedTastingNote={selectedTastingNote}
          onSelectTastingNote={(note) => setSelectedTastingNote(note)}
          searchInputRef={searchInputRef}
          totalResultsCount={filteredItems.length}
        />

        {/* Featured Hero Banner for Papua Single Origin */}
        {selectedCategory === 'papua-v60' && (
          <section className="px-4 pt-3">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-500/30">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Arabika Pedalaman Papua</span>
              </div>
              <h2 className="text-base font-extrabold text-white font-display">
                Manual Brew V60 Pegunungan Tengah Papua
              </h2>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                Dipanen langsung dari kebun rakyat organik di Tolikara, Pegunungan Bintang (Oksibil & Okbab), Yahukimo (Tangma), hingga Wamena Jayawijaya. Disajikan manual brew V60 dengan metode Hot atau Iced Japanese.
              </p>
            </div>
          </section>
        )}

        {/* Main Content Grid */}
        <main className="flex-1 px-4 py-4 pb-28">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
                <Coffee className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-zinc-200">Menu tidak ditemukan</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Tidak ada menu yang cocok dengan kata kunci atau filter tasting notes yang Anda pilih.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTastingNote('Semua Notes');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredItems.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onSelect={(product) => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Footer Info */}
        <footer className="px-4 py-6 border-t border-zinc-800/60 bg-zinc-950 text-center space-y-2 text-zinc-400 text-xs">
          <div className="flex items-center justify-center gap-2">
            <span className="font-extrabold text-zinc-200 uppercase font-display tracking-wide">
              WAANAL BROTHERS FOOD & COFFEE
            </span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">Bandung</span>
          </div>
          <p className="text-[11px] text-zinc-400 max-w-md mx-auto">
            Jl. Batununggal Indah I No. 66, Mengger, Kec. Bandung Kidul, Kota Bandung, Jawa Barat 40267.
          </p>
          <div className="pt-2 text-[10px] text-zinc-400">
            Katalog Digital QR Code • Pemesanan Mandiri Kasir
          </div>
        </footer>
      </div>

      {/* Floating Cart Sticky Bar */}
      <FloatingCartBar
        totalItemsCount={totalItemsCount}
        subtotal={subtotal}
        tableNumber={tableNumber}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Modals */}
      <ProductModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        tableNumber={tableNumber}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderSuccess={(order) => {
          setIsCartOpen(false);
          setLastPlacedOrder(order);
        }}
      />

      <OrderSuccessModal
        order={lastPlacedOrder}
        onClose={() => setLastPlacedOrder(null)}
        onNewOrder={() => setLastPlacedOrder(null)}
      />

      <TableQrModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        currentTable={tableNumber}
        onSelectTable={(newTable) => setTableNumber(newTable)}
      />

      <StandaloneCodeModal
        isOpen={isStandaloneModalOpen}
        onClose={() => setIsStandaloneModalOpen(false)}
      />
    </div>
  );
}
