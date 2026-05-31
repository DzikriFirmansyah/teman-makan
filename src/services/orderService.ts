// ============================================================
// src/services/orderService.ts
// Service untuk komunikasi dengan backend API
// Semua fetch ke backend lewat sini — jangan langsung di halaman
// ============================================================

import { ApiResponse, Order } from "@/types";
import { CartItem } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ---- Buat order baru ----
export async function createOrder(
  tableNumber: string,
  tableFloor: string,
  items: CartItem[]
): Promise<ApiResponse<Order>> {
  try {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableNumber,
        tableFloor,
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          qty: i.qty,
          note: i.note,
        })),
      }),
    });
    return await res.json();
  } catch {
    return { success: false, error: "Gagal membuat pesanan. Coba lagi." };
  }
}

// ---- Ambil detail order by ID ----
export async function getOrder(orderId: string): Promise<ApiResponse<Order>> {
  try {
    const res = await fetch(`${API_URL}/api/orders/${orderId}`);
    return await res.json();
  } catch {
    return { success: false, error: "Gagal mengambil data pesanan." };
  }
}

// ---- Update status pembayaran ----
export async function confirmPayment(
  orderId: string,
  method: string
): Promise<ApiResponse<Order>> {
  try {
    const res = await fetch(`${API_URL}/api/orders/${orderId}/pay`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentMethod: method }),
    });
    return await res.json();
  } catch {
    return { success: false, error: "Gagal konfirmasi pembayaran." };
  }
}
