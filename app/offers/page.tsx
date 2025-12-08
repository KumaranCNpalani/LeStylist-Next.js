import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift } from "lucide-react"
import { query } from "@/lib/db"

export const metadata = {
  title: "Special Offers | LE Stylist - Exclusive Deals & Packages",
  description:
    "Check out our latest offers, packages, and special deals on beauty services at LE Stylist.",
}

export const dynamic = 'force-dynamic'

async function fetchOffers() {
  try {
    const offers = await query(
      `SELECT id, title, description, offer_type, discount_value, image_url, valid_from, valid_until, is_active, display_order
       FROM offers
       WHERE is_active = 1 AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)
       ORDER BY display_order, created_at DESC`
    ) as any[]

    return offers
  } catch (error) {
    console.warn('Database error fetching offers:', error)
    return []
  }
}

export default async function OffersPage() {
  const offers = await fetchOffers()

  return (
    <div className="pt-24 animate-fade-in">
      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
            <div className="inline-block mb-6">
              <Gift className="h-16 w-16 text-primary mx-auto animate-bounce-in" />
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6">
              Special Offers & Packages
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Take advantage of our exclusive deals and packages designed to give you the best value
              for your beauty needs.
            </p>
          </div>
        </div>
      </section>

      {/* Current Offers */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4">
              Current Offers
            </h2>
            <p className="text-lg md:text-xl text-gray-600">Limited time offers - Book now!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.length > 0 ? (
              offers.map((offer) => {
                let discountBadge = null
                if (offer.offer_type === 'percentage' && offer.discount_value) {
                  discountBadge = `${offer.discount_value}% OFF`
                } else if (offer.offer_type === 'fixed_amount' && offer.discount_value) {
                  discountBadge = `₹${offer.discount_value} OFF`
                }

                const imageSrc = offer.image_url || `/placeholder.svg?height=300&width=600&text=${encodeURIComponent(offer.title || 'Offer')}`

                return (
                  <Card key={offer.id} className="group border-2 border-primary/20 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden animate-scale-in relative flex flex-col h-full">
                    {discountBadge && (
                      <div className="absolute top-4 right-4 z-10 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse-slow">
                        {discountBadge}
                      </div>
                    )}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={offer.title || 'Offer image'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-2xl">{offer.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-gray-600 mb-6 flex-1">{offer.description}</p>

                      {offer.valid_until && (
                        <p className="text-sm text-muted-foreground mb-4">
                          Valid until: {new Date(offer.valid_until).toLocaleDateString()}
                        </p>
                      )}

                      <Button asChild className="w-full group-hover:scale-105 transition-transform mt-auto">
                        <Link href="/booking">Book Now</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <p>No active offers at this time. Check back later.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6">
              Don't Miss Out!
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              These offers are for a limited time only. Book your appointment today and save big!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full px-8 hover:scale-105 transition-transform">
                <Link href="/booking">Book an Appointment</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 bg-transparent hover:scale-105 transition-transform"
              >
                <Link href="/booking">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

