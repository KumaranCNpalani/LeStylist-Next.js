import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { query } from "@/lib/db"
import { writeFile, unlink } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"

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

// GET - Fetch all testimonials
export async function GET(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const testimonials = await query(
      "SELECT id, customer_name, service_type, review_text as content, rating, customer_image as image_url, is_featured, is_approved as is_active, display_order, created_at, updated_at FROM testimonials ORDER BY display_order, created_at DESC"
    ) as any[]

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error("Database error fetching testimonials:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

// POST - Create new testimonial
export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const customerName = formData.get('customer_name') as string
    const serviceType = formData.get('service_type') as string
    const content = formData.get('content') as string
    const rating = parseInt(formData.get('rating') as string) || 5
    const isFeatured = formData.get('is_featured') === 'true' ? 1 : 0
    const isActive = formData.get('is_active') === 'true' ? 1 : 0
    const displayOrder = parseInt(formData.get('display_order') as string) || 0

    const imageFile = formData.get('image') as File
    const videoFile = formData.get('video') as File

    if (!customerName || !content) {
      return NextResponse.json({ error: "Customer name and content are required" }, { status: 400 })
    }

    let imageUrl = null

    // Handle image upload
    if (imageFile && imageFile.size > 0) {
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json({ error: "Only image files are allowed for profile pictures" }, { status: 400 })
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "Image file size must be less than 5MB" }, { status: 400 })
      }

      const fileExtension = imageFile.name.split('.').pop()
      const filename = `testimonial-${randomUUID()}.${fileExtension}`
      const filepath = join(process.cwd(), 'public', 'uploads', 'testimonials', filename)

      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filepath, buffer)

      imageUrl = `/uploads/testimonials/${filename}`
    }

    const result = await query(
      `INSERT INTO testimonials (customer_name, service_type, review_text, rating, customer_image, is_featured, is_approved, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [customerName, serviceType || null, content, rating, imageUrl, isFeatured, isActive, displayOrder]
    ) as any

    return NextResponse.json({
      success: true,
      message: "Testimonial created successfully",
      testimonialId: result.insertId
    })
  } catch (error) {
    console.error("Error creating testimonial:", error)
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
  }
}

// PUT - Update testimonial
export async function PUT(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const id = formData.get('id') as string

    if (!id) {
      return NextResponse.json({ error: "Testimonial ID is required" }, { status: 400 })
    }

    const customerName = formData.get('customer_name') as string
    const serviceType = formData.get('service_type') as string
    const content = formData.get('content') as string
    const rating = parseInt(formData.get('rating') as string) || 5
    const isFeatured = formData.get('is_featured') === 'true' ? 1 : 0
    const isActive = formData.get('is_active') === 'true' ? 1 : 0
    const displayOrder = parseInt(formData.get('display_order') as string) || 0

    const imageFile = formData.get('image') as File
    const videoFile = formData.get('video') as File

    if (!customerName || !content) {
      return NextResponse.json({ error: "Customer name and content are required" }, { status: 400 })
    }

    // Get existing testimonial to handle file updates
    const existing = await query(
      "SELECT customer_image as image_url FROM testimonials WHERE id = ?",
      [id]
    ) as any[]

    if (existing.length === 0) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }

    let imageUrl = existing[0].image_url

    // Handle image upload/update
    if (imageFile && imageFile.size > 0) {
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json({ error: "Only image files are allowed for profile pictures" }, { status: 400 })
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "Image file size must be less than 5MB" }, { status: 400 })
      }

      // Delete old image if exists
      if (imageUrl) {
        try {
          const oldFilepath = join(process.cwd(), 'public', imageUrl)
          await unlink(oldFilepath)
        } catch (error) {
          console.warn("Could not delete old image file:", error)
        }
      }

      const fileExtension = imageFile.name.split('.').pop()
      const filename = `testimonial-${randomUUID()}.${fileExtension}`
      const filepath = join(process.cwd(), 'public', 'uploads', 'testimonials', filename)

      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filepath, buffer)

      imageUrl = `/uploads/testimonials/${filename}`
    }

    await query(
      `UPDATE testimonials SET
        customer_name = ?, service_type = ?, review_text = ?, rating = ?,
        customer_image = ?, is_featured = ?, is_approved = ?,
        display_order = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [customerName, serviceType || null, content, rating, imageUrl, isFeatured, isActive, displayOrder, id]
    )

    return NextResponse.json({
      success: true,
      message: "Testimonial updated successfully"
    })
  } catch (error) {
    console.error("Error updating testimonial:", error)
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 })
  }
}

// DELETE - Delete testimonial
export async function DELETE(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "Testimonial ID is required" }, { status: 400 })
    }

    // Get testimonial details for file cleanup
    const testimonials = await query(
      "SELECT customer_image as image_url FROM testimonials WHERE id = ?",
      [id]
    ) as any[]

    if (testimonials.length === 0) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }

    const testimonial = testimonials[0]

    // Delete associated file
    if (testimonial.image_url) {
      try {
        const filepath = join(process.cwd(), 'public', testimonial.image_url)
        await unlink(filepath)
      } catch (error) {
        console.warn("Could not delete image file:", error)
      }
    }

    // Delete from database
    await query("DELETE FROM testimonials WHERE id = ?", [id])

    return NextResponse.json({ success: true, message: "Testimonial deleted successfully" })
  } catch (error) {
    console.error("Database error deleting testimonial:", error)
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 })
  }
}
