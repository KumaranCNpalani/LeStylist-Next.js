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

// GET - Fetch all client images
export async function GET(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Fetch images from database
    const images = await query(
      "SELECT id, title, image_url, category, description, tags, is_featured, display_order, uploaded_by, created_at, updated_at FROM client_images ORDER BY display_order, created_at DESC"
    ) as any[]

    return NextResponse.json({ images })
  } catch (error) {
    console.error("Database error fetching images:", error)
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}

// POST - Upload client image
export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string

    if (!file || !title || !category) {
      return NextResponse.json({ error: "Image file, title, and category are required" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Use upload utility
    const imageUrl = await uploadFile(file, 'gallery')

    // Create database record
    const result = await query(
      `INSERT INTO client_images (title, image_url, category, description, uploaded_by)
       VALUES (?, ?, ?, ?, ?)`,
      [title, imageUrl, category, description || '', admin.id]
    ) as any

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      imageId: result.insertId,
      imageUrl
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}

// PUT - Update client image
export async function PUT(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string
    const isFeatured = formData.get('is_featured') === 'true' ? 1 : 0
    const displayOrder = parseInt(formData.get('display_order') as string) || 0

    if (!id || !title || !category) {
      return NextResponse.json({ error: "ID, title, and category are required" }, { status: 400 })
    }

    await query(
      `UPDATE client_images SET
        title = ?, category = ?, description = ?, is_featured = ?,
        display_order = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, category, description || '', isFeatured, displayOrder, id]
    )

    return NextResponse.json({
      success: true,
      message: "Image updated successfully"
    })
  } catch (error) {
    console.error("Error updating image:", error)
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 })
  }
}

// DELETE - Delete client image
export async function DELETE(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    // Get image details from database
    const images = await query(
      "SELECT image_url FROM client_images WHERE id = ?",
      [id]
    ) as any[]

    if (images.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    const image = images[0]

    // Delete physical file
    try {
      const filepath = join(process.cwd(), 'public', image.image_url)
      await unlink(filepath)
    } catch (fileError) {
      console.warn("Could not delete physical file:", fileError)
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await query("DELETE FROM client_images WHERE id = ?", [id])

    return NextResponse.json({ success: true, message: "Image deleted successfully" })
  } catch (error) {
    console.error("Database error deleting image:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}

