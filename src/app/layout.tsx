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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Hammersmith+One&family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="mobile-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}