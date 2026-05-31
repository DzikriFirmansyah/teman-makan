// ============================================================
// src/store/cartStore.ts
// State management untuk keranjang belanja (Zustand)
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, MenuItem } from "@/types";

interface CartStore {
  items: CartItem[];
  tableNumber: string;
  tableFloor: string;

  // Actions
  addItem: (menuItem: MenuItem, qty?: number, note?: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQty: (menuItemId: string, qty: number) => void;
  updateNote: (menuItemId: string, note: string) => void;
  clearCart: () => void;
  setTable: (number: string, floor: string) => void;

  // Computed (getter)
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getServiceFee: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      tableNumber: "05",
      tableFloor: "Lantai 2",

      addItem: (menuItem, qty = 1, note = "") => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.menuItem.id === menuItem.id
          );
          if (existing) {
            // Kalau sudah ada, tambah qty saja
            return {
              items: state.items.map((i) =>
                i.menuItem.id === menuItem.id
                  ? { ...i, qty: i.qty + qty }
                  : i
              ),
            };
          }
          // Kalau belum ada, push item baru
          return { items: [...state.items, { menuItem, qty, note }] };
        });
      },

      removeItem: (menuItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.menuItem.id !== menuItemId),
        }));
      },

      updateQty: (menuItemId, qty) => {
        if (qty <= 0) {
          get().removeItem(menuItemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.menuItem.id === menuItemId ? { ...i, qty } : i
          ),
        }));
      },

      updateNote: (menuItemId, note) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.menuItem.id === menuItemId ? { ...i, note } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      setTable: (number, floor) =>
        set({ tableNumber: number, tableFloor: floor }),

      // Computed values
      getTotalItems: () =>
        get().items.reduce((sum, i) => sum + i.qty, 0),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.menuItem.price * i.qty, 0),

      getTax: () => Math.round(get().getSubtotal() * 0.1),

      getServiceFee: () => 5000,

      getTotal: () =>
        get().getSubtotal() + get().getTax() + get().getServiceFee(),
    }),
    {
      name: "warung-cart", // key di localStorage
    }
  )
);
