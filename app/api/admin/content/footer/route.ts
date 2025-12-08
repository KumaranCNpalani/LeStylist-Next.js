import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this"

// Helper to verify admin token
const verifyToken = (request: NextRequest) => {
    const token = request.headers.get("Authorization")?.split(" ")[1]
    if (!token) return null
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return null
    }
}

export async function GET() {
    try {
        const settings = await query("SELECT * FROM footer_settings LIMIT 1") as any[]

        if (settings.length === 0) {
            return NextResponse.json({
                content: {
                    description: "",
                    email: "",
                    phone: "",
                    address1: "",
                    address2: "",
                    tel1: "",
                    tel2: "",
                    hours: "",
                    social_media: {},
                    quick_links: [],
                    service_links: [],
                    copyright: ""
                }
            })
        }

        return NextResponse.json({ content: settings[0] })
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to fetch footer settings", details: error.message },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    const user = verifyToken(request)
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const {
            description,
            email,
            phone,
            address1,
            address2,
            tel1,
            tel2,
            hours,
            social_media,
            quick_links,
            service_links,
            copyright
        } = body

        // Check if settings exist
        const settings = await query("SELECT id FROM footer_settings LIMIT 1") as any[]

        if (settings.length > 0) {
            // Update
            await query(
                `UPDATE footer_settings SET 
          description = ?, 
          email = ?, 
          phone = ?, 
          address1 = ?, 
          address2 = ?, 
          tel1 = ?, 
          tel2 = ?, 
          hours = ?, 
          social_media = ?, 
          quick_links = ?, 
          service_links = ?, 
          copyright = ?
        WHERE id = ?`,
                [
                    description,
                    email,
                    phone,
                    address1,
                    address2,
                    tel1,
                    tel2,
                    hours,
                    JSON.stringify(social_media),
                    JSON.stringify(quick_links),
                    JSON.stringify(service_links),
                    copyright,
                    settings[0].id
                ]
            )
        } else {
            // Insert
            await query(
                `INSERT INTO footer_settings (
          description, 
          email, 
          phone, 
          address1, 
          address2, 
          tel1, 
          tel2, 
          hours, 
          social_media, 
          quick_links, 
          service_links, 
          copyright
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    description,
                    email,
                    phone,
                    address1,
                    address2,
                    tel1,
                    tel2,
                    hours,
                    JSON.stringify(social_media),
                    JSON.stringify(quick_links),
                    JSON.stringify(service_links),
                    copyright
                ]
            )
        }

        return NextResponse.json({ success: true, message: "Footer settings updated" })
    } catch (error: any) {
        console.error("Footer update error:", error)
        return NextResponse.json(
            { error: "Failed to update footer settings", details: error.message },
            { status: 500 }
        )
    }
}
