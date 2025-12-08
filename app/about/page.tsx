import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import BrandName from "@/components/brand-name"
import { Sparkles, Users, Heart, Shield, CheckCircle, Award, Star } from "lucide-react"
import { query } from "@/lib/db"

export const metadata = {
  title: "About Us | Lé Stylist - Premium Salon & Bridal Studio",
  description:
    "Welcome to Lé Stylist, where beauty is an art and every client is a masterpiece. Two chic locations in Chennai offering personalized beauty services.",
}

export const dynamic = 'force-dynamic'

async function fetchAboutContent() {
  try {
    const images = await query(
      `SELECT id, title, image_url, category, description 
       FROM client_images 
       WHERE category IN ('awards', 'shop')
       ORDER BY display_order, created_at DESC`
    ) as any[]

    return {
      awards: images.filter(img => img.category === 'awards'),
      shopImages: images.filter(img => img.category === 'shop')
    }
  } catch (error) {
    console.warn('Error fetching about content:', error)
    return { awards: [], shopImages: [] }
  }
}

export default async function AboutPage() {
  const { awards, shopImages } = await fetchAboutContent()
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6">
              About{" "}
              <span className="text-pink-500 font-edwardian text-4xl md:text-6xl lg:text-7xl">Lé</span>{" "}
              <span className="text-gray-800 font-footlight text-lg md:text-xl lg:text-2xl">Stylist</span>
              <span className="text-gray-800 font-footlight text-base md:text-lg lg:text-xl block mt-2">Family Salon & Bridal Studio</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Welcome to Le Stylist, where beauty is an art and every client is a masterpiece. With two chic locations in Chennai, we offer a sanctuary of style and sophistication. Our team of skilled stylists, colorists, and nail technicians is passionate about bringing your vision to life, whether you're seeking a bold new look or a subtle enhancement.

              At Le Stylist, we believe in the power of personalized service. From the moment you walk through our doors, you'll be greeted with warmth and hospitality, as we take the time to understand your unique style and preferences. Whether you're looking for a trendy haircut, a vibrant hair color, or a rejuvenating spa treatment, we're dedicated to exceeding your expectations.

              With our commitment to excellence and attention to detail, Le Stylist has become a trusted name in the beauty industry. Our two convenient locations in No 50/4 , CTH Road, Thirumullaivoyal, Chennai-600062  and No: 199 NM Road, Avadi, Chennai-600054. are havens of luxury and relaxation, where you can escape the hustle and bustle of daily life and indulge in a world of pampering.

              Discover the difference at Le Stylist and experience the ultimate in beauty and self-care. Schedule your appointment today and let us help you look and feel your best.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-6">
                Welcome to Le Stylist, where beauty is an art and every client is a masterpiece. With two chic locations in Chennai, we offer a sanctuary of style and sophistication. Our team of skilled stylists, colorists, and nail technicians is passionate about bringing your vision to life, whether you're seeking a bold new look or a subtle enhancement.

                At Le Stylist, we believe in the power of personalized service. From the moment you walk through our doors, you'll be greeted with warmth and hospitality, as we take the time to understand your unique style and preferences. Whether you're looking for a trendy haircut, a vibrant hair color, or a rejuvenating spa treatment, we're dedicated to exceeding your expectations.

                With our commitment to excellence and attention to detail, Le Stylist has become a trusted name in the beauty industry. Our two convenient locations in No 50/4 , CTH Road, Thirumullaivoyal, Chennai-600062  and No: 199 NM Road, Avadi, Chennai-600054. are havens of luxury and relaxation, where you can escape the hustle and bustle of daily life and indulge in a world of pampering.

                Discover the difference at Le Stylist and experience the ultimate in beauty and self-care. Schedule your appointment today and let us help you look and feel your best.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600&text=Our+Story"
                alt="Lé Stylist Salon Interior"
                width={600}
                height={500}
                className="rounded-2xl shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>



      {/* Experience Le Stylist - Shop Photos */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6">Experience Le Stylist</h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Step into our world of luxury and relaxation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shopImages.length > 0 ? (
              shopImages.map((image) => (
                <div key={image.id} className="relative h-64 md:h-80 rounded-lg overflow-hidden group shadow-lg">
                  <Image
                    src={image.image_url}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-white font-playfair text-xl font-bold">{image.title}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Shop interior photos coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6">Awards & Recognition</h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Celebrating excellence in beauty and service excellence.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="overflow-hidden">
              <div className="flex gap-6 animate-scroll">
                {awards.length > 0 ? awards.map((award) => (
                  <div key={award.id} className="flex-[0_0_300px] md:flex-[0_0_350px]">
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                      <div className="relative h-48">
                        <Image
                          src={award.image_url || "/placeholder.svg?height=300&width=400&text=Award"}
                          alt={award.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-primary text-white p-2 rounded-full">
                          <Award className="h-6 w-6" />
                        </div>
                      </div>
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-bold mb-2">{award.title}</h3>
                        <p className="text-primary font-medium mb-3">{award.description || 'Award Recognition'}</p>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )) : (
                  <div className="w-full text-center py-12 text-gray-500">
                    <Award className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>No awards to display yet. Upload award images in the admin gallery with category "awards".</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6">Our Values</h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              The principles that guide everything we do at Lé Stylist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:scale-105 transition-transform duration-300">
              <CardContent>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Excellence</h3>
                <p className="text-gray-600">
                  We strive for perfection in every service, ensuring the highest quality results for our clients.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:scale-105 transition-transform duration-300">
              <CardContent>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Personalization</h3>
                <p className="text-gray-600">
                  Every client is unique. We tailor our services to meet your individual needs and preferences.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:scale-105 transition-transform duration-300">
              <CardContent>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Passion</h3>
                <p className="text-gray-600">
                  Our love for beauty and wellness drives us to continuously improve and innovate.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:scale-105 transition-transform duration-300">
              <CardContent>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Trust</h3>
                <p className="text-gray-600">
                  Building lasting relationships through honesty, reliability, and exceptional service.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Salon */}
      <section className="py-16 lg:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600&text=Our+Salon"
                alt="Lé Stylist Salon"
                width={600}
                height={500}
                className="rounded-2xl shadow-xl w-full h-auto"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6">Our Salon</h2>
              <p className="text-lg text-gray-700 mb-6">
                Discover the difference at Lé Stylist and experience the ultimate in beauty and self-care. Schedule your appointment today and let us help you look and feel your best. Step into our modern, welcoming space designed to provide the ultimate relaxation experience. Our salon features state-of-the-art equipment, premium products, and a serene atmosphere where you can unwind and rejuvenate.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Located in the heart of Chennai with two convenient locations, our salons are easily accessible and offer ample parking. Whether you're coming for a quick trim or an elaborate bridal session, our comfortable seating and entertainment options ensure your visit is enjoyable from start to finish.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span>Modern Equipment</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span>Premium Products</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span>Comfortable Seating</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span>Free Wi-Fi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6">
              Ready to Experience the Lé Stylist Difference?
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Book your appointment today and discover why we're the premier choice for beauty services in Chennai.
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
                <Link href="/services">View Our Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div >
  )
}
