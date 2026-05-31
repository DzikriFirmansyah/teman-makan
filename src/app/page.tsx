"use client";
// ============================================================
// src/app/page.tsx
// Halaman Splash — muncul pertama saat scan QR
// ============================================================

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function SplashPage() {
  const router = useRouter();
  const setTable = useCartStore((state) => state.setTable);
  const tableNumber = useCartStore((state) => state.tableNumber);
  const [currentTable, setCurrentTable] = useState("—");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");
    if (table) {
      setTable(table, "");
      setCurrentTable(table);
    } else if (tableNumber) {
      setCurrentTable(tableNumber);
    }
  }, []);

  return (
    <main
      className="page-enter"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #ffffff 0%, #EBF6FF 40%, #C8ECFF 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 28px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Lingkaran dekoratif besar - kiri atas */}
      <div style={{
        position: "absolute",
        width: 320, height: 320,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,174,255,0.15) 0%, transparent 70%)",
        top: -80, left: -80,
        pointerEvents: "none",
      }} />

      {/* Lingkaran dekoratif - kanan bawah */}
      <div style={{
        position: "absolute",
        width: 280, height: 280,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,174,255,0.12) 0%, transparent 70%)",
        bottom: -40, right: -60,
        pointerEvents: "none",
      }} />

      {/* Dot pattern dekoratif */}
      <div style={{
        position: "absolute",
        top: 40, right: 30,
        display: "grid",
        gridTemplateColumns: "repeat(5, 8px)",
        gap: 8,
        opacity: 0.25,
        pointerEvents: "none",
      }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} style={{
            width: 4, height: 4, borderRadius: "50%",
            background: "#00AEFF",
          }} />
        ))}
      </div>

      {/* Dot pattern kiri bawah */}
      <div style={{
        position: "absolute",
        bottom: 80, left: 24,
        display: "grid",
        gridTemplateColumns: "repeat(4, 8px)",
        gap: 8,
        opacity: 0.2,
        pointerEvents: "none",
      }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} style={{
            width: 4, height: 4, borderRadius: "50%",
            background: "#00AEFF",
          }} />
        ))}
      </div>

      {/* ---- KONTEN UTAMA ---- */}
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>

        {/* Icon / Logo mark */}
        <div style={{
          width: 72, height: 72,
          borderRadius: 20,
          background: "linear-gradient(135deg, #00AEFF, #0077CC)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          boxShadow: "0 8px 32px rgba(0,174,255,0.35)",
          fontSize: 32,
        }}>
          🍽️
        </div>

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 11, fontWeight: 500, letterSpacing: "0.12em",
          color: "#0077CC",
          textTransform: "uppercase",
          background: "rgba(0,174,255,0.10)",
          border: "1px solid rgba(0,174,255,0.25)",
          padding: "5px 14px",
          borderRadius: 999,
          marginBottom: 20,
        }}>
          ✦ Dine-in Order
        </div>

        {/* Nama restoran */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 42, fontWeight: 700,
          color: "#0A1628",
          lineHeight: 1.15,
          marginBottom: 10,
        }}>
          Teman<br />
          <span style={{ color: "#00AEFF" }}>
            Makan
          </span>
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize: 14,
          color: "#6B7280",
          fontWeight: 400,
          marginBottom: 28,
          lineHeight: 1.6,
        }}>
          Cita rasa autentik, pesan langsung dari mejamu
        </p>

        {/* Info card meja */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#FFFFFF",
          border: "1px solid rgba(0,174,255,0.20)",
          padding: "10px 20px",
          borderRadius: 12,
          marginBottom: 36,
          boxShadow: "0 2px 12px rgba(0,174,255,0.10)",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "rgba(0,174,255,0.10)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14,
          }}>🪑</div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 400 }}>Lokasi kamu</div>
            <div style={{ fontSize: 14, color: "#0A1628", fontWeight: 500 }}>
              Meja {currentTable}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/menu")}
          style={{
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg, #00AEFF, #0088DD)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 8px 24px rgba(0,174,255,0.40)",
            letterSpacing: "0.01em",
            marginBottom: 16,
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          Lihat Menu →
        </button>

        {/* Step indicator */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 6, marginTop: 4,
        }}>
          {["Scan QR", "Pesan", "Bayar", "Selesai"].map((step, i, arr) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>{step}</span>
              {i < arr.length - 1 && (
                <span style={{ fontSize: 11, color: "#C9E8FF" }}>·</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}