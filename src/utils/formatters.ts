import { AddOnOption, CartItem, PlacedOrder } from '../types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseTableNumber(searchParams: string): string {
  const params = new URLSearchParams(searchParams);
  const table = params.get('table') || params.get('meja') || params.get('t');
  if (table && table.trim().length > 0) {
    return table.trim();
  }
  return '43'; // Default meja demo sesuai request
}

export function calculateSingleItemPrice(basePrice: number, selectedAddOns: AddOnOption[] = []): number {
  const addOnsTotal = selectedAddOns.reduce((sum, addOn) => sum + (addOn.price || 0), 0);
  return basePrice + addOnsTotal;
}

export function calculateCartTotals(items: CartItem[]): { subtotal: number; tax: number; grandTotal: number; totalItemsCount: number } {
  const subtotal = items.reduce((sum, item) => sum + item.itemTotalPrice, 0);
  // Cafe policy: harga sudah termasuk tax atau PB1 10%
  const tax = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + tax;
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, tax, grandTotal, totalItemsCount };
}

export function generateOrderCode(tableNumber: string): string {
  const cleanTable = tableNumber.replace(/[^0-9a-zA-Z]/g, '') || '01';
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `WBFC-${cleanTable}-${randomSuffix}`;
}

export function formatWhatsAppMessage(order: PlacedOrder): string {
  const lines: string[] = [
    `*PESANAN MENU DIGITAL WBFC BANDUNG*`,
    `--------------------------------------`,
    `*Kode Pesanan:* ${order.orderCode}`,
    `*Nomor Meja:* Meja ${order.customer.tableNumber}`,
    `*Atas Nama:* ${order.customer.name}`,
    order.customer.phone ? `*No. WA:* ${order.customer.phone}` : '',
    `*Waktu:* ${order.createdAt}`,
    `--------------------------------------`,
    `*RINCIAN PESANAN:*`,
  ];

  order.items.forEach((item, idx) => {
    const opts: string[] = [];
    if (item.selectedOptions.temperature) opts.push(item.selectedOptions.temperature);
    if (item.selectedOptions.sweetness) opts.push(item.selectedOptions.sweetness);
    if (item.selectedOptions.ice) opts.push(item.selectedOptions.ice);
    if (item.selectedOptions.espressoShot) opts.push(item.selectedOptions.espressoShot);
    if (item.selectedOptions.flavor) opts.push(item.selectedOptions.flavor);
    item.selectedOptions.selectedAddOns.forEach((a) => opts.push(`+${a.name}`));

    lines.push(`${idx + 1}. *${item.menuItem.name}* (x${item.quantity}) - ${formatRupiah(item.itemTotalPrice)}`);
    if (opts.length > 0) {
      lines.push(`   _Varian: ${opts.join(', ')}_`);
    }
    if (item.selectedOptions.note) {
      lines.push(`   _Catatan: "${item.selectedOptions.note}"_`);
    }
  });

  lines.push(`--------------------------------------`);
  lines.push(`*Subtotal:* ${formatRupiah(order.subtotal)}`);
  lines.push(`*PB1 (10%):* ${formatRupiah(order.tax)}`);
  lines.push(`*TOTAL BAYAR:* ${formatRupiah(order.grandTotal)}`);
  lines.push(`*Metode:* Bayar di Kasir (Tunai / QRIS)`);
  lines.push(`--------------------------------------`);
  lines.push(`_Tunjukkan QR Code / Kode Pesanan ini ke kasir WBFC Batununggal._`);

  return lines.filter(Boolean).join('\n');
}
