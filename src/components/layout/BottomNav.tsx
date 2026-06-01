"use client";
// ============================================================
// src/components/layout/BottomNav.tsx
// Navigasi bawah — dipakai di Menu, Cart, dll
// ============================================================

import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Home, ShoppingCart, ReceiptText } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems } = useCart();

    const tabs = [
        {
            label: "Menu",
            path: "/menu",
            icon: <Home size={22} strokeWidth={1.7} />,
        },
        {
            label: "Keranjang",
            path: "/cart",
            badge: totalItems > 0 ? totalItems : undefined,
            icon: <ShoppingCart size={22} strokeWidth={1.7} />,
        },
        {
            label: "Pesanan",
            path: "/receipt",
            icon: <ReceiptText size={22} strokeWidth={1.7} />,
        },
    ];

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      background: "var(--bg-card)", borderTop: "1px solid var(--border)",
      display: "flex", justifyContent: "space-around",
      padding: "10px 0 20px", zIndex: 40,
    }}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.path || pathname.startsWith(tab.path + "/");
        return (
          <button
            key={tab.path}
            onClick={() => router.push(tab.path)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 4, background: "none", border: "none", cursor: "pointer",
              padding: "4px 20px", position: "relative",
              color: isActive ? "var(--accent)" : "var(--text-light)",
              fontFamily: "'Poppins', sans-serif",
              transition: "color 0.15s",
            }}
          >
            {tab.icon}
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.04em" }}>
              {tab.label}
            </span>
            {/* Badge count */}
            {tab.badge && (
                <span style={{
                  position: "absolute", top: 0, right: 10,
                  background: "var(--accent)", color: "white",
                  fontSize: 10, fontWeight: 600,
                  minWidth: 18, height: 18,        // ← minWidth bukan width, biar bisa melebar
                  borderRadius: 999,               // ← pill shape, bukan circle
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "2px solid var(--bg-card)",
                  padding: "0 4px",                // ← padding kiri kanan agar 2 digit tidak mepet
                }}>
                  {tab.badge > 99 ? "99+" : tab.badge}  {/* ← batas 99, bukan 9 */}
                </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
