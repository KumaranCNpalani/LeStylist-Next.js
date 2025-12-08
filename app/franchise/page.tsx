import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, TrendingUp, Users, Award, Phone, Mail, MapPin } from "lucide-react"

export const metadata = {
  title: "Franchise Opportunity | LE Stylist - Join Our Network",
  description:
    "Join the LE Stylist franchise network and start your own successful salon business with our proven business model.",
}

export default function FranchisePage() {
  return (
    <div className="pt-24 animate-fade-in">
      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
            <div className="inline-block mb-6">
              <Building2 className="h-16 w-16 text-primary mx-auto animate-bounce-in" />
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6">
              Franchise Opportunity
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Join the LE Stylist family and become part of a successful beauty salon network. Start
              your own business with our proven model and comprehensive support.
            </p>
          </div>
        </div>
      </section>

      {/* Why Franchise with Us */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4">
              Why Choose LE Stylist Franchise?
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              We provide everything you need to succeed in the beauty industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Proven Business Model",
                desc: "Established brand with successful track record",
              },
              {
                icon: TrendingUp,
                title: "Training & Support",
                desc: "Comprehensive training and ongoing business support",
              },
              {
                icon: Users,
                title: "Marketing Support",
                desc: "Marketing materials and promotional campaigns",
              },
              {
                icon: Building2,
                title: "Brand Recognition",
                desc: "Leverage our established brand reputation",
              },
            ].map((benefit, index) => (
              <Card
                key={index}
                className="border-none shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center group hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Franchise Benefits */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-right">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">
                What We Offer
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Complete Setup Support</h3>
                    <p className="text-gray-600">
                      Assistance with location selection, interior design, and equipment setup.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Staff Training</h3>
                    <p className="text-gray-600">
                      Comprehensive training programs for all staff members on services and customer
                      service.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Marketing & Branding</h3>
                    <p className="text-gray-600">
                      Marketing materials, social media support, and brand guidelines.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Ongoing Support</h3>
                    <p className="text-gray-600">
                      Continuous support for operations, marketing, and business development.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-xl animate-slide-in-left">
              <Image
                src="/placeholder.svg?height=500&width=600&text=Franchise+Opportunity"
                alt="Franchise Opportunity"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Investment Details */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4">
              Investment Details
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Transparent investment structure with flexible options
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-none shadow-lg p-8 animate-scale-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-primary">What's Included</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Award className="h-5 w-5 text-primary mr-3" />
                      <span>Franchise License</span>
                    </li>
                    <li className="flex items-center">
                      <Award className="h-5 w-5 text-primary mr-3" />
                      <span>Brand Usage Rights</span>
                    </li>
                    <li className="flex items-center">
                      <Award className="h-5 w-5 text-primary mr-3" />
                      <span>Training Programs</span>
                    </li>
                    <li className="flex items-center">
                      <Award className="h-5 w-5 text-primary mr-3" />
                      <span>Marketing Support</span>
                    </li>
                    <li className="flex items-center">
                      <Award className="h-5 w-5 text-primary mr-3" />
                      <span>Operations Manual</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-primary">Requirements</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Building2 className="h-5 w-5 text-primary mr-3" />
                      <span>Minimum Space: 800-1200 sq ft</span>
                    </li>
                    <li className="flex items-center">
                      <Building2 className="h-5 w-5 text-primary mr-3" />
                      <span>Prime Location Preferred</span>
                    </li>
                    <li className="flex items-center">
                      <Building2 className="h-5 w-5 text-primary mr-3" />
                      <span>Business Experience Helpful</span>
                    </li>
                    <li className="flex items-center">
                      <Building2 className="h-5 w-5 text-primary mr-3" />
                      <span>Passion for Beauty Industry</span>
                    </li>
                    <li className="flex items-center">
                      <Building2 className="h-5 w-5 text-primary mr-3" />
                      <span>Financial Investment Capability</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6">
              Interested in Franchising?
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Get in touch with us to learn more about franchise opportunities and investment
              details.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:scale-105 transition-transform">
                <Phone className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <a href="tel:+918939501637" className="text-gray-600 hover:text-primary transition-colors">
                  +91 89395 01637
                </a>
                <a
                  href="https://wa.me/918939501637"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-700 mt-2 hover:underline"
                >
                  Message on WhatsApp
                </a>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:scale-105 transition-transform">
                <Mail className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <a href="mailto:lestylist.in@gmail.com" className="text-gray-600 hover:text-primary transition-colors break-all">
                  lestylist.in@gmail.com
                </a>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:scale-105 transition-transform">
                <MapPin className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Visit Us</h3>
                      <div className="text-gray-600 text-sm">
                        <p>Thirumullaivoyal, Chennai-600062</p>
                        <p>Avadi, Chennai-600054</p>
                      </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full px-8 hover:scale-105 transition-transform">
                <Link href="/booking">Contact Us</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 bg-transparent hover:scale-105 transition-transform"
              >
                <Link href="/booking">Schedule Meeting</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

