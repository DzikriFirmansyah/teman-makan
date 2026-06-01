"use client";
// ============================================================
// src/app/menu/[id]/page.tsx
// ============================================================

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchMenu } from "@/services/menuData";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "lucide-react";
import { MenuItem } from "@/types";
import { use } from "react";

interface Props {
    params: Promise<{ id: string }>;
}

function SkeletonDetail() {
    return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg-card)" }}>

        {/* Hero skeleton */}
        <div className="skeleton" style={{ width: "100%", height: 220, borderRadius: 0 }} />

        {/* Body skeleton */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 180px" }}>
        <div className="skeleton" style={{ width: "70%", height: 28, marginBottom: 10 }} />
        <div className="skeleton" style={{ width: "35%", height: 22, marginBottom: 16 }} />
        <div className="skeleton" style={{ width: "100%", height: 14, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: "100%", height: 14, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: "80%", height: 14, marginBottom: 20 }} />

        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "16px 0" }} />

        <div className="skeleton" style={{ width: "40%", height: 12, marginBottom: 10 }} />
        <div className="skeleton" style={{ width: "100%", height: 60, borderRadius: 10 }} />
        </div>

        {/* Footer skeleton */}
        <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "var(--bg-card)", borderTop: "1px solid var(--border)",
        padding: "12px 20px 28px",
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
            <div className="skeleton" style={{ width: 60, height: 12, marginBottom: 6 }} />
            <div className="skeleton" style={{ width: 100, height: 13 }} />
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div className="skeleton" style={{ width: 34, height: 34, borderRadius: "50%" }} />
            <div className="skeleton" style={{ width: 28, height: 18 }} />
            <div className="skeleton" style={{ width: 34, height: 34, borderRadius: "50%" }} />
            </div>
        </div>
        <div className="skeleton" style={{ width: "100%", height: 50, borderRadius: 16 }} />
        </div>

    </main>
    );
}
export default function MenuDetailPage({ params }: Props) {
    const { id } = use(params);
    const router = useRouter();
    const { addItem } = useCart();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [qty, setQty] = useState(1);
    const [note, setNote] = useState("");
    const [showNotif, setShowNotif] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);

    useEffect(() => {
        fetchMenu().then((data) => {
            setTimeout(() => {
                setMenuItems(data);
            }, 750);  // ← delay 1 detik
        });
    }, []);

    const item = menuItems.find((m) => String(m.id) === String(id));

    if (menuItems.length === 0) return <SkeletonDetail />;

    // Guard: kalau item tidak ditemukan atau masih loading
    if (!item) {
        return (
            <main style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
                <p>Memuat...</p>
            </main>
        );
    }

    const handleAdd = () => {
        addItem(item, qty, note);
        setShowNotif(true);
        setTimeout(() => {
            setShowNotif(false);
            router.push("/menu");
        }, 1000);
    };

    return (
        <main style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "var(--bg-card)",
        }}>

            {/* HERO */}
            <div style={{
                width: "100%", height: 220,
                background: item.bgColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 90, position: "relative",
            }}>
                <button
                    onClick={() => router.back()}
                    style={{
                        position: "absolute", top: 16, left: 16,
                        width: 38, height: 38, borderRadius: "50%",
                        background: "rgba(255,255,255,0.92)",
                        border: "1px solid var(--border)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", zIndex: 2,
                    }}
                >
                    <svg viewBox="0 0 24 24" width={18} height={18} stroke="var(--text)"
                        fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <img
                    src={item.image}
                    alt={item.name}
                    onClick={() => setShowImageModal(true)}
                    onTouchEnd={(e) => {
                        e.preventDefault();           // ← tambah ini, cegah konflik scroll
                        setShowImageModal(true);
                    }}
                    style={{
                        width: "100%", height: "100%",
                        objectFit: "cover",
                        display: "block",
                        cursor: "zoom-in",
                    }}
                />
            </div>

            {/* BODY */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 180px" }}>
                <h1 style={{ fontFamily: "'Hammersmith One', sans-serif", fontSize: 26, fontWeight: 700, lineHeight: 1.2, color: "var(--text)", marginBottom: 6 }}>
                    {item.name}
                </h1>
                <p style={{ fontSize: 22, fontWeight: 500, color: "var(--accent)", marginBottom: 12 }}>
                    Rp {item.price.toLocaleString("id-ID")}
                </p>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 20 }}>
                    {item.description}
                </p>

                <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "16px 0" }} />

                <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text-light)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                    Catatan untuk dapur
                </p>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Contoh: tidak pedas, tanpa bawang, ekstra saus..."
                    rows={2}
                    style={{
                        width: "100%", background: "var(--bg)",
                        border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                        padding: "12px 14px", fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14, color: "var(--text)", outline: "none", resize: "none",
                    }}
                />

                <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "16px 0" }} />
            </div>

            {/* FOOTER */}
            <div style={{
                position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
                width: "100%", maxWidth: 430,
                background: "var(--bg-card)", borderTop: "1px solid var(--border)",
                padding: "12px 20px 28px",
                zIndex: 50,
            }}>
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginBottom: 12,
                }}>
                    <div>
                        <p style={{ fontSize: 12, color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
                            Jumlah
                        </p>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                            Total: <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                                Rp {(item.price * qty).toLocaleString("id-ID")}
                            </span>
                        </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <button
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            style={{
                                width: 34, height: 34, borderRadius: "50%",
                                border: "1px solid var(--border-strong)", background: "var(--bg)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 18, cursor: "pointer", color: "var(--text)",
                            }}
                        >−</button>
                        <span style={{ fontSize: 18, fontWeight: 600, minWidth: 28, textAlign: "center", color: "var(--text)" }}>
                            {qty}
                        </span>
                        <button
                            onClick={() => setQty(qty + 1)}
                            style={{
                                width: 34, height: 34, borderRadius: "50%",
                                background: "var(--accent)", border: "none",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 18, cursor: "pointer", color: "white",
                            }}
                        >+</button>
                    </div>
                </div>

                <button
                    onClick={handleAdd}
                    style={{
                        width: "100%", padding: 16,
                        background: "var(--accent)", color: "#FAF7F2",
                        border: "none", borderRadius: "var(--radius)",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 15, fontWeight: 500, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                >
                    <ShoppingCart size={18} strokeWidth={1.8} color="white" />
                    Tambah ke Keranjang
                </button>
            </div>

            {/* POP UP NOTIF */}
            {showNotif && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 999, background: "rgba(0,0,0,0.35)",
                }}>
                    <div style={{
                        background: "var(--bg-card)", borderRadius: 20,
                        padding: "28px 32px", textAlign: "center",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
                        animation: "bounceIn 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards",
                        maxWidth: 280, width: "80%",
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
                        <p style={{ fontFamily: "'Hammersmith One', sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                            Ditambahkan!
                        </p>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>
                            <strong style={{ color: "var(--text)" }}>{item.name}</strong> x{qty}
                        </p>
                        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                            berhasil masuk ke keranjang
                        </p>
                    </div>
                </div>
            )}

            {/* IMAGE MODAL */}
            {showImageModal && (
                <div
                    onClick={() => setShowImageModal(false)}
                    onTouchEnd={(e) => {
                        e.preventDefault();     
                        setShowImageModal(false);
                    }}
                    style={{
                        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                        background: "rgba(0,0,0,0.85)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        zIndex: 1000, padding: 20, cursor: "zoom-out",
                    }}
                >
                    <img
                        src={item.image}
                        alt={item.name}
                        onClick={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        style={{
                            width: "100%", maxWidth: 400, maxHeight: "80vh",
                            objectFit: "contain", borderRadius: 12,
                            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
                            animation: "bounceIn 0.3s ease forwards",
                        }}
                    />
                </div>
            )}

        </main>
    );
}