import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { query } from "@/lib/db"
import { uploadFile } from "@/lib/upload"
import { unlink } from "fs/promises"
import { join } from "path"

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

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

// GET - Fetch all services with category details
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const categoryId = url.searchParams.get('categoryId')
    const type = url.searchParams.get('type') // 'women', 'men', etc.

    let sql = `
      SELECT s.*, c.name as category_name, c.type as category_type, c.slug as category_slug
      FROM services s
      JOIN service_categories c ON s.category_id = c.id
      WHERE 1=1
    `
    let params: any[] = []

    if (categoryId) {
      sql += ` AND s.category_id = ?`
      params.push(categoryId)
    }

    if (type) {
      sql += ` AND c.type = ?`
      params.push(type)
    }

    sql += ` ORDER BY c.type, c.display_order, s.display_order, s.name`

    const services = await query(sql, params) as any[]

    return NextResponse.json({ services })
  } catch (error) {
    console.error("Database error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

// POST - Create new service
export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const category_id = formData.get('category_id')
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price')
    const price_type = formData.get('price_type') || 'fixed'
    const duration_minutes = formData.get('duration_minutes') || 30
    const is_featured = formData.get('is_featured') === 'true' ? 1 : 0
    const is_active = formData.get('is_active') === 'true' ? 1 : 0
    const display_order = formData.get('display_order') || 0
    const image = formData.get('image') as File | null

    if (!category_id || !name || !price) {
      return NextResponse.json({
        error: "Category, service name, and price are required"
      }, { status: 400 })
    }

    let image_url = null
    if (image && image.size > 0) {
      if (!image.type.startsWith('image/')) {
        return NextResponse.json({ error: "Invalid image file" }, { status: 400 })
      }
      image_url = await uploadFile(image, 'services')
    }

    const slug = generateSlug(name) + '-' + Date.now().toString().slice(-4)

    const result = await query(
      `INSERT INTO services
       (category_id, name, slug, description, price, price_type, duration_minutes, is_featured, is_active, display_order, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id, name, slug, description || null, price, price_type, duration_minutes, is_featured, is_active, display_order, image_url]
    ) as any

    return NextResponse.json({
      success: true,
      message: "Service created successfully",
      serviceId: result.insertId
    })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}

// PUT - Update service
export async function PUT(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const id = formData.get('id')
    const category_id = formData.get('category_id')
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price')
    const price_type = formData.get('price_type')
    const duration_minutes = formData.get('duration_minutes')
    const is_featured = formData.get('is_featured') === 'true' ? 1 : 0
    const is_active = formData.get('is_active') === 'true' ? 1 : 0
    const display_order = formData.get('display_order')
    const image = formData.get('image') as File | null

    if (!id || !category_id || !name || !price) {
      return NextResponse.json({
        error: "ID, category, service name, and price are required"
      }, { status: 400 })
    }

    let sql = `UPDATE services SET
      category_id = ?, name = ?, description = ?,
      price = ?, price_type = ?, duration_minutes = ?, is_featured = ?, is_active = ?,
      display_order = ?, updated_at = CURRENT_TIMESTAMP`

    const params = [
      category_id, name, description || null,
      price, price_type || 'fixed', duration_minutes || 30,
      is_featured, is_active, display_order
    ]

    if (image && image.size > 0) {
      if (!image.type.startsWith('image/')) {
        return NextResponse.json({ error: "Invalid image file" }, { status: 400 })
      }
      const image_url = await uploadFile(image, 'services')
      sql += `, image_url = ?`
      params.push(image_url)

      // Optional: Delete old image here if needed
    }

    sql += ` WHERE id = ?`
    params.push(id)

    await query(sql, params)

    return NextResponse.json({
      success: true,
      message: "Service updated successfully"
    })
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
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

    // Get image url to delete file
    const services = await query("SELECT image_url FROM services WHERE id = ?", [id]) as any[]
    if (services.length > 0 && services[0].image_url) {
      try {
        const filepath = join(process.cwd(), 'public', services[0].image_url)
        await unlink(filepath)
      } catch (e) {
        // Ignore file delete error
      }
    }

    await query("DELETE FROM services WHERE id = ?", [id])

    return NextResponse.json({ success: true, message: "Service deleted successfully" })
  } catch (error) {
    console.error("Database error deleting service:", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}
