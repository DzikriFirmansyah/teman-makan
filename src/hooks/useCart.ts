// ============================================================
// src/hooks/useCart.ts
// Custom hook — shortcut akses cart store + helper formatting
// ============================================================

import { useCartStore } from "@/store/cartStore";
import { MenuItem } from "@/types";

export function useCart() {
  const store = useCartStore();

  // Format angka ke Rupiah: 38000 → "Rp 38.000"
  const formatRupiah = (amount: number): string =>
    "Rp " + amount.toLocaleString("id-ID");

  // Tambah item ke keranjang
  const addItem = (item: MenuItem, qty = 1, note = "") => {
    store.addItem(item, qty, note);
  };

  return {
    items: store.items,
    tableNumber: store.tableNumber,
    tableFloor: store.tableFloor,
    totalItems: store.getTotalItems(),
    subtotal: store.getSubtotal(),
    tax: store.getTax(),
    serviceFee: store.getServiceFee(),
    total: store.getTotal(),
    addItem,
    removeItem: store.removeItem,
    updateQty: store.updateQty,
    updateNote: store.updateNote,
    clearCart: store.clearCart,
    formatRupiah,
  };
}
