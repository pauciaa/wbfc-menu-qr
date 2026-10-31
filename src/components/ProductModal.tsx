import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Coffee, Flame, Check, Sparkles, MapPin, Mountain, Info } from 'lucide-react';
import { MenuItem, AddOnOption, SelectedOptions, CartItem } from '../types';
import { formatRupiah, calculateSingleItemPrice } from '../utils/formatters';

interface ProductModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ item, onClose, onAddToCart }) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [temperature, setTemperature] = useState<string | undefined>(
    item.temperatureOptions ? item.defaultTemp || item.temperatureOptions[0] : undefined
  );
  const [sweetness, setSweetness] = useState<string | undefined>(
    item.sweetnessOptions ? item.sweetnessOptions[0] : undefined
  );
  const [ice, setIce] = useState<string | undefined>(
    item.iceOptions ? item.iceOptions[0] : undefined
  );
  const [espressoShot, setEspressoShot] = useState<string | undefined>(
    item.espressoShotOptions ? item.espressoShotOptions[0] : undefined
  );
  const [flavor, setFlavor] = useState<string | undefined>(
    item.flavorOptions ? item.flavorOptions[0] : undefined
  );
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [note, setNote] = useState('');
  const [imageError, setImageError] = useState(false);

  // Quick chips for common notes
  const quickNotes = [
    'Sedikit gula',
    'Tanpa es',
    'Es dipisah',
    'Gula cair dipisah',
    'Pedas sedang',
    'Sambal dipisah',
  ];

  const handleToggleAddOn = (addOn: AddOnOption) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.id === addOn.id);
      if (exists) {
        return prev.filter((a) => a.id !== addOn.id);
      } else {
        return [...prev, addOn];
      }
    });
  };

  const singlePrice = calculateSingleItemPrice(item.price, selectedAddOns);
  const totalPrice = singlePrice * quantity;

  const handleAddOrder = () => {
    const selectedOpts: SelectedOptions = {
      temperature,
      sweetness,
      ice,
      espressoShot,
      flavor,
      selectedAddOns,
      note: note.trim(),
    };

    const cartItemId = `${item.id}-${temperature || ''}-${sweetness || ''}-${ice || ''}-${espressoShot || ''}-${flavor || ''}-${selectedAddOns.map((a) => a.id).sort().join(',')}-${note.trim()}`;

    const cartItem: CartItem = {
      cartItemId,
      menuItem: item,
      quantity,
      selectedOptions: selectedOpts,
      itemTotalPrice: totalPrice,
    };

    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-lg bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header & Image */}
        <div className="relative h-44 sm:h-48 w-full bg-zinc-950 shrink-0">
          {!imageError && item.image ? (
            <img
              src={item.image}
              alt={item.name}
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-amber-500">
              <Coffee className="w-12 h-12 mb-2 opacity-50" />
              <span className="text-sm font-semibold">{item.name}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/40" />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badges on image */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            {item.badge && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500 text-zinc-950 shadow-md">
                {item.badge}
              </span>
            )}
            <span className="text-sm font-extrabold text-white bg-black/70 px-3 py-1 rounded-lg backdrop-blur-md tabular-nums ml-auto">
              {formatRupiah(item.price)}
            </span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-zinc-200">
          {/* Title & Description */}
          <div>
            <h2 className="text-xl font-extrabold text-white font-display">{item.name}</h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{item.description}</p>
          </div>

          {/* SECTION: Storytelling & Tasting Notes (Khusus Kopi Papua V60) */}
          {item.category === 'papua-v60' && (
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <Mountain className="w-4 h-4" />
                <span>Story & Karakter Arabika Pedalaman Papua</span>
              </div>
              {item.story && (
                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  "{item.story}"
                </p>
              )}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                {item.region && (
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{item.region}</span>
                  </div>
                )}
                {item.altitude && (
                  <div className="text-zinc-300">
                    <strong className="text-zinc-400">Elevasi:</strong> {item.altitude}
                  </div>
                )}
                {item.process && (
                  <div className="text-zinc-300">
                    <strong className="text-zinc-400">Proses:</strong> {item.process}
                  </div>
                )}
                {item.tastingNotes && (
                  <div className="text-amber-300 font-semibold">
                    <strong className="text-zinc-400">Notes:</strong> {item.tastingNotes.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION: Komposisi & Bahan Utama */}
          <div className="p-3 rounded-xl bg-zinc-800/60 border border-zinc-800 space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-semibold">
              <Info className="w-3.5 h-3.5 text-zinc-400" />
              <span>Komposisi & Penyajian</span>
            </div>
            <p className="text-xs text-zinc-300">{item.composition}</p>
          </div>

          {/* VARIANTS: Temperature (Hot / Iced Japanese / Iced) */}
          {item.temperatureOptions && (
            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                Penyajian Suhu
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.temperatureOptions.map((temp) => (
                  <button
                    key={temp}
                    type="button"
                    onClick={() => setTemperature(temp)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                      temperature === temp
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {temperature === temp && <Check className="w-3.5 h-3.5" />}
                    <span>{temp}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* VARIANTS: Espresso Shots (if available) */}
          {item.espressoShotOptions && (
            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                Pilihan Ekstraksi
              </label>
              <div className="grid grid-cols-3 gap-2">
                {item.espressoShotOptions.map((shot) => (
                  <button
                    key={shot}
                    type="button"
                    onClick={() => setEspressoShot(shot)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                      espressoShot === shot
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {shot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* VARIANTS: Flavor Options (Milkshake / Artisan Tea / Lauk) */}
          {item.flavorOptions && (
            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                Pilihan Varian / Rasa
              </label>
              <div className="space-y-1.5">
                {item.flavorOptions.map((flav) => (
                  <button
                    key={flav}
                    type="button"
                    onClick={() => setFlavor(flav)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-between text-left transition-all ${
                      flavor === flav
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span>{flav}</span>
                    {flavor === flav && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* VARIANTS: Sweetness Level */}
          {item.sweetnessOptions && (
            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                Tingkat Kemanisan (Sweetness)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {item.sweetnessOptions.map((sweet) => (
                  <button
                    key={sweet}
                    type="button"
                    onClick={() => setSweetness(sweet)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition-all ${
                      sweetness === sweet
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {sweet}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* VARIANTS: Ice Level */}
          {item.iceOptions && (
            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                Jumlah Es Batu (Ice Level)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {item.iceOptions.map((iceOpt) => (
                  <button
                    key={iceOpt}
                    type="button"
                    onClick={() => setIce(iceOpt)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition-all ${
                      ice === iceOpt
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {iceOpt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: Add-On / Kustomisasi */}
          {item.availableAddOns && item.availableAddOns.length > 0 && (
            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                Pilihan Tambahan (Add-On)
              </label>
              <div className="space-y-2">
                {item.availableAddOns.map((addOn) => {
                  const isChecked = selectedAddOns.some((a) => a.id === addOn.id);
                  return (
                    <button
                      key={addOn.id}
                      type="button"
                      onClick={() => handleToggleAddOn(addOn)}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                        isChecked
                          ? 'bg-amber-500/10 border-amber-500/50 text-white'
                          : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isChecked ? 'bg-amber-500 border-amber-500 text-black' : 'border-zinc-500'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium">{addOn.name}</span>
                      </div>
                      <span className="text-xs font-bold text-amber-400">
                        +{formatRupiah(addOn.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION: Special Notes Textarea */}
          <div>
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
              Catatan Khusus untuk Barista/Dapur
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Sedikit gula, tanpa es, pisahkan sambal..."
              className="w-full p-2.5 bg-zinc-800 border border-zinc-700 focus:border-amber-500 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
            />
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickNotes.map((quick) => (
                <button
                  key={quick}
                  type="button"
                  onClick={() => setNote((prev) => (prev ? `${prev}, ${quick}` : quick))}
                  className="px-2 py-0.5 rounded-md text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700/60 transition-colors"
                >
                  +{quick}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer: Counter & Add to Cart Red CTA */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center gap-3 shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-zinc-800 rounded-xl border border-zinc-700 px-1 py-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white disabled:opacity-30"
              aria-label="Kurangi jumlah"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-white tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white"
              aria-label="Tambah jumlah"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Red Primary Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddOrder}
            className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-red-900/40 transition-all"
          >
            <span>Tambah ke Keranjang</span>
            <span className="tabular-nums font-extrabold">{formatRupiah(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
