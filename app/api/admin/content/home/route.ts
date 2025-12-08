import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { query } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this"

function verifyAdmin(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "") ||
                request.cookies.get("admin_token")?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string }
    return decoded
  } catch (error) {
    return null
  }
}

// GET - Fetch all home page content
export async function GET(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const content = await query(
      "SELECT * FROM home_content ORDER BY display_order, section"
    ) as any[]

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Database error fetching home content:", error)
    return NextResponse.json({ error: "Failed to fetch home content" }, { status: 500 })
  }
}

// POST - Create new home content section
export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { section, title, subtitle, content, image_url, button_text, button_link, display_order } = await request.json()

    if (!section) {
      return NextResponse.json({ error: "Section is required" }, { status: 400 })
    }

    // Insert new content
    const result = await query(
      `INSERT INTO home_content (section, title, subtitle, content, image_url, button_text, button_link, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [section, title, subtitle, content, image_url, button_text, button_link, display_order || 0]
    ) as any

    return NextResponse.json({
      success: true,
      message: "Home content section created successfully",
      id: result.insertId
    })
  } catch (error) {
    console.error("Database error creating home content:", error)
    return NextResponse.json({ error: "Failed to create home content section" }, { status: 500 })
  }
}

// PUT - Update home content section
export async function PUT(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, section, title, subtitle, content, image_url, button_text, button_link, display_order, is_active } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Content ID is required" }, { status: 400 })
    }

    // Update content
    await query(
      `UPDATE home_content SET
        section = ?, title = ?, subtitle = ?, content = ?, image_url = ?,
        button_text = ?, button_link = ?, display_order = ?, is_active = ?
       WHERE id = ?`,
      [section, title, subtitle, content, image_url, button_text, button_link, display_order || 0, is_active ? 1 : 0, id]
    )

    return NextResponse.json({
      success: true,
      message: "Home content section updated successfully"
    })
  } catch (error) {
    console.error("Database error updating home content:", error)
    return NextResponse.json({ error: "Failed to update home content section" }, { status: 500 })
  }
}

// DELETE - Delete home content section
export async function DELETE(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "Content ID is required" }, { status: 400 })
    }

    await query("DELETE FROM home_content WHERE id = ?", [id])

    return NextResponse.json({
      success: true,
      message: "Home content section deleted successfully"
    })
  } catch (error) {
    console.error("Database error deleting home content:", error)
    return NextResponse.json({ error: "Failed to delete home content section" }, { status: 500 })
  }
}
