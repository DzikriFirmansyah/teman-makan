// ============================================================
// src/services/menuData.ts
// ============================================================

import { MenuItem } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Fetch menu dari backend API
export async function fetchMenu(): Promise<MenuItem[]> {
    const res = await fetch(`${API_URL}/api/menu`);
    const data = await res.json();

    // Map data dari backend ke format MenuItem frontend
    return data.map((item: any) => ({
        id: String(item.id),
        name: item.name,
        description: item.description,
        price: Number(item.price),
        image: item.image,
        category: item.category,
        available: item.available,
        emoji: "",
        bgColor: "#F5F9FF",
    }));
}