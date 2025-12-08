import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ArrowRight } from "lucide-react"
import { query } from "@/lib/db"

export const metadata = {
  title: "Makeup Services | Lé Stylist - Professional Makeup Artistry",
  description: "Professional makeup services for all occasions - bridal, party, HD makeup, and more.",
}

export const dynamic = 'force-dynamic'

async function fetchMakeupServices() {
  try {
    const services = await query(
      `SELECT s.id, s.name, s.price, s.price_type, s.description, s.image_url, c.name as category_name
       FROM services s
       JOIN service_categories c ON s.category_id = c.id
       WHERE c.type = 'makeup' AND s.is_active = 1
       ORDER BY c.display_order, s.display_order, s.name`
    ) as any[]

    const grouped: { [key: string]: any[] } = {}
    services.forEach(service => {
      if (!grouped[service.category_name]) {
        grouped[service.category_name] = []
      }
      grouped[service.category_name].push(service)
    })

    return grouped
  } catch (error) {
    console.warn('Error fetching makeup services:', error)
    return {}
  }
}

export default async function MakeupServicesPage() {
  const servicesByCategory = await fetchMakeupServices()
  const hasServices = Object.keys(servicesByCategory).length > 0

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <section className="py-16 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Star className="h-12 w-12 text-rose-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Makeup Services
            </h1>
            <p className="text-lg text-gray-700">
              Professional makeup artistry for every occasion. From bridal to party makeup, we make you shine.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {hasServices ? (
            <div className="space-y-16">
              {Object.entries(servicesByCategory).map(([categoryName, services]) => (
                <div key={categoryName}>
                  <h2 className="text-3xl font-playfair font-bold mb-8 border-l-4 border-rose-500 pl-4">
                    {categoryName}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service: any) => (
                      <Card key={service.id} className="group hover:shadow-xl transition-all duration-300">
                        {service.image_url && (
                          <div className="relative h-48">
                            <Image src={service.image_url} alt={service.name} fill className="object-cover" />
                          </div>
                        )}
                        <CardContent className="p-6">
                          <div className="flex justify-between mb-3">
                            <h3 className="font-bold text-lg flex-1">{service.name}</h3>
                            <p className="font-bold text-rose-600 text-xl ml-4">₹{service.price}</p>
                          </div>
                          {service.description && <p className="text-gray-600 text-sm mb-4">{service.description}</p>}
                          <Button asChild className="w-full bg-gradient-to-r from-rose-500 to-pink-500">
                            <Link href={`/booking?service=${service.id}`}>Book Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
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
              <Star className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600">Services Coming Soon</h3>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-playfair font-bold mb-4">Ready to Look Stunning?</h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Book your makeup session and let our expert artists create the perfect look for you.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-rose-500 to-pink-500">
            <Link href="/booking">Book an Appointment</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
