// ============================================================
// src/app/layout.tsx
// Root layout — wraps semua halaman
// ============================================================

import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teman Makan",
  description: "Pesan makanan langsung dari meja Anda",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {/* Wrapper mobile-first: max 430px, tengah di layar lebar */}
        <div className="mobile-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}
