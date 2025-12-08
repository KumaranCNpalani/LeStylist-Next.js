import Link from "next/link"
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react"
import BrandName from "@/components/brand-name"
import Logo from "@/components/logo"

export default function Footer() {
  return (
    <footer className="bg-salon-charcoal text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                <Logo size="sm" invert />
                <BrandName variant="small" textColor="text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-300">
              Lé Stylist is a premium family salon and bridal studio in Avadi, Tamil Nadu, offering exceptional beauty
              services with a personal touch.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link href="https://facebook.com" className="text-gray-300 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://instagram.com" className="text-gray-300 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://youtube.com" className="text-gray-300 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-playfair font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-primary transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-300 hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-gray-300 hover:text-primary transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-300 hover:text-primary transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-300 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-playfair font-semibold">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-gray-300 hover:text-primary transition-colors">
                  Haircuts & Styling
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-primary transition-colors">
                  Bridal Makeup
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-primary transition-colors">
                  Hair Treatments
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-primary transition-colors">
                  Facials & Skincare
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-primary transition-colors">
                  Nail Care
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-primary transition-colors">
                  Waxing & Threading
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-playfair font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-gray-300">
                  <p className="font-semibold mb-1">Thirumullaivoyal Branch:</p>
                  <p>No 50/4, CTH Road, Thirumullaivoyal, Chennai-600062</p>
                  <p className="mt-2 font-semibold mb-1">Avadi Branch:</p>
                  <p>No 199, NM Road, Avadi, Chennai-600054</p>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+918939501637" className="text-gray-300 hover:text-primary transition-colors">
                  +91 89395 01637
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:lestylist.in@gmail.com" className="text-gray-300 hover:text-primary transition-colors">
                  lestylist.in@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-gray-300">
                  <p>Mon-Sat: 9:00 AM - 8:00 PM</p>
                  <p>Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Le Stylist. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
