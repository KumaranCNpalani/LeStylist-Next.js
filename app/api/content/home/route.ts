import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET - Fetch all home page content for public display
export async function GET(request: NextRequest) {
  try {
    const content = await query(
      "SELECT * FROM home_content WHERE is_active = 1 ORDER BY display_order, section"
    ) as any[]

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Database error fetching home content:", error)
    return NextResponse.json({ error: "Failed to fetch home content" }, { status: 500 })
  }
}
