import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    // Database authentication
    console.log(`Login attempt: username=${username}`)
    console.log(`DB Config: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_NAME || 'ztoi_salon'}`)

    try {
      // Query admin user from database (use `admin_users` table)
      console.log("Querying database for admin user from admin_users table...")
      const admins = await query(
        "SELECT id, username, email, password_hash, full_name, role FROM admin_users WHERE username = ? AND is_active = 1",
        [username]
      ) as any[]

      console.log(`Database query result: ${admins.length} users found`)

      if (admins.length === 0) {
        console.log("Admin user not found in database")
        return NextResponse.json(
          { error: "Invalid username or password" },
          { status: 401 }
        )
      }

      const admin = admins[0]
      console.log(`Found admin user: ${admin.username}, ID: ${admin.id}`)

      // Verify password
      console.log("Verifying password...")
      const isPasswordValid = await bcrypt.compare(password, admin.password_hash)
      console.log(`Password verification result: ${isPasswordValid}`)

      if (!isPasswordValid) {
        console.log("Invalid password - verification failed")
        return NextResponse.json(
          { error: "Invalid username or password" },
          { status: 401 }
        )
      }

      console.log("Credentials match, generating token...")

      const token = jwt.sign(
        {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      )

      console.log("Token generated successfully")

      return NextResponse.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          full_name: admin.full_name,
          role: admin.role
        }
      })
    } catch (dbError) {
      console.error("Database error during login:", dbError)
      // Fallback to dummy credentials if database is not available
      console.log("Database not available, falling back to dummy credentials")

      if (username === "admin" && password === "admin123") {
        const token = jwt.sign(
          {
            id: 1,
            username: "admin",
            email: "admin@lestylist.in",
            role: "admin"
          },
          JWT_SECRET,
          { expiresIn: "24h" }
        )

        return NextResponse.json({
          success: true,
          message: "Login successful (fallback mode)",
          token,
          user: {
            id: 1,
            username: "admin",
            email: "admin@lestylist.in",
            full_name: "Lé Stylist Admin",
            role: "admin"
          }
        })
      }

      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      )
    }

    console.log("Invalid credentials")
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    )
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    )
  }
}
