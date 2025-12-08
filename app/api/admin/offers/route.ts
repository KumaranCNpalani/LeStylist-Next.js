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

// GET - Fetch all offers
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const activeOnly = url.searchParams.get('active') === 'true'

    let sql = `SELECT * FROM offers WHERE 1=1`
    let params: any[] = []

    if (activeOnly) {
      sql += ` AND is_active = 1 AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)`
    }

    sql += ` ORDER BY display_order, created_at DESC`

    const offers = await query(sql, params) as any[]

    return NextResponse.json({ offers })
  } catch (error) {
    console.error("Database error fetching offers:", error)
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 })
  }
}

// POST - Create new offer
export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const offer_type = formData.get('offer_type') || 'percentage'
    const discount_value = formData.get('discount_value')
    const valid_from = formData.get('valid_from') || null
    const valid_until = formData.get('valid_until') || null
    const is_active = formData.get('is_active') === 'true' ? 1 : 0
    const display_order = formData.get('display_order') || 0
    const image = formData.get('image') as File | null

    if (!title || !description) {
      return NextResponse.json({
        error: "Title and description are required"
      }, { status: 400 })
    }

    let image_url = null
    if (image && image.size > 0) {
      if (!image.type.startsWith('image/')) {
        return NextResponse.json({ error: "Invalid image file" }, { status: 400 })
      }
      image_url = await uploadFile(image, 'offers')
    }

    const result = await query(
      `INSERT INTO offers
       (title, description, offer_type, discount_value, valid_from, valid_until, is_active, display_order, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, offer_type, discount_value, valid_from, valid_until, is_active, display_order, image_url]
    ) as any

    return NextResponse.json({
      success: true,
      message: "Offer created successfully",
      offerId: result.insertId
    })
  } catch (error) {
    console.error("Error creating offer:", error)
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 })
  }
}

// PUT - Update offer
export async function PUT(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const id = formData.get('id')
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const offer_type = formData.get('offer_type')
    const discount_value = formData.get('discount_value')
    const valid_from = formData.get('valid_from') || null
    const valid_until = formData.get('valid_until') || null
    const is_active = formData.get('is_active') === 'true' ? 1 : 0
    const display_order = formData.get('display_order')
    const image = formData.get('image') as File | null

    if (!id || !title || !description) {
      return NextResponse.json({
        error: "ID, title, and description are required"
      }, { status: 400 })
    }

    let sql = `UPDATE offers SET
      title = ?, description = ?, offer_type = ?,
      discount_value = ?, valid_from = ?, valid_until = ?, is_active = ?,
      display_order = ?, updated_at = CURRENT_TIMESTAMP`

    const params = [
      title, description, offer_type,
      discount_value, valid_from, valid_until, is_active,
      display_order
    ]

    if (image && image.size > 0) {
      if (!image.type.startsWith('image/')) {
        return NextResponse.json({ error: "Invalid image file" }, { status: 400 })
      }
      const image_url = await uploadFile(image, 'offers')
      sql += `, image_url = ?`
      params.push(image_url)
    }

    sql += ` WHERE id = ?`
    params.push(id)

    await query(sql, params)

    return NextResponse.json({
      success: true,
      message: "Offer updated successfully"
    })
  } catch (error) {
    console.error("Error updating offer:", error)
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 })
  }
}

// DELETE - Delete offer
export async function DELETE(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "Offer ID is required" }, { status: 400 })
    }

    // Get image url to delete file
    const offers = await query("SELECT image_url FROM offers WHERE id = ?", [id]) as any[]
    if (offers.length > 0 && offers[0].image_url) {
      try {
        const filepath = join(process.cwd(), 'public', offers[0].image_url)
        await unlink(filepath)
      } catch (e) {
        // Ignore file delete error
      }
    }

    await query("DELETE FROM offers WHERE id = ?", [id])

    return NextResponse.json({ success: true, message: "Offer deleted successfully" })
  } catch (error) {
    console.error("Database error deleting offer:", error)
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 })
  }
}
