import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Scissors, Star, Zap, Check, ArrowRight } from "lucide-react"
import { query } from "@/lib/db"

export const metadata = {
  title: "Our Services | Lé Stylist - Premium Beauty & Wellness Services",
  description:
    "Explore our comprehensive range of salon services including women services, men services, makeup, hydrafacial, and more at Lé Stylist in Chennai.",
}

export const dynamic = 'force-dynamic'

interface Service {
  id: number
  service_name: string
  price: number
  price_type: string
  category_name: string
  category_type: string
}

async function fetchAllServices() {
  try {
    const services = await query(
      `SELECT s.id, s.name as service_name, s.price, s.price_type, c.name as category_name, c.type as category_type
       FROM services s
       JOIN service_categories c ON s.category_id = c.id
       WHERE s.is_active = 1
       ORDER BY c.type, c.display_order, s.display_order, s.name`
    ) as Service[]

    // Group services by type
    const grouped: { [key: string]: Service[] } = {}
    services.forEach(service => {
      if (!grouped[service.category_type]) {
        grouped[service.category_type] = []
      }
      grouped[service.category_type].push(service)
    })

    return grouped
  } catch (error) {
    console.warn('Error fetching services:', error)
    return {}
  }
}

const serviceTypeInfo = {
  women: {
    title: "Women's Services",
    icon: Sparkles,
    color: "from-pink-500 to-purple-500",
    description: "Complete beauty solutions for the modern woman",
    image: "/placeholder.svg?height=400&width=600&text=Women+Services"
  },
  men: {
    title: "Men's Services",
    icon: Scissors,
    color: "from-blue-500 to-cyan-500",
    description: "Professional grooming for the modern gentleman",
    image: "/placeholder.svg?height=400&width=600&text=Men+Services"
  },
  makeup: {
    title: "Makeup Services",
    icon: Star,
    color: "from-rose-500 to-pink-500",
    description: "Artistry for every occasion",
    image: "/placeholder.svg?height=400&width=600&text=Makeup+Services"
  },
  hydrafacial: {
    title: "Hydrafacial",
    icon: Zap,
    color: "from-teal-500 to-emerald-500",
    description: "Advanced skincare technology",
    image: "/placeholder.svg?height=400&width=600&text=Hydrafacial"
  }
}

export default async function ServicesPage() {
  const servicesByType = await fetchAllServices()

  return (
    <div className="pt-24 bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
              Our Premium Services
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              Discover our comprehensive range of beauty and wellness services, each designed to enhance your natural
              beauty and boost your confidence. Expert care, premium products, exceptional results.
            </p>
          </div>
        </div>
      </section>

      {/* Services by Category */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 space-y-20">
          {Object.entries(servicesByType).map(([type, services]) => {
            const info = serviceTypeInfo[type as keyof typeof serviceTypeInfo]
            if (!info || services.length === 0) return null

            const Icon = info.icon

            // Group services by category within this type
            const byCategory: { [key: string]: Service[] } = {}
            services.forEach(service => {
              if (!byCategory[service.category_name]) {
                byCategory[service.category_name] = []
              }
              byCategory[service.category_name].push(service)
            })

            return (
              <div key={type} className="scroll-mt-24" id={type}>
                {/* Category Header */}
                <div className="mb-12">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-playfair font-bold">{info.title}</h2>
                      <p className="text-gray-600 text-lg">{info.description}</p>
                    </div>
                  </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {Object.entries(byCategory).map(([categoryName, categoryServices]) => (
                    <Card key={categoryName} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">{categoryName}</h3>
                        <div className="space-y-4">
                          {categoryServices.map((service) => (
                            <div
                              key={service.id}
                              className="flex items-start justify-between gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                              <div className="flex-1">
                                <div className="flex items-start gap-3">
                                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                  <div>
                                    <h4 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                                      {service.service_name}
                                    </h4>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="font-bold text-primary text-lg">
                                  ₹{service.price}
                                </p>
                                {service.price_type && service.price_type !== 'fixed' && (
                                  <p className="text-xs text-gray-500 capitalize">{service.price_type}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* View Details Button */}
                <div className="mt-8 text-center">
                  <Button asChild size="lg" className="group">
                    <Link href={`/services/${type}`}>
                      View All {info.title}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">Why Choose Lé Stylist?</h2>
            <p className="text-gray-600 text-lg">Experience the difference with our premium services</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Expert Stylists", desc: "Highly trained professionals" },
              { title: "Premium Products", desc: "International quality brands" },
              { title: "Hygienic Environment", desc: "Sanitized tools & equipment" },
              { title: "Personalized Care", desc: "Tailored to your needs" }
            ].map((feature, idx) => (
              <Card key={idx} className="text-center p-6 border-none shadow-lg hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">
              Ready to Transform Your Look?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Book your appointment today and experience the Lé Stylist difference
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/booking">Book an Appointment</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link href="/gallery">View Our Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
