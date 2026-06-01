"use client";

import { QRCodeSVG } from "qrcode.react";

const BASE_URL = "https://teman-makan.vercel.app";

const tables = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];

export default function QRPage() {
    return (
        <main style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>
            <h1 style={{
                fontFamily: "'Hammersmith One', sans-serif",
                fontSize: 24, fontWeight: 700,
                marginBottom: 6, color: "#1A1A1A",
            }}>
                QR Code Per Meja
            </h1>
            <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 24 }}>
                Print halaman ini lalu potong per meja
            </p>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 16,
            }}>
                {tables.map((table) => (
                    <div key={table} style={{
                        background: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: 16,
                        padding: 20,
                        textAlign: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}>
                        <div style={{
                            fontSize: 13, fontWeight: 500,
                            color: "#6B7280", marginBottom: 4,
                            textTransform: "uppercase", letterSpacing: "0.08em",
                        }}>
                            Meja
                        </div>
                        <div style={{
                            fontFamily: "'Hammersmith One', sans-serif",
                            fontSize: 32, fontWeight: 700,
                            color: "#1A1A1A", marginBottom: 14,
                        }}>
                            {table}
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                            <QRCodeSVG
                                value={`${BASE_URL}/?table=${table}`}
                                size={140}
                                bgColor="#FFFFFF"
                                fgColor="#1A1A1A"
                                level="M"
                            />
                        </div>
                        <div style={{
                            fontSize: 10, color: "#9CA3AF",
                            wordBreak: "break-all",
                        }}>
                            {BASE_URL}/?table={table}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 24, textAlign: "center" }}>
                <button
                    onClick={() => window.print()}
                    style={{
                        padding: "12px 32px",
                        background: "#00AEFF", color: "white",
                        border: "none", borderRadius: 999,
                        fontSize: 14, fontWeight: 500, cursor: "pointer",
                        fontFamily: "'Poppins', sans-serif",
                    }}
                >
                    🖨️ Print QR Code
                </button>
            </div>
        </main>
    );
}