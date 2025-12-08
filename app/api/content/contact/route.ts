import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET - Fetch all contact information for public display
export async function GET(request: NextRequest) {
  try {
    const contacts = await query(
      "SELECT * FROM contact_info ORDER BY type, display_order"
    ) as any[]

    // Group by type for easier frontend consumption
    const groupedContacts: any = {}
    contacts.forEach(contact => {
      if (!groupedContacts[contact.type]) {
        groupedContacts[contact.type] = []
      }
      groupedContacts[contact.type].push(contact)
    })

    return NextResponse.json({
      contacts,
      groupedContacts
    })
  } catch (error) {
    console.error("Database error fetching contact info:", error)
    return NextResponse.json({ error: "Failed to fetch contact information" }, { status: 500 })
  }
}
