import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Clock, MapPin, Phone, Mail, Award, Users, Sparkles, Scissors, Heart } from "lucide-react"
import BrandName from "@/components/brand-name"
import OfferBanner from "@/components/OfferBanner"

// Fetch home content from database
async function getHomeContent() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/content/home`, {
      cache: 'no-store' // Ensure fresh data
    })
    if (response.ok) {
      const data = await response.json()
      return data.content || []
    }
  } catch (error) {
    console.error('Failed to fetch home content:', error)
  }
  return []
}

export default async function Home() {
  const homeContent = await getHomeContent()

  // Get content by section
  const heroSection = homeContent.find((item: any) => item.section === 'hero')
  const aboutSection = homeContent.find((item: any) => item.section === 'about')
  const servicesSection = homeContent.find((item: any) => item.section === 'services')
  const testimonialsSection = homeContent.find((item: any) => item.section === 'testimonials')
  const contactSection = homeContent.find((item: any) => item.section === 'contact')
  return (
    <>
      {/* Offer Banner */}
      <OfferBanner />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/placeholder.svg?height=1080&width=1920&text=Salon+Intro"
          >
            <source src="/videos/salon-intro.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold mb-4 text-white">
                {heroSection?.title}
              </h1>
              <div className="flex justify-center mb-4">
                <BrandName variant="large" textColor="text-white" />
              </div>
            </div>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
              {heroSection?.content || "Where Beauty Meets Excellence - Family Salon & Bridal Studio in Avadi, Tamil Nadu"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="rounded-full text-base px-8 py-3">
                <Link href={heroSection?.button_link || "/booking"}>{heroSection?.button_text || "Book Your Appointment"}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full text-base px-8 py-3 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-black"
              >
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">8+</div>
                <div className="text-sm md:text-base opacity-80">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">10K+</div>
                <div className="text-sm md:text-base opacity-80">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">20+</div>
                <div className="text-sm md:text-base opacity-80">Expert Stylists</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">50+</div>
                <div className="text-sm md:text-base opacity-80">Services</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4 animate-fade-in-up">Our Signature Services</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the finest in beauty and wellness with our comprehensive range of premium services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="aspect-[3/4] relative">
                <Image
                  src="/placeholder.svg?height=600&width=450&text=Hair+Services"
                  alt="Hair Services"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center mb-3">
                  <Scissors className="h-6 w-6 text-primary mr-2" />
                  <h3 className="text-xl font-bold">Hair Services</h3>
                </div>
                <p className="mb-4 opacity-90 text-sm">Cuts, colors, treatments & styling</p>
                <Button asChild size="sm" className="group-hover:bg-white group-hover:text-primary transition-colors">
                  <Link href="/services/hair">Explore</Link>
                </Button>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="aspect-[3/4] relative">
                <Image
                  src="/placeholder.svg?height=600&width=450&text=Bridal+Services"
                  alt="Bridal Services"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center mb-3">
                  <Sparkles className="h-6 w-6 text-primary mr-2" />
                  <h3 className="text-xl font-bold">Bridal Services</h3>
                </div>
                <p className="mb-4 opacity-90 text-sm">Complete bridal makeover packages</p>
                <Button asChild size="sm" className="group-hover:bg-white group-hover:text-primary transition-colors">
                  <Link href="/services/bridal">Explore</Link>
                </Button>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="aspect-[3/4] relative">
                <Image
                  src="/placeholder.svg?height=600&width=450&text=Spa+Wellness"
                  alt="Spa & Wellness"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center mb-3">
                  <Star className="h-6 w-6 text-primary mr-2" />
                  <h3 className="text-xl font-bold">Spa & Wellness</h3>
                </div>
                <p className="mb-4 opacity-90 text-sm">Relaxation and rejuvenation treatments</p>
                <Button asChild size="sm" className="group-hover:bg-white group-hover:text-primary transition-colors">
                  <Link href="/services/spa">Explore</Link>
                </Button>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="aspect-[3/4] relative">
                <Image
                  src="/placeholder.svg?height=600&width=450&text=Skincare"
                  alt="Skincare"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center mb-3">
                  <Sparkles className="h-6 w-6 text-primary mr-2" />
                  <h3 className="text-xl font-bold">Skincare</h3>
                </div>
                <p className="mb-4 opacity-90 text-sm">Facials and advanced skin treatments</p>
                <Button asChild size="sm" className="group-hover:bg-white group-hover:text-primary transition-colors">
                  <Link href="/services/skincare">Explore</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 bg-transparent">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative h-48 lg:h-64 rounded-2xl overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=400&width=300&text=Salon+Interior"
                      alt="Salon Interior"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-32 lg:h-40 rounded-2xl overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=200&width=300&text=Team+Work"
                      alt="Team at Work"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative h-32 lg:h-40 rounded-2xl overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=200&width=300&text=Happy+Client"
                      alt="Happy Client"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 lg:h-64 rounded-2xl overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=400&width=300&text=Premium+Products"
                      alt="Premium Products"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="mb-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-2">
                  About
                </h2>
                <BrandName variant="default" textColor="text-gray-800" />
              </div>
              <p className="text-lg text-gray-700 mb-6">
                Established in 2016, Lé Stylist has been Avadi's premier destination for exceptional beauty and wellness
                services. Our team of highly skilled professionals is dedicated to enhancing your natural beauty and
                creating stunning transformations for every occasion.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                We pride ourselves on using only premium products, maintaining the highest hygiene standards, and
                providing personalized service that exceeds expectations.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-primary mr-3" />
                  <div>
                    <div className="font-bold text-lg">Award Winning</div>
                    <div className="text-gray-600 text-sm">Best Salon 2023</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-primary mr-3" />
                  <div>
                    <div className="font-bold text-lg">Expert Team</div>
                    <div className="text-gray-600 text-sm">20+ Professionals</div>
                  </div>
                </div>
              </div>

              <Button asChild size="lg" className="rounded-full">
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <div className="mb-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-2">
                Why Choose
              </h2>
              <div className="flex justify-center">
                <BrandName variant="default" showTagline={false} />
              </div>
            </div>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the difference with our commitment to excellence and personalized care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Premium Quality</h3>
              <p className="text-gray-600">
                We use only the finest products and latest techniques to ensure exceptional results for every client.
              </p>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Expert Professionals</h3>
              <p className="text-gray-600">
                Our team of certified stylists and beauticians bring years of experience and continuous training.
              </p>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Personalized Service</h3>
              <p className="text-gray-600">
                Every service is tailored to your unique needs, preferences, and lifestyle for perfect results.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonialsSection?.items && testimonialsSection.items.length > 0 ? (
              testimonialsSection.items.map((testimonial: any) => (
                <Card key={testimonial.id} className="border-none shadow-lg p-6 h-full">
                  <CardContent className="pt-6 flex flex-col h-full">
                    <div className="flex justify-center mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${star <= testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-6 text-center flex-grow">
                      "{testimonial.review_text}"
                    </p>
                    <div className="flex items-center justify-center mt-auto">
                      <div className="h-12 w-12 rounded-full overflow-hidden mr-4 relative">
                        <Image
                          src={testimonial.customer_image || "/placeholder.svg?height=48&width=48&text=User"}
                          alt={testimonial.customer_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.customer_name}</p>
                        <p className="text-sm text-gray-500">{testimonial.service_type}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No testimonials available yet.
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 bg-transparent">
              <Link href="/testimonials">Read More Reviews</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 lg:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-2">
                  Visit
                </h2>
                <BrandName variant="default" showTagline={false} />
              </div>
              <p className="text-lg text-gray-700 mb-8">
                Experience luxury and excellence at our state-of-the-art salon in the heart of Avadi.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Locations</h3>
                    <p className="text-gray-600 mb-2">
                      <strong>Thirumullaivoyal:</strong> No 50/4, CTH Road, Chennai-600062
                    </p>
                    <p className="text-gray-600">
                      <strong>Avadi:</strong> No 199, NM Road, Chennai-600054
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone</h3>
                    <a href="tel:+918939501637" className="text-gray-600 hover:text-primary transition-colors">
                      +91 89395 01637
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <a href="mailto:lestylist.in@gmail.com" className="text-gray-600 hover:text-primary transition-colors break-all">
                      lestylist.in@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Hours</h3>
                    <p className="text-gray-600">Mon-Sat: 9:00 AM - 8:00 PM</p>
                    <p className="text-gray-600">Sunday: 10:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/booking">Book Appointment</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full bg-transparent">
                  <Link href="/booking">Contact Us</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden shadow-xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.7!2d80.1139!3d13.0827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526c7b2b2b2b2b:0x1234567890abcdef!2zMTPCsDA0JzQ5LjciTiA4MMKwMDYnNTAuMCJF!5e0!3m2!1sen!2sin!4v1703123456789!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                  title="Lé Stylist Thirumullaivoyal Branch"
                ></iframe>
              </div>
              <p className="text-sm text-gray-600 text-center">
                <strong>Thirumullaivoyal Branch</strong> - No 50/4, CTH Road, Chennai-600062
              </p>
              <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden shadow-xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.8!2d80.1011!3d13.1144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526c8a9b9b9b9:0x1234567890abcdef!2zMTPCsDA2JzUyLjAiTiA4MMKwMDYnMDQuNCJF!5e0!3m2!1sen!2sin!4v1703123456789!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                  title="Lé Stylist Avadi Branch"
                ></iframe>
              </div>
              <p className="text-sm text-gray-600 text-center">
                <strong>Avadi Branch</strong> - No 199, NM Road, Chennai-600054
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
