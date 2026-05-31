"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import BottomNav from "@/components/layout/BottomNav";

interface Order {
  id: number;
  tableNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: { menuName: string; qty: number }[];
}

export default function ReceiptIndexPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { tableNumber } = useCart();

  useEffect(() => {
    const table = tableNumber || "";
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders?table=${table}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tableNumber]);

  const formatRupiah = (n: number) => "Rp " + Number(n).toLocaleString("id-ID");

  // Tampilkan hanya yang sudah dibayar atau selesai
  const displayOrders = orders.filter(
      (o) => o.status === "paid" || o.status === "completed"
  );

  if (loading) {
    return (
      <main style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Memuat pesanan...</p>
      </main>
    );
  }

  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg)" }}>

      {/* HEADER */}
      <div style={{
        flexShrink: 0,
        padding: "16px 20px",
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
          Riwayat Pesanan
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>
          {orders.length} pesanan
        </div>
      </div>

      {/* LIST */}
      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "16px 20px 90px" }}>

        {orders.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🧾</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
              Belum ada pesanan
            </p>
            <p style={{ fontSize: 14, marginBottom: 20 }}>Pesanan yang selesai akan muncul di sini</p>
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

        {displayOrders.map((order) => (
          <div
            key={order.id}
            onClick={() => router.push(`/receipt/${order.id}`)}
            style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: 16, marginBottom: 10,
              boxShadow: "var(--shadow)", cursor: "pointer",
              transition: "border-color 0.15s",
            }}
          >
            {/* Header card */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
                Order #{order.id}
              </div>
                <span style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 999, fontWeight: 500,
                    background: order.status === "completed" ? "#D1FAE5" : "#DBEAFE",
                    color: order.status === "completed" ? "#065F46" : "#1D4ED8",
                }}>
                    {order.status === "completed" ? "✓ Selesai" : "🍳 Sedang Disiapkan"}
                </span>
            </div>

            {/* Items preview */}
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
              {order.items?.map((i) => `${i.menuName} x${i.qty}`).join(", ")}
            </p>

            {/* Footer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--text-light)" }}>
                Meja {order.tableNumber}
              </span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "var(--accent)" }}>
                {formatRupiah(order.total)}
              </span>
            </div>
          </div>
        ))}

      </div>
      <BottomNav />
    </main>
  );
}