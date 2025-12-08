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

// GET - Fetch all contact information
export async function GET(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const contacts = await query(
      "SELECT * FROM contact_info ORDER BY type, display_order"
    ) as any[]

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error("Database error fetching contact info:", error)
    return NextResponse.json({ error: "Failed to fetch contact information" }, { status: 500 })
  }
}

// POST - Create new contact information
export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { type, label, value, location, is_primary, display_order } = await request.json()

    if (!type || !value) {
      return NextResponse.json({ error: "Type and value are required" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO contact_info (type, label, value, location, is_primary, display_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [type, label, value, location, is_primary ? 1 : 0, display_order || 0]
    ) as any

    return NextResponse.json({
      success: true,
      message: "Contact information added successfully",
      id: result.insertId
    })
  } catch (error) {
    console.error("Database error creating contact info:", error)
    return NextResponse.json({ error: "Failed to add contact information" }, { status: 500 })
  }
}

// PUT - Update contact information
export async function PUT(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, type, label, value, location, is_primary, display_order } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 })
    }

    await query(
      `UPDATE contact_info SET
        type = ?, label = ?, value = ?, location = ?, is_primary = ?, display_order = ?
       WHERE id = ?`,
      [type, label, value, location, is_primary ? 1 : 0, display_order || 0, id]
    )

    return NextResponse.json({
      success: true,
      message: "Contact information updated successfully"
    })
  } catch (error) {
    console.error("Database error updating contact info:", error)
    return NextResponse.json({ error: "Failed to update contact information" }, { status: 500 })
  }
}

// DELETE - Delete contact information
export async function DELETE(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 })
    }

    await query("DELETE FROM contact_info WHERE id = ?", [id])

    return NextResponse.json({
      success: true,
      message: "Contact information deleted successfully"
    })
  } catch (error) {
    console.error("Database error deleting contact info:", error)
    return NextResponse.json({ error: "Failed to delete contact information" }, { status: 500 })
  }
}
