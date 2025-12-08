import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { query } from "@/lib/db"

export const metadata = {
  title: "Testimonials | Le Stylist - Unisex Salon & Bridal Studio",
  description:
    "Read what our clients have to say about their experience at Le Stylist salon in Avadi. Discover why we're the preferred choice for salon and bridal services.",
}

export const dynamic = 'force-dynamic'

async function fetchTestimonials() {
  try {
    const testimonials = await query(
      `SELECT id, customer_name, service_type, review_text, rating, customer_image, is_featured, display_order
       FROM testimonials
       WHERE is_approved = 1
       ORDER BY is_featured DESC, display_order, created_at DESC`
    ) as any[]

    return testimonials.map((t) => ({
      id: t.id,
      customer_name: t.customer_name,
      service_type: t.service_type,
      content: t.review_text,
      rating: t.rating,
      image_url: t.customer_image,
      is_featured: t.is_featured
    }))
  } catch (error) {
    console.warn('Error fetching testimonials:', error)
    return []
  }
}

export default async function TestimonialsPage() {
  const testimonials = await fetchTestimonials()
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-playfair font-bold mb-6">Client Testimonials</h1>
            <p className="text-lg text-gray-700 mb-6">
              Don't just take our word for it. Here's what our clients have to say about their experience at Le Stylist.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="testimonial-card border-none shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-6">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.image_url || "/placeholder.svg?height=48&width=48&text=Client"}
                          alt={testimonial.customer_name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.customer_name}</p>
                        {testimonial.service_type && (
                          <p className="text-sm text-gray-500">{testimonial.service_type}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No testimonials available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">Ready to Experience Our Services?</h2>
            <p className="text-lg text-gray-700 mb-8">Join our happy clients and book your appointment today.</p>
            <Button asChild size="lg">
              <Link href="/booking">Book an Appointment</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
