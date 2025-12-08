import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET - Fetch all active offers for public display
export async function GET(request: NextRequest) {
  try {
    const offers = await query(
      `SELECT id, title, description, offer_type, discount_value, terms_conditions, image_url, valid_from, valid_until, is_active, display_order, service_id, category_id, created_at, updated_at
       FROM offers
       WHERE is_active = 1 AND valid_from <= CURDATE() AND valid_until >= CURDATE()
       ORDER BY display_order, valid_from DESC`
    ) as any[]

    // Parse features JSON if needed
    offers.forEach(offer => {
      if (offer.features) {
        try {
          offer.features = JSON.parse(offer.features)
        } catch (e) {
          offer.features = []
        }
      } else {
        offer.features = []
      }
    })

    return NextResponse.json({
      offers,
      featuredOffers: offers.filter(o => o.is_featured),
      currentOffers: offers.filter(o => !o.is_featured)
    })
  } catch (error) {
    console.error("Database error fetching offers:", error)
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 })
  }
}
