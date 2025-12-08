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
        const settings = await query("SELECT * FROM header_settings LIMIT 1") as any[]

        if (settings.length === 0) {
            return NextResponse.json({
                content: {
                    phone_number: "+91 89395 01637",
                    whatsapp_number: "+91 89395 01637",
                    logo_url: "/logo.png",
                    navigation_items: [],
                    show_phone: true,
                    show_book_button: true,
                    book_button_text: "Book Now"
                }
            })
        }

        return NextResponse.json({ content: settings[0] })
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to fetch header settings", details: error.message },
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
            phone_number,
            whatsapp_number,
            logo_url,
            navigation_items,
            show_phone,
            show_book_button,
            book_button_text
        } = body

        // Check if settings exist
        const settings = await query("SELECT id FROM header_settings LIMIT 1") as any[]

        if (settings.length > 0) {
            // Update
            await query(
                `UPDATE header_settings SET 
          phone_number = ?, 
          whatsapp_number = ?, 
          logo_url = ?, 
          navigation_items = ?, 
          show_phone = ?, 
          show_book_button = ?, 
          book_button_text = ? 
        WHERE id = ?`,
                [
                    phone_number,
                    whatsapp_number,
                    logo_url,
                    JSON.stringify(navigation_items),
                    show_phone,
                    show_book_button,
                    book_button_text,
                    settings[0].id
                ]
            )
        } else {
            // Insert
            await query(
                `INSERT INTO header_settings (
          phone_number, 
          whatsapp_number, 
          logo_url, 
          navigation_items, 
          show_phone, 
          show_book_button, 
          book_button_text
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    phone_number,
                    whatsapp_number,
                    logo_url,
                    JSON.stringify(navigation_items),
                    show_phone,
                    show_book_button,
                    book_button_text
                ]
            )
        }

        return NextResponse.json({ success: true, message: "Header settings updated" })
    } catch (error: any) {
        console.error("Header update error:", error)
        return NextResponse.json(
            { error: "Failed to update header settings", details: error.message },
            { status: 500 }
        )
    }
}
