import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET - Fetch all services for public display
export async function GET(request: NextRequest) {
  try {
    const services = await query(
      "SELECT id, name, category, description, duration_minutes, price, original_price, location, image_url, features, is_featured, display_order FROM services WHERE is_active = 1 ORDER BY display_order, category, name"
    ) as any[]

    // Parse JSON features field
    services.forEach(service => {
      if (service.features) {
        try {
          service.features = JSON.parse(service.features)
        } catch (e) {
          service.features = []
        }
      } else {
        service.features = []
      }
    })

    // Group by category for easier frontend consumption
    const groupedServices: any = {}
    services.forEach(service => {
      if (!groupedServices[service.category]) {
        groupedServices[service.category] = []
      }
      groupedServices[service.category].push(service)
    })

    return NextResponse.json({
      services,
      groupedServices,
      featuredServices: services.filter(s => s.is_featured)
    })
  } catch (error) {
    console.error("Database error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}
