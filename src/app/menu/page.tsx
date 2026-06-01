"use client";
// ============================================================
// src/app/menu/page.tsx
// ============================================================

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchMenu } from "@/services/menuData";
import MenuCard from "@/components/features/MenuCard";
import BottomNav from "@/components/layout/BottomNav";
import { useCart } from "@/hooks/useCart";
import { MenuItem, MenuCategory } from "@/types";

const categories: { label: string; value: MenuCategory }[] = [
  { label: "Semua", value: "semua" },
  { label: "🍚 Nasi", value: "nasi" },
  { label: "🍜 Mie", value: "mie" },
  { label: "🍢 Lauk", value: "lauk" },
  { label: "🥤 Minuman", value: "minuman" },
  { label: "🍰 Dessert", value: "dessert" },
];

export default function MenuPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("semua");
  const [search, setSearch] = useState("");
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [mouseStart, setMouseStart] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);
  const { totalItems, tableNumber } = useCart();

  const banners = [
    { id: 1, image: "/food_poster1.jpg" },
    { id: 2, image: "/food_poster2.jpg" },
    { id: 3, image: "/food_poster3.jpg" },
  ];

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      fetchMenu().then((data) => {
          setTimeout(() => {
            setMenuItems(data);
            setLoading(false);
        }, 2000); // Simulasi delay 1 detik
        });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filtered = menuItems.filter((item) => {
    const matchCat = activeCategory === "semua" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && item.available;
  });

  const popular: MenuItem[] = [];
  const rest = filtered;

  function SkeletonCard() {
  return (
    <div style={{
      display: "flex", gap: 14, alignItems: "center",
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: 14, marginBottom: 10,
    }}>
      {/* Thumbnail skeleton */}
      <div className="skeleton" style={{ width: 80, height: 80, borderRadius: "var(--radius-sm)", flexShrink: 0 }} />

      {/* Info skeleton */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="skeleton" style={{ height: 16, width: "60%", borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 12, width: "90%", borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 12, width: "70%", borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 14, width: "30%", borderRadius: 4 }} />
      </div>
    </div>
  );
}

  return (
    <main style={{
      height: "100vh",  
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      background: "var(--bg)",
    }}>

      {/* ══════════════════════════════════════
          HEADER — diam, tidak ikut scroll
      ══════════════════════════════════════ */}
      <div style={{
        flexShrink: 0,
        padding: "16px 20px",
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        zIndex: 50,
      }}>
        <div>
          <div style={{ fontFamily: "'Hammersmith One', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
            Waktunya Makan
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>
            Manjakan lidahmu dengan berbagai rasa
          </div>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{
            fontSize: 13, fontWeight: 700,
            color: "white",
            fontFamily: "'Poppins', sans-serif",
          }}>
            {tableNumber || "—"}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════
          KONTEN SCROLL
          Search + Banner + Chips + Menu List
          semuanya scroll bersama di sini
      ══════════════════════════════════════ */}
      <div className="hide-scrollbar" style={{
        flex: 1,
        overflowY: "auto",
          }}>

        {/* SEARCH */}
        <div style={{ padding: "12px 20px", background: "var(--bg-card)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "var(--bg)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)", padding: "11px 14px",
          }}>
            <svg viewBox="0 0 24 24" width={17} height={17} stroke="var(--text-light)"
              fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Cari makanan atau minuman..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "none", background: "transparent",
                fontFamily: "'Poppins', sans-serif",
                fontSize: 14, color: "var(--text)", outline: "none", width: "100%",
              }}
            />
          </div>
        </div>

        {/* BANNER CAROUSEL */}
        <div style={{ padding: "0 20px 12px", background: "var(--bg-card)" }}>
          <div style={{ overflow: "hidden", borderRadius: 16 }}>
            <div
              style={{
                display: "flex",
                width: `${banners.length * 100}%`,
                transform: `translateX(-${activeBanner * (100 / banners.length)}%)`,
                transition: "transform 0.5s ease",
                cursor: isDragging ? "grabbing" : "grab",
                userSelect: "none",
              }}
              onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchStart === null) return;
                const diff = touchStart - e.changedTouches[0].clientX;
                if (diff > 50) setActiveBanner((prev) => (prev + 1) % banners.length);
                else if (diff < -50) setActiveBanner((prev) => (prev - 1 + banners.length) % banners.length);
                setTouchStart(null);
              }}
              onMouseDown={(e) => { setMouseStart(e.clientX); setIsDragging(true); }}
              onMouseUp={(e) => {
                if (mouseStart === null) return;
                const diff = mouseStart - e.clientX;
                if (diff > 50) setActiveBanner((prev) => (prev + 1) % banners.length);
                else if (diff < -50) setActiveBanner((prev) => (prev - 1 + banners.length) % banners.length);
                setMouseStart(null);
                setIsDragging(false);
              }}
              onMouseLeave={() => { setMouseStart(null); setIsDragging(false); }}
            >
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  style={{
                    width: `${100 / banners.length}%`,
                    flexShrink: 0,
                    paddingRight: banner.id !== banners.length ? 8 : 0,
                  }}
                >
                  <img
                    src={banner.image}
                    alt={`Banner ${banner.id}`}
                    draggable={false}
                    style={{
                      width: "100%", height: 150,
                      objectFit: "cover", borderRadius: 12,
                      display: "block", pointerEvents: "none",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicator */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                style={{
                  width: i === activeBanner ? 20 : 6,
                  height: 6, borderRadius: 999,
                  background: i === activeBanner ? "var(--accent)" : "#CBD5E1",
                  border: "none", cursor: "pointer",
                  transition: "all 0.3s ease", padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* CATEGORY CHIPS */}
        <div className="hide-scrollbar" style={{
          display: "flex", gap: 8, overflowX: "auto",
          padding: "12px 20px",
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
        }}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              style={{
                flexShrink: 0, padding: "7px 16px", borderRadius: 999,
                border: "1px solid var(--border)",
                background: activeCategory === cat.value ? "var(--accent)" : "var(--bg)",
                color: activeCategory === cat.value ? "#FFFFFF" : "var(--text-muted)",
                fontFamily: "'Poppins', sans-serif",
                fontSize: 13, fontWeight: activeCategory === cat.value ? 500 : 400,
                cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* MENU LIST */}
        <div style={{ padding: "16px 20px 90px" }}>
          {loading ? (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </>
          ) : (
            <>
              {rest.length > 0 && rest.map((item) => <MenuCard key={item.id} item={item} />)}
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                  <p>Menu tidak ditemukan</p>
                </div>
              )}
            </>
          )}
        </div>

      </div>
      {/* ← tutup div scroll di sini */}

      <BottomNav />

    </main>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: "'Hammersmith One', sans-serif", fontSize: 15, fontWeight: 700,
      color: "var(--text)", marginBottom: 12, marginTop: 4,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      {children}
      <span style={{ flex: 1, height: 1, background: "var(--border)", display: "block" }} />
    </div>
  );
}