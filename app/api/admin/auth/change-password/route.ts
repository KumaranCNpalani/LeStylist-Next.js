import { NextRequest, NextResponse } from "next/server"
import { query, testConnection } from "@/lib/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this"

export async function POST(request: NextRequest) {
    try {
        // Check database connection first
        const isConnected = await testConnection()
        if (!isConnected) {
            return NextResponse.json(
                { error: "Database connection failed. Please check your database settings." },
                { status: 503 }
            )
        }

        const token = request.headers.get("Authorization")?.split(" ")[1]

        if (!token) {
            return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 })
        }

        let decoded: any
        try {
            decoded = jwt.verify(token, JWT_SECRET)
        } catch (error) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
        }

        const { currentPassword, newPassword } = await request.json()

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: "Both current and new password are required" },
                { status: 400 }
            )
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "New password must be at least 6 characters long" },
                { status: 400 }
            )
        }

        // Get admin user
        console.log('Fetching admin user with ID:', decoded.id)
        const admins = await query(
            "SELECT id, username, password_hash FROM admin_users WHERE id = ?",
            [decoded.id]
        ) as any[]

        if (admins.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const admin = admins[0]
        console.log('Found admin user:', admin.username)

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, admin.password_hash)

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Current password is incorrect" },
                { status: 400 }
            )
        }

        // Hash new password
        console.log('Hashing new password...')
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update password
        console.log('Updating password in database...')
        await query(
            "UPDATE admin_users SET password_hash = ?, updated_at = NOW() WHERE id = ?",
            [hashedPassword, decoded.id]
        )

        console.log('✅ Password updated successfully for user:', admin.username)

        return NextResponse.json({
            success: true,
            message: "Password updated successfully"
        })

    } catch (error: any) {
        console.error("Change password error:", error)

        // Provide more specific error messages
        if (error.code === 'ECONNREFUSED') {
            return NextResponse.json(
                { error: "Cannot connect to database. Please ensure MySQL is running." },
                { status: 503 }
            )
        }

        return NextResponse.json(
            {
                error: "Failed to change password",
                details: error.message,
                hint: "Please check database connection and try again"
            },
            { status: 500 }
        )
    }
}
