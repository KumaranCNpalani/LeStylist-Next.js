import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
    try {
        const offers = await query(
            `SELECT id, title, description, offer_type, discount_value
       FROM offers
       WHERE is_active = 1 
       AND (valid_from IS NULL OR valid_from <= CURDATE())
       AND (valid_until IS NULL OR valid_until >= CURDATE())
       ORDER BY display_order, created_at DESC
       LIMIT 5`
        ) as any[]

        return NextResponse.json({ offers })
    } catch (error) {
        console.error('Error fetching active offers:', error)
        return NextResponse.json({ offers: [] })
    }
}

export const dynamic = 'force-dynamic'
