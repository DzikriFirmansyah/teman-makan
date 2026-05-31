/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: [
        "192.168.1.26",   // ← IP HP kamu
        "192.168.1.*",    // ← atau pakai wildcard untuk semua device di jaringan yang sama
    ],
    env: {
        NEXT_PUBLIC_API_URL: "http://192.168.1.26:5000",  // ← tambah ini
    },
};

module.exports = nextConfig;