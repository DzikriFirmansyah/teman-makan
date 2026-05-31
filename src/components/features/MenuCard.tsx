"use client";
// ============================================================
// src/components/features/MenuCard.tsx
// Kartu item menu — dipakai di halaman /menu
// ============================================================

import { useRouter } from "next/navigation";
import { MenuItem } from "@/types";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [showNotif, setShowNotif] = useState(false);

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        addItem(item, 1);
        setShowNotif(true);
        setTimeout(() => {
            setShowNotif(false);
        }, 1000);
    };

  return (
    <div
      onClick={() => router.push(`/menu/${item.id}`)}
      style={{
        display: "flex", gap: 14, alignItems: "center",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 14, marginBottom: 10,
        cursor: "pointer", boxShadow: "var(--shadow)",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: 80, height: 80, borderRadius: "var(--radius-sm)",
        background: item.bgColor,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 36, flexShrink: 0,
        overflow: "hidden",
      }}>
        <img
                src={item.image}
                alt={item.name}
                style={{
                    width: "100%", height: "100%",
                    objectFit: "cover",   // ← foto tidak stretch, crop tengah
                    display: "block",
                }}
            />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {/* Name + tag */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 3 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
            {item.name}
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          marginBottom: 8,
        }}>
          {item.description}
        </p>

        {/* Price + add button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: "var(--accent)" }}>
            Rp {item.price.toLocaleString("id-ID")}
          </span>
          <button
            onClick={handleQuickAdd}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "var(--accent)", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "background 0.15s, transform 0.15s",
            }}
          >
            <svg viewBox="0 0 24 24" width={16} height={16} stroke="white" fill="none" strokeWidth={2.2} strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
        {/* POP UP */}
        {showNotif && (
            <div style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 999,
                background: "rgba(0,0,0,0.35)",
            }}>
                <div style={{
                    background: "var(--bg-card)",
                    borderRadius: 20,
                    padding: "28px 32px",
                    textAlign: "center",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
                    animation: "bounceIn 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards",
                    maxWidth: 280,
                    width: "80%",
                }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: "50%",
                        background: "var(--accent-light)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 16px",
                    }}>
                        <svg viewBox="0 0 24 24" width={32} height={32}
                            stroke="var(--accent)" fill="none"
                            strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <p style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 18, fontWeight: 700,
                        color: "var(--text)", marginBottom: 6,
                    }}>
                        Ditambahkan!
                    </p>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>
                        <strong style={{ color: "var(--text)" }}>{item.name}</strong>
                    </p>
                    <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                        berhasil masuk ke keranjang
                    </p>
                </div>
            </div>
        )}
    </div>
  );
}
