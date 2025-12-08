import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
    try {
        const categories = await query(
            "SELECT * FROM service_categories ORDER BY type, display_order"
        ) as any[]

        return NextResponse.json({ categories })
    } catch (error) {
        console.error("Database error fetching categories:", error)
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }
}
