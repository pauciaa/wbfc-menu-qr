export type CategoryId =
  | 'all'
  | 'rekomendasi'
  | 'papua-v60'
  | 'espresso'
  | 'non-coffee'
  | 'makanan'
  | 'snack';

export interface Category {
  id: CategoryId;
  label: string;
  iconName: string;
}

export type PapuaTastingNote =
  | 'Caramel'
  | 'Brown Sugar'
  | 'Cinnamon'
  | 'Black Tea, Nutty'
  | 'Black Currant'
  | 'Brown Sugar & Dark Chocolate';

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  description: string;
  composition: string;
  image: string;
  badge?: '100% Kopi Papua' | 'Best Seller' | 'Stok Habis' | 'Signature';
  isAvailable: boolean;
  isRecommended?: boolean;
  tastingNotes?: PapuaTastingNote[];
  story?: string;
  region?: string;
  altitude?: string;
  process?: string;
  defaultTemp?: 'Hot' | 'Iced Japanese' | 'Iced';
  temperatureOptions?: ('Hot' | 'Iced Japanese' | 'Iced')[];
  sweetnessOptions?: ('Normal' | 'Less Sugar' | 'Less Sugar (50%)' | 'Less Sweet' | 'No Sugar')[];
  iceOptions?: ('Normal Ice' | 'Less Ice' | 'No Ice')[];
  espressoShotOptions?: ('Single' | 'Double' | 'Ristretto')[];
  flavorOptions?: string[]; // e.g. for milkshake: Vanilla, Strawberry, Coklat; Indomie: Kuah, Goreng
  availableAddOns?: AddOnOption[];
}

export interface SelectedOptions {
  temperature?: string;
  sweetness?: string;
  ice?: string;
  espressoShot?: string;
  flavor?: string;
  selectedAddOns: AddOnOption[];
  note: string;
}

export interface CartItem {
  cartItemId: string; // unique per configuration
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: SelectedOptions;
  itemTotalPrice: number; // (base + addons) * quantity
}

export interface OrderCustomer {
  name: string;
  phone: string;
  tableNumber: string;
}

export interface PlacedOrder {
  orderCode: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  tax: number;
  grandTotal: number;
  createdAt: string;
  status: 'Menunggu di Kasir' | 'Diproses' | 'Selesai';
}
