import { MENU_ITEMS, CATEGORIES, TASTING_NOTES_LIST } from '../data/menuData';

export function getStandaloneHtmlCode(): string {
  // Generate standalone 1-file HTML with Tailwind CDN, complete WBFC dataset, and interactive vanilla JS
  return `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Waanal Brothers Food & Coffee - Digital Menu QR</title>
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              charcoal: '#121212',
              card: '#18181B',
              gold: '#F59E0B',
              red: '#DC2626'
            }
          }
        }
      }
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <!-- QRCode library -->
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #121212; color: #F4F4F5; }
    h1, h2, h3, .font-display { font-family: 'Outfit', sans-serif; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="bg-[#121212] text-zinc-100 min-h-screen pb-24 antialiased selection:bg-amber-500 selection:text-black">

  <!-- TOP HEADER -->
  <header class="sticky top-0 z-30 bg-[#121212]/95 backdrop-blur-md border-b border-zinc-800">
    <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-black">
          <i data-lucide="coffee" class="w-5 h-5"></i>
        </div>
        <div>
          <h1 class="text-sm sm:text-base font-extrabold tracking-tight text-white uppercase font-display leading-tight">
            WAANAL BROTHERS
          </h1>
          <p class="text-[11px] text-zinc-400 flex items-center gap-1">
            <i data-lucide="map-pin" class="w-3 h-3 text-amber-500 inline"></i>
            Jl. Batununggal Indah I No. 66, Bandung
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div id="table-badge" class="px-3 py-1.5 rounded-lg bg-zinc-800 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer" onclick="promptChangeTable()">
          <i data-lucide="qr-code" class="w-3.5 h-3.5"></i>
          <span id="table-number-text">Meja 43</span>
        </div>
      </div>
    </div>
  </header>

  <!-- SEARCH & CATEGORY BAR -->
  <div class="sticky top-[58px] z-20 bg-[#121212]/95 backdrop-blur-md border-b border-zinc-800 pt-2 pb-2.5">
    <div class="max-w-4xl mx-auto px-4 space-y-2">
      <!-- Search & Tasting Note Filter -->
      <div class="flex gap-2">
        <div class="relative flex-1">
          <input id="search-input" type="text" oninput="handleSearch(this.value)" placeholder="Cari V60, espresso, nasgor, snack..." class="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500">
          <i data-lucide="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"></i>
        </div>
        <select id="tasting-select" onchange="handleTastingFilter(this.value)" class="bg-zinc-900 text-xs font-medium text-amber-400 border border-zinc-800 rounded-xl px-2.5 py-2 focus:outline-none">
          <option value="">Semua Notes</option>
          <option value="Caramel">Caramel</option>
          <option value="Brown Sugar">Brown Sugar</option>
          <option value="Cinnamon">Cinnamon</option>
          <option value="Black Tea, Nutty">Black Tea / Nutty</option>
          <option value="Black Currant">Black Currant</option>
          <option value="Brown Sugar & Dark Chocolate">Dark Chocolate</option>
        </select>
      </div>

      <!-- Categories Scrollable Tabs -->
      <div id="category-tabs" class="flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
        <!-- Rendered by JS -->
      </div>
    </div>
  </div>

  <!-- MAIN CATALOG CONTENT -->
  <main class="max-w-4xl mx-auto px-4 py-4">
    <div id="menu-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
      <!-- Cards rendered by JS -->
    </div>
  </main>

  <!-- FLOATING CART BAR -->
  <div id="floating-cart" class="fixed bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/95 to-transparent z-40 hidden">
    <div class="max-w-md mx-auto">
      <button onclick="openCartModal()" class="w-full py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-between shadow-xl shadow-red-950">
        <div class="flex items-center gap-2">
          <i data-lucide="shopping-bag" class="w-5 h-5"></i>
          <span id="cart-btn-label">Lihat Keranjang (0 item)</span>
        </div>
        <span id="cart-btn-total" class="font-extrabold">Rp 0</span>
      </button>
    </div>
  </div>

  <!-- MODAL DETAIL / KUSTOMISASI -->
  <div id="modal-detail" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm hidden">
    <div class="w-full sm:max-w-md bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
      <div class="relative aspect-video w-full bg-zinc-950">
        <img id="detail-img" src="" alt="Menu" class="w-full h-full object-cover">
        <button onclick="closeDetailModal()" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="p-4 overflow-y-auto space-y-3.5 flex-1">
        <div>
          <h2 id="detail-name" class="text-lg font-extrabold text-white font-display"></h2>
          <p id="detail-desc" class="text-xs text-zinc-400 mt-1"></p>
        </div>
        <div id="detail-story-box" class="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs hidden">
          <span class="font-bold text-amber-400 block mb-1">Story Kopi Pedalaman Papua</span>
          <p id="detail-story" class="italic text-zinc-300"></p>
        </div>
        <div class="p-2.5 rounded-xl bg-zinc-800/60 text-xs text-zinc-300">
          <span class="text-zinc-400 font-semibold block mb-0.5">Komposisi:</span>
          <p id="detail-comp"></p>
        </div>
        <!-- Add Ons -->
        <div id="detail-addons-box" class="space-y-1.5">
          <label class="text-xs font-bold text-zinc-300 uppercase tracking-wider block">Add-On Tambahan</label>
          <div id="detail-addons-list" class="space-y-1.5"></div>
        </div>
        <!-- Note -->
        <div>
          <label class="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">Catatan Khusus</label>
          <input id="detail-note" type="text" placeholder="Contoh: Sedikit gula, tanpa es..." class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white">
        </div>
      </div>
      <div class="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center gap-3">
        <div class="flex items-center bg-zinc-800 rounded-xl px-2 py-1 border border-zinc-700">
          <button onclick="adjustDetailQty(-1)" class="px-2 text-zinc-300 font-bold">-</button>
          <span id="detail-qty" class="w-6 text-center text-sm font-bold">1</span>
          <button onclick="adjustDetailQty(1)" class="px-2 text-zinc-300 font-bold">+</button>
        </div>
        <button onclick="confirmAddToCart()" class="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm flex justify-between">
          <span>Tambah Pesanan</span>
          <span id="detail-total-price">Rp 0</span>
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL KERANJANG & CHECKOUT -->
  <div id="modal-cart" class="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm hidden">
    <div class="w-full sm:max-w-md bg-zinc-900 border-l border-zinc-800 h-full flex flex-col shadow-2xl">
      <div class="p-4 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <i data-lucide="shopping-bag" class="w-5 h-5 text-amber-500"></i>
          <h2 class="text-base font-bold text-white">Pesanan Anda</h2>
        </div>
        <button onclick="closeCartModal()" class="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 flex items-center justify-center">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <div id="cart-items-container" class="flex-1 overflow-y-auto p-4 space-y-3">
        <!-- Rendered by JS -->
      </div>
      <div class="p-4 bg-zinc-950 border-t border-zinc-800 space-y-3">
        <div class="space-y-2">
          <input id="customer-name" type="text" placeholder="Nama Pelanggan (Wajib)" class="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white">
          <input id="customer-phone" type="tel" placeholder="Nomor WhatsApp (Opsional)" class="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white">
        </div>
        <div class="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
          <span>Total Bayar (inc. PB1 10%)</span>
          <span id="cart-grand-total" class="text-amber-400 font-extrabold">Rp 0</span>
        </div>
        <button onclick="processCheckout()" class="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg">
          <span>Bayar di Kasir</span>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL SUKSES DENGAN QR KASIR -->
  <div id="modal-success" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md hidden">
    <div class="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-5 text-center space-y-3">
      <div class="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
        <i data-lucide="check-circle" class="w-7 h-7"></i>
      </div>
      <h3 class="text-base font-bold text-white">Pesanan Terkirim ke Kasir!</h3>
      <div class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
        <span class="text-[11px] text-amber-400 font-bold block">Kode Transaksi:</span>
        <span id="success-code" class="text-xl font-black text-white font-mono"></span>
      </div>
      <div class="p-3 bg-white rounded-xl inline-block">
        <canvas id="success-qr-canvas"></canvas>
      </div>
      <p class="text-xs text-zinc-400">Tunjukkan QR Code ini kepada Kasir WBFC Bandung di Jl. Batununggal Indah I No. 66.</p>
      <button onclick="resetOrderFlow()" class="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl">
        Buat Pesanan Baru
      </button>
    </div>
  </div>

  <script>
    // DATA MENU WBFC BANDUNG
    const MENU_DATA = ${JSON.stringify(MENU_ITEMS, null, 2)};
    const CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2)};

    let cart = [];
    let currentCategory = 'all';
    let currentSearch = '';
    let currentTastingNote = '';
    let selectedMenuItem = null;
    let selectedAddOns = [];
    let modalQuantity = 1;
    let tableNumber = new URLSearchParams(window.location.search).get('table') || '43';

    function init() {
      document.getElementById('table-number-text').innerText = 'Meja ' + tableNumber;
      renderCategoryTabs();
      renderMenu();
      lucide.createIcons();
    }

    function formatRupiah(val) {
      return 'Rp ' + Number(val).toLocaleString('id-ID');
    }

    function promptChangeTable() {
      const val = prompt('Ubah nomor meja:', tableNumber);
      if (val && val.trim()) {
        tableNumber = val.trim();
        document.getElementById('table-number-text').innerText = 'Meja ' + tableNumber;
      }
    }

    function renderCategoryTabs() {
      const container = document.getElementById('category-tabs');
      container.innerHTML = CATEGORIES.map(cat => \`
        <button onclick="selectCategory('\${cat.id}')" class="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap \${currentCategory === cat.id ? 'bg-amber-500 text-zinc-950 font-bold' : 'bg-zinc-900 text-zinc-300 border border-zinc-800'}">
          \${cat.label}
        </button>
      \`).join('');
    }

    function selectCategory(catId) {
      currentCategory = catId;
      renderCategoryTabs();
      renderMenu();
    }

    function handleSearch(q) {
      currentSearch = q.toLowerCase();
      renderMenu();
    }

    function handleTastingFilter(note) {
      currentTastingNote = note;
      renderMenu();
    }

    function renderMenu() {
      const grid = document.getElementById('menu-grid');
      const filtered = MENU_DATA.filter(item => {
        const matchCat = currentCategory === 'all' || (currentCategory === 'rekomendasi' ? item.isRecommended : item.category === currentCategory);
        const matchSearch = !currentSearch || item.name.toLowerCase().includes(currentSearch) || item.description.toLowerCase().includes(currentSearch);
        const matchTasting = !currentTastingNote || (item.tastingNotes && item.tastingNotes.some(n => n.includes(currentTastingNote)));
        return matchCat && matchSearch && matchTasting;
      });

      if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full py-12 text-center text-zinc-500 text-xs">Tidak ada menu yang sesuai kriteria pencarian.</div>';
        return;
      }

      grid.innerHTML = filtered.map(item => {
        const isOutOfStock = !item.isAvailable;
        return \`
          <div onclick="\${isOutOfStock ? '' : \`openDetailModal('\${item.id}')\`}" class="bg-zinc-900 border \${isOutOfStock ? 'border-zinc-800 opacity-60' : 'border-zinc-800 hover:border-amber-500/50 cursor-pointer'} rounded-2xl overflow-hidden flex flex-col">
            <div class="relative aspect-video bg-zinc-950">
              <img src="\${item.image}" alt="\${item.name}" class="w-full h-full object-cover \${isOutOfStock ? 'grayscale' : ''}">
              \${item.badge ? \`<span class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">\${item.badge}</span>\` : ''}
              \${item.tastingNotes ? \`<span class="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-amber-300">Notes: \${item.tastingNotes.join(', ')}</span>\` : ''}
            </div>
            <div class="p-3.5 flex flex-col justify-between flex-1 gap-2">
              <div>
                <h3 class="text-sm font-bold text-white line-clamp-1">\${item.name}</h3>
                <p class="text-xs text-zinc-400 line-clamp-2 mt-0.5">\${item.description}</p>
              </div>
              <div class="flex items-center justify-between pt-2 border-t border-zinc-800">
                <span class="text-sm font-extrabold text-amber-400">\${formatRupiah(item.price)}</span>
                <button class="px-3 py-1.5 rounded-xl text-xs font-bold \${isOutOfStock ? 'bg-zinc-800 text-zinc-500' : 'bg-red-600 text-white'}">
                  \${isOutOfStock ? 'Habis' : '+ Pesan'}
                </button>
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function openDetailModal(itemId) {
      selectedMenuItem = MENU_DATA.find(i => i.id === itemId);
      if (!selectedMenuItem) return;
      selectedAddOns = [];
      modalQuantity = 1;

      document.getElementById('detail-img').src = selectedMenuItem.image;
      document.getElementById('detail-name').innerText = selectedMenuItem.name;
      document.getElementById('detail-desc').innerText = selectedMenuItem.description;
      document.getElementById('detail-comp').innerText = selectedMenuItem.composition;
      document.getElementById('detail-note').value = '';

      const storyBox = document.getElementById('detail-story-box');
      if (selectedMenuItem.story) {
        storyBox.classList.remove('hidden');
        document.getElementById('detail-story').innerText = selectedMenuItem.story;
      } else {
        storyBox.classList.add('hidden');
      }

      // Addons
      const addonsBox = document.getElementById('detail-addons-box');
      const addonsList = document.getElementById('detail-addons-list');
      if (selectedMenuItem.availableAddOns && selectedMenuItem.availableAddOns.length > 0) {
        addonsBox.classList.remove('hidden');
        addonsList.innerHTML = selectedMenuItem.availableAddOns.map(add => \`
          <label class="flex items-center justify-between p-2 rounded-lg bg-zinc-800 text-xs cursor-pointer">
            <span class="flex items-center gap-2">
              <input type="checkbox" onchange="toggleAddon('\${add.id}', \${add.price}, this.checked)" class="accent-amber-500">
              <span>\${add.name}</span>
            </span>
            <span class="text-amber-400 font-bold">+\${formatRupiah(add.price)}</span>
          </label>
        \`).join('');
      } else {
        addonsBox.classList.add('hidden');
      }

      updateDetailPrice();
      document.getElementById('modal-detail').classList.remove('hidden');
      lucide.createIcons();
    }

    function closeDetailModal() {
      document.getElementById('modal-detail').classList.add('hidden');
    }

    function toggleAddon(id, price, isChecked) {
      const addOnObj = selectedMenuItem.availableAddOns.find(a => a.id === id);
      if (isChecked) {
        selectedAddOns.push(addOnObj);
      } else {
        selectedAddOns = selectedAddOns.filter(a => a.id !== id);
      }
      updateDetailPrice();
    }

    function adjustDetailQty(delta) {
      modalQuantity = Math.max(1, modalQuantity + delta);
      document.getElementById('detail-qty').innerText = modalQuantity;
      updateDetailPrice();
    }

    function updateDetailPrice() {
      if (!selectedMenuItem) return;
      const addOnsTotal = selectedAddOns.reduce((s, a) => s + a.price, 0);
      const total = (selectedMenuItem.price + addOnsTotal) * modalQuantity;
      document.getElementById('detail-total-price').innerText = formatRupiah(total);
    }

    function confirmAddToCart() {
      const addOnsTotal = selectedAddOns.reduce((s, a) => s + a.price, 0);
      const singlePrice = selectedMenuItem.price + addOnsTotal;
      const note = document.getElementById('detail-note').value;

      cart.push({
        id: selectedMenuItem.id + '-' + Date.now(),
        item: selectedMenuItem,
        quantity: modalQuantity,
        addOns: [...selectedAddOns],
        note: note,
        totalPrice: singlePrice * modalQuantity
      });

      closeDetailModal();
      updateCartUI();
    }

    function updateCartUI() {
      const floating = document.getElementById('floating-cart');
      const totalCount = cart.reduce((s, i) => s + i.quantity, 0);
      const subtotal = cart.reduce((s, i) => s + i.totalPrice, 0);

      if (totalCount > 0) {
        floating.classList.remove('hidden');
        document.getElementById('cart-btn-label').innerText = \`Lihat Keranjang (\${totalCount} item)\`;
        document.getElementById('cart-btn-total').innerText = formatRupiah(subtotal);
      } else {
        floating.classList.add('hidden');
      }
    }

    function openCartModal() {
      const container = document.getElementById('cart-items-container');
      const subtotal = cart.reduce((s, i) => s + i.totalPrice, 0);
      const tax = Math.round(subtotal * 0.1);
      const grandTotal = subtotal + tax;

      document.getElementById('cart-grand-total').innerText = formatRupiah(grandTotal);

      if (cart.length === 0) {
        container.innerHTML = '<div class="py-8 text-center text-zinc-500 text-xs">Keranjang masih kosong.</div>';
      } else {
        container.innerHTML = cart.map((c, idx) => \`
          <div class="p-3 bg-zinc-800/80 rounded-xl space-y-1 text-xs">
            <div class="flex justify-between font-bold text-white">
              <span>\${c.quantity}x \${c.item.name}</span>
              <span class="text-amber-400">\${formatRupiah(c.totalPrice)}</span>
            </div>
            \${c.addOns.length ? \`<div class="text-[11px] text-zinc-400">Add-On: \${c.addOns.map(a => a.name).join(', ')}</div>\` : ''}
            \${c.note ? \`<div class="text-[11px] text-zinc-400 italic">Catatan: "\${c.note}"</div>\` : ''}
            <button onclick="removeCartItem(\${idx})" class="text-[11px] text-red-400 hover:underline pt-1">Hapus</button>
          </div>
        \`).join('');
      }

      document.getElementById('modal-cart').classList.remove('hidden');
      lucide.createIcons();
    }

    function closeCartModal() {
      document.getElementById('modal-cart').classList.add('hidden');
    }

    function removeCartItem(idx) {
      cart.splice(idx, 1);
      openCartModal();
      updateCartUI();
    }

    function processCheckout() {
      const name = document.getElementById('customer-name').value.trim();
      if (!name) {
        alert('Mohon masukkan nama pemesan!');
        return;
      }
      const orderCode = 'WBFC-' + tableNumber + '-' + Math.floor(1000 + Math.random() * 9000);
      document.getElementById('success-code').innerText = orderCode;

      QRCode.toCanvas(document.getElementById('success-qr-canvas'), orderCode, { width: 160 }, function() {});

      cart = [];
      updateCartUI();
      closeCartModal();
      document.getElementById('modal-success').classList.remove('hidden');
      lucide.createIcons();
    }

    function resetOrderFlow() {
      document.getElementById('modal-success').classList.add('hidden');
    }

    window.onload = init;
  </script>
</body>
</html>`;
}
