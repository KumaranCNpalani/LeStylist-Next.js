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

// GET - Fetch all franchise content
export async function GET(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const content = await query(
      "SELECT * FROM franchise_content ORDER BY display_order, section"
    ) as any[]

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Database error fetching franchise content:", error)
    return NextResponse.json({ error: "Failed to fetch franchise content" }, { status: 500 })
  }
}

// POST - Create new franchise content section
export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { section, title, content, image_url, features, display_order } = await request.json()

    if (!section) {
      return NextResponse.json({ error: "Section is required" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO franchise_content (section, title, content, image_url, features, display_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section, title, content, image_url, JSON.stringify(features || []), display_order || 0]
    ) as any

    return NextResponse.json({
      success: true,
      message: "Franchise content section created successfully",
      id: result.insertId
    })
  } catch (error) {
    console.error("Database error creating franchise content:", error)
    return NextResponse.json({ error: "Failed to create franchise content section" }, { status: 500 })
  }
}

// PUT - Update franchise content section
export async function PUT(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, section, title, content, image_url, features, display_order, is_active } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Content ID is required" }, { status: 400 })
    }

    await query(
      `UPDATE franchise_content SET
        section = ?, title = ?, content = ?, image_url = ?, features = ?,
        display_order = ?, is_active = ?
       WHERE id = ?`,
      [section, title, content, image_url, JSON.stringify(features || []), display_order || 0, is_active ? 1 : 0, id]
    )

    return NextResponse.json({
      success: true,
      message: "Franchise content section updated successfully"
    })
  } catch (error) {
    console.error("Database error updating franchise content:", error)
    return NextResponse.json({ error: "Failed to update franchise content section" }, { status: 500 })
  }
}

// DELETE - Delete franchise content section
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

    await query("DELETE FROM franchise_content WHERE id = ?", [id])

    return NextResponse.json({
      success: true,
      message: "Franchise content section deleted successfully"
    })
  } catch (error) {
    console.error("Database error deleting franchise content:", error)
    return NextResponse.json({ error: "Failed to delete franchise content section" }, { status: 500 })
  }
}
