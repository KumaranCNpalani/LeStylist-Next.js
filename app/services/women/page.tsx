import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Check, ArrowRight } from "lucide-react"
import { query } from "@/lib/db"

export const metadata = {
  title: "Women's Services | Lé Stylist - Premium Beauty Services",
  description: "Explore our comprehensive range of women's beauty services including hair, skin care, spa treatments, and more.",
}

export const dynamic = 'force-dynamic'

async function fetchWomenServices() {
  try {
    const services = await query(
      `SELECT s.id, s.name, s.price, s.price_type, s.description, s.image_url, c.name as category_name
       FROM services s
       JOIN service_categories c ON s.category_id = c.id
       WHERE c.type = 'women' AND s.is_active = 1
       ORDER BY c.display_order, s.display_order, s.name`
    ) as any[]

    // Group by category
    const grouped: { [key: string]: any[] } = {}
    services.forEach(service => {
      if (!grouped[service.category_name]) {
        grouped[service.category_name] = []
      }
      grouped[service.category_name].push(service)
    })

    return grouped
  } catch (error) {
    console.warn('Error fetching women services:', error)
    return {}
  }
}

export default async function WomenServicesPage() {
  const servicesByCategory = await fetchWomenServices()
  const hasServices = Object.keys(servicesByCategory).length > 0

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-12 w-12 text-pink-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Women's Services
            </h1>
            <p className="text-lg text-gray-700">
              Indulge in our premium beauty services designed exclusively for women. From hair styling to skin care, we've got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {hasServices ? (
            <div className="space-y-16">
              {Object.entries(servicesByCategory).map(([categoryName, services]) => (
                <div key={categoryName} className="scroll-mt-24">
                  <h2 className="text-3xl font-playfair font-bold mb-8 border-l-4 border-pink-500 pl-4">
                    {categoryName}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service: any) => (
                      <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                        {service.image_url && (
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={service.image_url}
                              alt={service.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        )}
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-lg text-gray-800 flex-1">{service.name}</h3>
                            <div className="text-right ml-4">
                              <p className="font-bold text-pink-600 text-xl">
                                ₹{service.price}
                              </p>
                              {service.price_type === 'starts_from' && (
                                <p className="text-xs text-gray-500">onwards</p>
                              )}
                            </div>
                          </div>
                          {service.description && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                          )}
                          <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                            <Link href={`/booking?service=${service.id}`}>
                              Book Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <Sparkles className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">Services Coming Soon</h3>
              <p className="text-gray-500">We're updating our women's services. Please check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-playfair font-bold mb-4">Ready for Your Transformation?</h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Book your appointment today and let our expert stylists bring out your natural beauty.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500">
            <Link href="/booking">Book an Appointment</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
