"use client";
// ============================================================
// src/app/cart/page.tsx
// Halaman keranjang belanja
// URL: /cart
// ============================================================

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import BottomNav from "@/components/layout/BottomNav";

export default function CartPage() {
  const router = useRouter();
  const { items, subtotal, tax, serviceFee, total, updateQty, removeItem, formatRupiah, tableNumber } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const handleOrder = async () => {
      setIsLoading(true);
      try {
        console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
        console.log("Sending order...");
    
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify({
            tableNumber: tableNumber || "00",
            items: items.map((ci) => ({
              menuId: Number(ci.menuItem.id),
              menuName: ci.menuItem.name,
              price: ci.menuItem.price,
              qty: ci.qty,
              note: ci.note || "",
            })),
            subtotal,
            tax,
            serviceFee,
            total,
          }),
        });

        console.log("Response status:", res.status);
        const order = await res.json();
        console.log("Order:", order);
        router.push(`/checkout/${order.id}`);
      } catch (err) {
        console.error("Error:", err);
        alert("Gagal membuat pesanan, coba lagi!");
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <main style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      background: "var(--bg)",
    }}>

      {/* TOP BAR */}
      <div style={{
        flexShrink: 0,
        display: "flex", alignItems: "center", gap: 12,
        padding: "16px 20px", background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        zIndex: 50,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "var(--bg)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}
        >
          <svg viewBox="0 0 24 24" width={18} height={18} stroke="var(--text)"
            fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700 }}>
            Keranjang
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {items.length === 0 ? "Kosong" : `${items.reduce((a,b) => a+b.qty, 0)} item`}
          </div>
        </div>
      </div>

      {/* BODY */}
      {/* cart body - padding bawah diperbesar */}
      <div className="hide-scrollbar" style={{
        flex: 1, overflowY: "auto",
        padding: "16px 20px 260px", // ← naikan jadi 260px agar tidak ketutup footer
      }}>

        {/* Empty state */}
        {items.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🛒</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
              Keranjang kosong
            </p>
            <p style={{ fontSize: 14, marginBottom: 20 }}>Yuk pilih menu dulu!</p>
            <button
              onClick={() => router.push("/menu")}
              style={{
                padding: "10px 24px", background: "var(--accent)", color: "white",
                border: "none", borderRadius: 999, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
              }}
            >
              Lihat Menu
            </button>
          </div>
        )}

        {/* Cart items */}
        {items.map((cartItem) => (
          <div key={cartItem.menuItem.id} style={{
            display: "flex", gap: 12, alignItems: "center",
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", padding: 12, marginBottom: 10,
            boxShadow: "var(--shadow)",
          }}>

            {/* Foto kiri */}
            <div style={{
              width: 70, height: 70, borderRadius: "var(--radius-sm)",
              background: cartItem.menuItem.bgColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, flexShrink: 0, overflow: "hidden",
            }}>
              {cartItem.menuItem.image ? (
                <img
                  src={cartItem.menuItem.image}
                  alt={cartItem.menuItem.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                cartItem.menuItem.emoji
              )}
            </div>

            {/* Nama + harga + delete — tengah */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 14, fontWeight: 700,
                color: "var(--text)", marginBottom: 4,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {cartItem.menuItem.name}
              </p>
              <p style={{
                fontSize: 14, fontWeight: 600,
                color: "var(--accent)", marginBottom: 8,
              }}>
                {formatRupiah(cartItem.menuItem.price)}
              </p>

              {/* Delete button */}
              <button
                onClick={() => removeItem(cartItem.menuItem.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "none", border: "none", cursor: "pointer",
                  padding: 0,
                }}
              >
                {/* Icon trash */}
                <svg viewBox="0 0 24 24" width={14} height={14}
                  stroke="#6B7280" fill="none" strokeWidth={1.8}
                  strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                </svg>
                <span style={{ fontSize: 12, color: "#6B7280" }}>Delete</span>
              </button>
            </div>

            {/* Qty control kanan — + angka - susun vertikal */}
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 6, flexShrink: 0,
            }}>
              <button
                onClick={() => updateQty(cartItem.menuItem.id, cartItem.qty + 1)}
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "var(--bg)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, cursor: "pointer", color: "var(--text)",
                  fontWeight: 300,
                }}
              >+</button>

              <span style={{
                fontSize: 15, fontWeight: 600,
                color: "var(--text)", minWidth: 20, textAlign: "center",
              }}>
                {cartItem.qty}
              </span>

              <button
                onClick={() => updateQty(cartItem.menuItem.id, cartItem.qty - 1)}
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "var(--bg)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, cursor: "pointer", color: "var(--text)",
                  fontWeight: 300,
                }}
              >−</button>
            </div>

          </div>
        ))}
      </div>

      {/* FOOTER — Summary + Tombol, fix di bawah */}
        {items.length > 0 && (
          <div style={{
            position: "fixed", bottom: 0, // ← ganti dari 60 ke 0
            left: "50%", transform: "translateX(-50%)",
            width: "100%", maxWidth: 430,
            background: "var(--bg-card)", borderTop: "1px solid var(--border)",
            padding: "12px 20px 80px", // ← padding bawah 80px untuk kasih ruang BottomNav
          }}>

          {/* Summary */}
          <div style={{
            background: "var(--bg)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", padding: "12px 14px",
            marginBottom: 10,
          }}>
            {[
              ["Subtotal", formatRupiah(subtotal)],
              ["Pajak (10%)", formatRupiah(tax)],
              ["Biaya layanan", formatRupiah(serviceFee)],
            ].map(([label, val]) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 13, color: "var(--text-muted)", padding: "4px 0",
              }}>
                <span>{label}</span><span>{val}</span>
              </div>
            ))}
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontSize: 15, fontWeight: 500, color: "var(--text)",
              paddingTop: 10, borderTop: "1px solid var(--border)", marginTop: 6,
            }}>
              <span>Total</span>
              <span style={{ color: "var(--accent)" }}>{formatRupiah(total)}</span>
            </div>
          </div>

          {/* Tombol Pesan */}
            <button
                onClick={handleOrder}
                disabled={isLoading}
                style={{
                    width: "100%", padding: 15,
                    background: isLoading ? "#9CA3AF" : "var(--accent)",
                    color: "#FAF7F2",
                    border: "none", borderRadius: "var(--radius)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15, fontWeight: 500, cursor: isLoading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
            >
                {isLoading ? "Memproses..." : `Pesan Sekarang · ${formatRupiah(total)}`}
            </button>

        </div>
      )}

      <BottomNav />
    </main>
  );
}
