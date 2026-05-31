// ============================================================
// src/types/index.ts
// Semua TypeScript interface & type untuk seluruh aplikasi
// ============================================================

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;         // dalam Rupiah, contoh: 38000
  emoji: string;
  bgColor: string;
  category: MenuCategory;
  available: boolean;
  image?: string;       // URL gambar, opsional
}

export type MenuCategory =
  | "semua"
  | "nasi"
  | "mie"
  | "lauk"
  | "minuman"
  | "dessert";

export interface CartItem {
  menuItem: MenuItem;
  qty: number;
  note?: string;         // catatan untuk dapur
}

export interface Order {
  id: string;            // contoh: "WN-20250521-001"
  tableNumber: string;   // contoh: "05"
  tableFloor: string;    // contoh: "Lantai 2"
  items: CartItem[];
  subtotal: number;
  tax: number;           // 10% dari subtotal
  serviceFee: number;    // biaya layanan tetap
  total: number;
  status: OrderStatus;
  createdAt: Date;
  paidAt?: Date;
  paymentMethod?: string;
}

export type OrderStatus =
  | "pending"            // menunggu pembayaran
  | "paid"               // sudah bayar, antri dapur
  | "processing"         // sedang diproses dapur
  | "ready"              // siap diambil / diantar
  | "completed";         // selesai

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
