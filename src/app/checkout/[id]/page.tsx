"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}
export default function CheckoutPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { items, total, formatRupiah, clearCart } = useCart();
  const totalItems = items.reduce((a, b) => a + b.qty, 0);
  const ORDER_ID = id;

  const handleSimulatePaid = async () => {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${ORDER_ID}/pay`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify({ paymentMethod: "QRIS" }),
        })
      clearCart();
      router.push(`/receipt/${ORDER_ID}`);
    } catch {
      alert("Gagal konfirmasi pembayaran!");
    }
  };

  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg)" }}>

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
            Pembayaran
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Order #{ORDER_ID}</div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 100px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Status pill */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "#FEF3C7", color: "#92400E",
            padding: "7px 18px", borderRadius: 999, fontSize: 13, fontWeight: 500,
          }}>
            <svg viewBox="0 0 24 24" width={14} height={14} stroke="currentColor" fill="none" strokeWidth={2} strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            Menunggu pembayaran
          </span>
        </div>

        {/* QR Card */}
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "24px 20px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
          boxShadow: "var(--shadow-card)",
        }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700 }}>
            Scan untuk membayar
          </p>
          <p style={{ fontSize: 28, fontWeight: 500, color: "var(--accent)" }}>
            {formatRupiah(total)}
          </p>

          {/* QR Code */}
          <div style={{ background: "white", borderRadius: 12, padding: 16, border: "1px solid var(--border)" }}>
            <img
              src="/qr.jpg"
              alt="QR Code Pembayaran"
              style={{ width: 180, height: 180, objectFit: "contain", display: "block" }}
            />
          </div>

          <p style={{ fontSize: 12, color: "var(--text-light)", textAlign: "center" }}>
            QRIS · GoPay · OVO · Dana · ShopeePay · Transfer Bank
          </p>
        </div>

        {/* Order info */}
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", overflow: "hidden", boxShadow: "var(--shadow)",
        }}>
          {[
            ["No. Order", `#${ORDER_ID}`],
            ["Meja", "05"],
            ["Jumlah item", `${totalItems} item`],
            ["Total", formatRupiah(total)],
          ].map(([label, val], i, arr) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 16px", fontSize: 14,
              borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <span style={{ color: "var(--text-muted)" }}>{label}</span>
              <span style={{ fontWeight: 500, color: i === arr.length - 1 ? "var(--accent)" : "var(--text)" }}>
                {val}
              </span>
            </div>
          ))}
        </div>

        {/* Simulasi bayar */}
        <button
          onClick={handleSimulatePaid}
          style={{
            width: "100%", padding: 15,
            background: "#1C7A4A", color: "white",
            border: "none", borderRadius: "var(--radius)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, fontWeight: 500, cursor: "pointer",
          }}
        >
          ✓ Simulasi: Pembayaran Berhasil
        </button>
        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-light)" }}>
          Tombol ini hanya untuk demo. Di production, status diperbarui otomatis dari payment gateway.
        </p>

      </div>
    </main>
  );
}