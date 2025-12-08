import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Scissors, Check, ArrowRight } from "lucide-react"
import { query } from "@/lib/db"

export const metadata = {
  title: "Men's Services | Lé Stylist - Professional Grooming",
  description: "Explore our comprehensive range of men's grooming services including haircuts, beard styling, facials, and more.",
}

export const dynamic = 'force-dynamic'

async function fetchMenServices() {
  try {
    const services = await query(
      `SELECT s.id, s.name, s.price, s.price_type, s.description, s.image_url, c.name as category_name
       FROM services s
       JOIN service_categories c ON s.category_id = c.id
       WHERE c.type = 'men' AND s.is_active = 1
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
    console.warn('Error fetching men services:', error)
    return {}
  }
}

export default async function MenServicesPage() {
  const servicesByCategory = await fetchMenServices()
  const hasServices = Object.keys(servicesByCategory).length > 0

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Scissors className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Men's Services
            </h1>
            <p className="text-lg text-gray-700">
              Professional grooming services tailored for the modern gentleman. Look sharp, feel confident.
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
                  <h2 className="text-3xl font-playfair font-bold mb-8 border-l-4 border-blue-600 pl-4">
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
                              <p className="font-bold text-blue-600 text-xl">
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
                          <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
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
              <Scissors className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">Services Coming Soon</h3>
              <p className="text-gray-500">We're updating our men's services. Please check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-playfair font-bold mb-4">Ready for a Fresh Look?</h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Book your appointment today and experience professional grooming at its finest.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600">
            <Link href="/booking">Book an Appointment</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
