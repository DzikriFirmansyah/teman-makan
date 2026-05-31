"use client";
// ============================================================
// src/app/admin/page.tsx
// Halaman Admin — login + kelola pesanan
// URL: /admin
// ============================================================

import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "123456"; // ← ganti password sesuai keinginan

interface OrderItem {
  id: number;
  menuName: string;
  price: number;
  qty: number;
  note?: string;
}

interface Order {
  id: number;
  tableNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  serviceFee: number;
  total: number;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"incoming" | "history">("incoming");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const formatRupiah = (n: number) => "Rp " + Number(n).toLocaleString("id-ID");

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        })
      const data = await res.json();
      setOrders(data.sort((a: Order, b: Order) => b.id - a.id));
    } catch {
      console.error("Gagal fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
      // Auto refresh setiap 30 detik
      const interval = setInterval(fetchOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // Login
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Password salah!");
    }
  };

  // Complete order
  const handleComplete = async (orderId: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/complete`, {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            'ngrok-skip-browser-warning': 'true',
          },
        })
      setSelectedOrder(null);
      fetchOrders();
    } catch {
      alert("Gagal update status pesanan!");
    }
  };

  const incoming = orders.filter((o) => o.status === "paid" || o.status === "processing" || o.status === "pending");
  const history = orders.filter((o) => o.status === "completed");

  // ── LOGIN SCREEN ──
  if (!isLoggedIn) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #ffffff 0%, #EBF6FF 40%, #C8ECFF 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}>
        <div style={{
          background: "white", borderRadius: 20,
          padding: "36px 28px", width: "100%", maxWidth: 380,
          boxShadow: "0 8px 40px rgba(0,174,255,0.12)",
          textAlign: "center",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: "linear-gradient(135deg, #00AEFF, #0077CC)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: 28,
          }}>
            👨‍🍳
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22, fontWeight: 700, color: "#0A1628", marginBottom: 6,
          }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 24 }}>
            Masukkan password untuk melanjutkan
          </p>

          <input
            type="password"
            placeholder="Password admin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%", padding: "12px 16px",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 12, fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              outline: "none", marginBottom: 8,
              boxSizing: "border-box",
            }}
          />

          {error && (
            <p style={{ fontSize: 13, color: "#EF4444", marginBottom: 8 }}>{error}</p>
          )}

          <button
            onClick={handleLogin}
            style={{
              width: "100%", padding: 14,
              background: "linear-gradient(135deg, #00AEFF, #0088DD)",
              color: "white", border: "none", borderRadius: 12,
              fontSize: 15, fontWeight: 500, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              marginTop: 8,
            }}
          >
            Masuk
          </button>
        </div>
      </main>
    );
  }

  // ── ADMIN DASHBOARD ──
  return (
    <main style={{ minHeight: "100vh", background: "#F5F9FF", display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <div style={{
        background: "white", borderBottom: "1px solid rgba(0,0,0,0.08)",
        padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#0A1628" }}>
            Admin Panel
          </div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>Teman Makan</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={fetchOrders}
            style={{
              padding: "8px 14px", background: "#EBF6FF",
              border: "1px solid rgba(0,174,255,0.25)",
              borderRadius: 999, fontSize: 12, color: "#0077CC",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => setIsLoggedIn(false)}
            style={{
              padding: "8px 14px", background: "#FEE2E2",
              border: "none", borderRadius: 999,
              fontSize: 12, color: "#DC2626",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Keluar
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={{
        display: "flex", background: "white",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}>
        {[
          { key: "incoming", label: "Pesanan Masuk", count: incoming.length },
          { key: "history", label: "Riwayat Pesanan", count: history.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "incoming" | "history")}
            style={{
              flex: 1, padding: "14px 16px",
              background: "none", border: "none",
              borderBottom: activeTab === tab.key ? "2px solid #00AEFF" : "2px solid transparent",
              color: activeTab === tab.key ? "#00AEFF" : "#6B7280",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, fontWeight: 500, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span style={{
                background: activeTab === tab.key ? "#00AEFF" : "#9CA3AF",
                color: "white", fontSize: 11, fontWeight: 600,
                padding: "1px 7px", borderRadius: 999,
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: "16px 20px 40px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#6B7280" }}>
            Memuat pesanan...
          </div>
        )}

        {/* PESANAN MASUK */}
        {activeTab === "incoming" && !loading && (
          <>
            {incoming.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#6B7280" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🍽️</div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>
                  Belum ada pesanan masuk
                </p>
                <p style={{ fontSize: 13 }}>Pesanan baru akan muncul di sini</p>
              </div>
            ) : (
              incoming.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  style={{
                    background: "white", border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 16, padding: 16, marginBottom: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    cursor: "pointer", transition: "box-shadow 0.2s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#0A1628" }}>
                      Order #{order.id}
                    </div>
                    <span style={{
                      fontSize: 11, padding: "3px 10px", borderRadius: 999, fontWeight: 500,
                      background: "#FEF3C7", color: "#92400E",
                    }}>
                      ⏳ {order.status === "paid" ? "Dibayar" : "Pending"}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>
                    🪑 Meja {order.tableNumber}
                  </p>
                  <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 8 }}>
                    {order.items?.map((i) => `${i.menuName} x${i.qty}`).join(", ")}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                      {new Date(order.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#00AEFF" }}>
                      {formatRupiah(order.total)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* RIWAYAT PESANAN */}
        {activeTab === "history" && !loading && (
          <>
            {history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#6B7280" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>
                  Belum ada riwayat
                </p>
                <p style={{ fontSize: 13 }}>Pesanan yang selesai akan muncul di sini</p>
              </div>
            ) : (
              history.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  style={{
                    background: "white", border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 16, padding: 16, marginBottom: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    cursor: "pointer", opacity: 0.8,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#0A1628" }}>
                      Order #{order.id}
                    </div>
                    <span style={{
                      fontSize: 11, padding: "3px 10px", borderRadius: 999, fontWeight: 500,
                      background: "#D1FAE5", color: "#065F46",
                    }}>
                      ✓ Selesai
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>
                    🪑 Meja {order.tableNumber}
                  </p>
                  <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 8 }}>
                    {order.items?.map((i) => `${i.menuName} x${i.qty}`).join(", ")}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                      {new Date(order.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#00AEFF" }}>
                      {formatRupiah(order.total)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* MODAL DETAIL ORDER */}
      {selectedOrder && (
        <div
          onClick={() => setSelectedOrder(null)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white", borderRadius: "20px 20px 0 0",
              padding: "24px 20px 36px",
              width: "100%", maxWidth: 480,
              maxHeight: "80vh", overflowY: "auto",
              animation: "slideUp 0.3s ease",
            }}
          >
            {/* Handle */}
            <div style={{
              width: 40, height: 4, borderRadius: 999,
              background: "#E5E7EB", margin: "0 auto 20px",
            }} />

            {/* Header modal */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#0A1628" }}>
                  Order #{selectedOrder.id}
                </div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>
                  🪑 Meja {selectedOrder.tableNumber} · {new Date(selectedOrder.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              <span style={{
                fontSize: 11, padding: "4px 12px", borderRadius: 999, fontWeight: 500,
                background: selectedOrder.status === "completed" ? "#D1FAE5" : "#FEF3C7",
                color: selectedOrder.status === "completed" ? "#065F46" : "#92400E",
              }}>
                {selectedOrder.status === "completed" ? "✓ Selesai" : "⏳ Proses"}
              </span>
            </div>

            {/* Items */}
            <div style={{
              background: "#F5F9FF", borderRadius: 12,
              overflow: "hidden", marginBottom: 16,
            }}>
              {selectedOrder.items?.map((item, i) => (
                <div key={item.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  padding: "12px 16px",
                  borderBottom: i < selectedOrder.items.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#0A1628", marginBottom: 2 }}>
                      {item.menuName}
                    </div>
                    {item.note && (
                      <div style={{ fontSize: 11, color: "#9CA3AF", fontStyle: "italic" }}>
                        📝 {item.note}
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: "#6B7280" }}>
                      {formatRupiah(item.price)} × {item.qty}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#00AEFF" }}>
                    {formatRupiah(item.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{
              background: "#F5F9FF", borderRadius: 12,
              padding: "12px 16px", marginBottom: 20,
            }}>
              {[
                ["Subtotal", formatRupiah(selectedOrder.subtotal)],
                ["Pajak (10%)", formatRupiah(selectedOrder.tax)],
                ["Biaya layanan", formatRupiah(selectedOrder.serviceFee)],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6B7280", padding: "3px 0" }}>
                  <span>{label}</span><span>{val}</span>
                </div>
              ))}
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 16, fontWeight: 600, color: "#0A1628",
                paddingTop: 10, marginTop: 8,
                borderTop: "1px solid rgba(0,0,0,0.08)",
              }}>
                <span>Total</span>
                <span style={{ color: "#00AEFF" }}>{formatRupiah(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Tombol Done — hanya tampil kalau belum completed */}
            {selectedOrder.status !== "completed" && (
              <button
                onClick={() => handleComplete(selectedOrder.id)}
                style={{
                  width: "100%", padding: 15,
                  background: "linear-gradient(135deg, #00AEFF, #0088DD)",
                  color: "white", border: "none", borderRadius: 12,
                  fontSize: 15, fontWeight: 500, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                ✓ Tandai Selesai
              </button>
            )}

            {selectedOrder.status === "completed" && (
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  width: "100%", padding: 15,
                  background: "#F3F4F6", color: "#6B7280",
                  border: "none", borderRadius: 12,
                  fontSize: 15, fontWeight: 500, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Tutup
              </button>
            )}
          </div>
        </div>
      )}

    </main>
  );
}