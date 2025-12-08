import BookingForm from "@/components/booking-form"
import { Calendar, Clock, MapPin, Phone, Mail } from "lucide-react"

export const metadata = {
  title: "Book Appointment | LE Stylist - Online Booking System",
  description:
    "Book your appointment at LE Stylist online. Choose from our wide range of services and select your preferred date and time.",
}

export default function BookingPage() {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6">Book Your Appointment</h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Schedule your visit to LE Stylist and let our experts take care of your beauty needs.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Booking Form */}
            <div>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <BookingForm />
              </div>
            </div>

            {/* Booking Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">Why Book with Us?</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Calendar className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Flexible Scheduling</h3>
                      <p className="text-gray-600">
                        Book appointments that fit your schedule, including early mornings and evenings.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Convenient Location</h3>
                      <p className="text-gray-600">
                        Located in the heart of Avadi with easy parking and public transport access.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Punctual Service</h3>
                      <p className="text-gray-600">We value your time and ensure all appointments start on schedule.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Easy Rescheduling</h3>
                      <p className="text-gray-600">
                        Need to change your appointment? Call us and we'll accommodate your needs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <a href="tel:+918939501637" className="font-medium hover:text-primary transition-colors">
                      +91 89395 01637
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <a href="mailto:lestylist.in@gmail.com" className="hover:text-primary transition-colors break-all">
                      lestylist.in@gmail.com
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium">Thirumullaivoyal: No 50/4, CTH Road, Chennai-600062</p>
                      <p className="font-medium">Avadi: No 199, NM Road, Chennai-600054</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p>Mon-Sat: 9:00 AM - 8:00 PM</p>
                      <p>Sunday: 10:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Policies */}
              <div className="bg-primary/5 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Booking Policies</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Please arrive 10 minutes before your appointment time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Cancellations must be made at least 2 hours in advance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Late arrivals may result in shortened service time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Payment can be made via cash, card, or digital wallets</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
