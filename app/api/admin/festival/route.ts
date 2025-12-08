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

// POST - Toggle festival mode
export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { enabled } = await request.json()

    if (typeof enabled !== 'boolean') {
      return NextResponse.json({ error: "Enabled must be a boolean" }, { status: 400 })
    }

    // In a real application, you might store this in a settings table
    // For now, we'll just acknowledge the request
    // You could also store this in a configuration table

    return NextResponse.json({
      success: true,
      message: `Festival mode ${enabled ? 'enabled' : 'disabled'}`,
      enabled
    })
  } catch (error) {
    console.error("Festival mode toggle error:", error)
    return NextResponse.json({ error: "Failed to toggle festival mode" }, { status: 500 })
  }
}

// GET - Get current festival mode status
export async function GET(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // In a real application, fetch from settings table
    // For now, return default status
    return NextResponse.json({
      enabled: false, // Default to false, can be overridden by admin panel
      message: "Festival mode status retrieved"
    })
  } catch (error) {
    console.error("Get festival mode error:", error)
    return NextResponse.json({ error: "Failed to get festival mode status" }, { status: 500 })
  }
}