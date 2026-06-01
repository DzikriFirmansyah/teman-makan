"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useState, useEffect } from "react";
import { use } from "react";

interface OrderItem {
  id: number;
  menuName: string;
  price: number;
  qty: number;
}

interface Order {
  id: number;
  tableNumber: string;
  subtotal: number;
  tax: number;
  serviceFee: number;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function ReceiptPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchOrder = () => {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`, {
              headers: { 'ngrok-skip-browser-warning': 'true' },
          })
          .then((res) => res.json())
          .then((data) => {
            setOrder(data);
            setLoading(false);
            clearCart();
          })
          .catch(() => setLoading(false));
      };

      // Fetch pertama kali
      fetchOrder();

      // Polling setiap 10 detik
      const interval = setInterval(fetchOrder, 10000);

      // Cleanup saat halaman ditutup
      return () => clearInterval(interval);
    }, [id]);

  const formatRupiah = (n: number) => "Rp " + Number(n).toLocaleString("id-ID");

  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  if (loading) {
      return (
          <main className="page-enter" style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Memuat struk...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>😕</div>
        <p>Struk tidak ditemukan</p>
        <button onClick={() => router.push("/menu")} style={{ marginTop: 16, color: "var(--accent)" }}>
          Kembali ke Menu
        </button>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "20px 20px 40px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Hero */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "7px 18px", borderRadius: 999, fontSize: 13, fontWeight: 500,
            background: 
              order.status === "completed" ? "#D1FAE5" : 
              order.status === "paid" ? "#DBEAFE" : "#FEF3C7",
            color: 
              order.status === "completed" ? "#065F46" : 
              order.status === "paid" ? "#1D4ED8" : "#92400E",
          }}>
            {order.status === "completed" ? "✅ Pesanan Selesai" : 
             order.status === "paid" ? "🍳 Sedang Diproses Dapur" : 
             "⏳ Menunggu Pembayaran"}
          </span>
        </div>

        {/* Transaksi info */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", boxShadow: "var(--shadow)" }}>
          <div style={{ padding: "10px 16px", background: "var(--bg)", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-light)" }}>
            Detail Transaksi
          </div>
          {[
            ["No. Order", `#${order.id}`],
            ["Tanggal", `${dateStr}, ${timeStr}`],
            ["Meja", order.tableNumber],
            ["Metode", order.paymentMethod || "QRIS"],
          ].map(([label, val], i, arr) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 16px", fontSize: 13,
              borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <span style={{ color: "var(--text-muted)" }}>{label}</span>
              <span style={{ fontWeight: 500, color: "var(--text)" }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Items */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", boxShadow: "var(--shadow)" }}>
          <div style={{ padding: "10px 16px", background: "var(--bg)", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-light)" }}>
            Pesanan
          </div>

          {order.items.map((ci) => (
            <div key={ci.id} style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 16px", fontSize: 13,
              borderBottom: "1px dashed var(--border)",
            }}>
              <span style={{ color: "var(--text)" }}>{ci.menuName} x{ci.qty}</span>
              <span style={{ color: "var(--text-muted)" }}>{formatRupiah(ci.price * ci.qty)}</span>
            </div>
          ))}

          {[
            ["Subtotal", formatRupiah(order.subtotal)],
            ["Pajak (10%)", formatRupiah(order.tax)],
            ["Biaya layanan", formatRupiah(order.serviceFee)],
          ].map(([label, val]) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 16px", fontSize: 13,
              borderTop: "1px solid var(--border)",
            }}>
              <span style={{ color: "var(--text-muted)" }}>{label}</span>
              <span style={{ color: "var(--text)" }}>{val}</span>
            </div>
          ))}

          <div style={{
            display: "flex", justifyContent: "space-between",
            padding: "14px 16px", fontSize: 16, fontWeight: 500,
            background: "var(--accent-light)",
            borderTop: "1px solid var(--border)",
          }}>
            <span style={{ color: "var(--text)" }}>Total</span>
            <span style={{ color: "var(--accent)" }}>{formatRupiah(order.total)}</span>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
          🙏 Terima kasih sudah makan di sini!
        </p>

        <button
          onClick={() => router.push("/menu")}
          style={{
            width: "100%", padding: 15,
            background: "var(--accent)", color: "#FAF7F2",
            border: "none", borderRadius: "var(--radius)",
            fontFamily: "'Poppins', sans-serif",
            fontSize: 15, fontWeight: 500, cursor: "pointer",
          }}
        >
          Kembali ke Menu
        </button>
      </div>
    </main>
  );
}