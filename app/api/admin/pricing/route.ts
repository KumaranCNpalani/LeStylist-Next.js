import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { query } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this"

// Verify admin token
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

// GET - Fetch all services/pricing
export async function GET(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Fetch services from database
    const services = await query(
      "SELECT id, name, category, description, duration_minutes, price, location, is_active, created_at, updated_at FROM services ORDER BY category, name"
    ) as any[]

    return NextResponse.json({ services })
  } catch (error) {
    console.error("Database error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

// PUT - Update service
export async function PUT(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, name, category, description, duration_minutes, price, location, is_active } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    // Update service in database
    await query(
      `UPDATE services SET
        name = ?, category = ?, description = ?, duration_minutes = ?,
        price = ?, location = ?, is_active = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, category, description, duration_minutes, price, location, is_active ? 1 : 0, id]
    )

    return NextResponse.json({ success: true, message: "Service updated successfully" })
  } catch (error) {
    console.error("Database error updating service:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

// POST - Create new service
export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, category, description, duration_minutes, price, location } = await request.json()

    if (!name || !category || price === undefined) {
      return NextResponse.json({ error: "Name, category, and price are required" }, { status: 400 })
    }

    // Insert new service into database
    const result = await query(
      `INSERT INTO services (name, category, description, duration_minutes, price, location, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [name, category, description, duration_minutes, price, location]
    ) as any

    return NextResponse.json({
      success: true,
      message: "Service created successfully",
      serviceId: result.insertId
    })
  } catch (error) {
    console.error("Database error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}

// DELETE - Delete service
export async function DELETE(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    // Delete service from database
    await query("DELETE FROM services WHERE id = ?", [id])

    return NextResponse.json({ success: true, message: "Service deleted successfully" })
  } catch (error) {
    console.error("Database error deleting service:", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}

