import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRupiah,
  parseTableNumber,
  calculateSingleItemPrice,
  calculateCartTotals,
  generateOrderCode,
} from './formatters';
import { CartItem, MenuItem } from '../types';

test('formatRupiah formats IDR correctly', () => {
  const result = formatRupiah(35000);
  assert.ok(result.includes('35.000'));
});

test('parseTableNumber extracts table from various query params', () => {
  assert.equal(parseTableNumber('?table=43'), '43');
  assert.equal(parseTableNumber('?meja=12'), '12');
  assert.equal(parseTableNumber('?t=7'), '7');
  assert.equal(parseTableNumber(''), '43'); // default fallback
});

test('calculateSingleItemPrice correctly adds add-on prices', () => {
  const basePrice = 30000;
  const addOns = [
    { id: 'shot', name: 'Extra Shot Espresso', price: 5000 },
    { id: 'cheese', name: 'Extra Cheese Foam', price: 5000 },
  ];
  assert.equal(calculateSingleItemPrice(basePrice, addOns), 40000);
  assert.equal(calculateSingleItemPrice(basePrice, []), 30000);
});

test('calculateCartTotals calculates subtotal, tax, grand total and item count correctly', () => {
  const mockMenuItem: MenuItem = {
    id: 'tolikara-v60',
    name: 'Tolikara V60',
    category: 'papua-v60',
    price: 35000,
    description: 'Caramel note',
    composition: 'Single origin',
    image: '',
    isAvailable: true,
  };

  const cartItems: CartItem[] = [
    {
      cartItemId: 'item-1',
      menuItem: mockMenuItem,
      quantity: 2,
      selectedOptions: {
        selectedAddOns: [{ id: 'shot', name: 'Extra Shot', price: 5000 }],
        note: '',
      },
      itemTotalPrice: (35000 + 5000) * 2, // 80,000
    },
    {
      cartItemId: 'item-2',
      menuItem: { ...mockMenuItem, id: 'pisang', name: 'Pisang Goreng', price: 20000 },
      quantity: 1,
      selectedOptions: {
        selectedAddOns: [],
        note: '',
      },
      itemTotalPrice: 20000,
    },
  ];

  const totals = calculateCartTotals(cartItems);
  assert.equal(totals.subtotal, 100000);
  assert.equal(totals.tax, 10000); // 10%
  assert.equal(totals.grandTotal, 110000);
  assert.equal(totals.totalItemsCount, 3);
});

test('generateOrderCode generates code with table prefix', () => {
  const code = generateOrderCode('43');
  assert.ok(code.startsWith('WBFC-43-'));
  assert.equal(code.split('-').length, 3);
});
