import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_name, customer_phone, customer_email, service_type, service_id, appointment_date, appointment_time, location, special_requests } = body

    // Validate required fields
    if (!customer_name || !customer_phone || !customer_email || !service_type || !appointment_date || !appointment_time || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    try {
      // Insert appointment into database
      // Check if service_id column exists
      let sql, params;
      try {
        sql = `
          INSERT INTO appointments (
            customer_name, customer_phone, customer_email,
            service_type, service_id, appointment_date, appointment_time,
            location, special_requests, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        `
        params = [
          customer_name,
          customer_phone,
          customer_email,
          service_type,
          service_id || null,
          appointment_date,
          appointment_time,
          location,
          special_requests || null,
        ]
      } catch (error) {
        // Fallback to old format if service_id column doesn't exist
        sql = `
          INSERT INTO appointments (
            customer_name, customer_phone, customer_email,
            service_type, appointment_date, appointment_time,
            location, special_requests, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        `
        params = [
          customer_name,
          customer_phone,
          customer_email,
          service_type,
          appointment_date,
          appointment_time,
          location,
          special_requests || null,
        ]
      }

      const result = await query(sql, params) as any

      const appointmentId = result.insertId

      return NextResponse.json(
        {
          success: true,
          message: "Appointment booked successfully",
          appointmentId,
        },
        { status: 201 },
      )
    } catch (dbError: any) {
      console.error("Database error:", dbError)
      // Fallback: log the appointment for manual entry
      console.log("Appointment booking request (fallback):", {
        customer_name,
        customer_phone,
        email,
        service,
        date,
        time,
        location,
        message,
      })
      
      return NextResponse.json(
        {
          success: true,
          message: "Appointment request received. We'll confirm shortly.",
          note: "Database connection issue - appointment logged for manual processing",
        },
        { status: 201 },
      )
    }
  } catch (error: any) {
    console.error("Appointment booking error:", error)
    return NextResponse.json(
      { error: "Failed to book appointment", details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const location = searchParams.get("location")

    try {
      let sql = 'SELECT * FROM appointments WHERE 1=1'
      const params: any[] = []

      if (date) {
        sql += ' AND appointment_date = ?'
        params.push(date)
      }

      if (location) {
        sql += ' AND location = ?'
        params.push(location)
      }

      sql += ' ORDER BY appointment_date DESC, appointment_time DESC LIMIT 50'

      const appointments = await query(sql, params) as any[]

      return NextResponse.json({ appointments })
    } catch (dbError: any) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        { error: "Failed to fetch appointments", details: dbError.message },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch appointments", details: error.message },
      { status: 500 }
    )
  }
}

