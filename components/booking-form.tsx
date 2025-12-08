"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Loader2, Clock } from "lucide-react"
import { format, addDays, isBefore, isToday } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Service {
  id: number
  service_name: string
  category: string
  subcategory?: string
  price: number
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  service: z.string({
    required_error: "Please select a service.",
  }).transform((val) => parseInt(val)),
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.string({
    required_error: "Please select a time.",
  }),
  location: z.string({
    required_error: "Please select a location.",
  }),
  message: z.string().optional(),
})

export default function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isMounted, setIsMounted] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  })

  // Generate available time slots based on selected date and location
  const generateTimeSlots = (date: Date, location: string) => {
    const times: string[] = []
    const isSunday = date.getDay() === 0
    const isTodayDate = isToday(date)

    // Business hours: Mon-Sat: 9 AM - 8 PM, Sun: 10 AM - 6 PM
    const startHour = isSunday ? 10 : 9
    const endHour = isSunday ? 18 : 20

    for (let hour = startHour; hour < endHour; hour++) {
      // Skip current time slots if booking for today
      if (isTodayDate) {
        const currentTime = new Date()
        const currentHour = currentTime.getHours()
        const currentMinute = currentTime.getMinutes()

        // Allow booking at least 1 hour ahead
        // If it's currently 2:30 PM, allow booking from 3:30 PM onwards
        if (hour < currentHour + 1) continue
        if (hour === currentHour + 1 && currentMinute > 30) continue
      }

      // Add hour slot
      const time24 = `${hour.toString().padStart(2, '0')}:00`
      times.push(time24)

      // Add 30-minute slot if not the last hour
      if (hour < endHour - 1) {
        const time24Half = `${hour.toString().padStart(2, '0')}:30`
        times.push(time24Half)
      }
    }

    return times
  }

  // Load services on component mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch('/api/admin/services')
        if (response.ok) {
          const data = await response.json()
          setServices(data.services.filter((service: Service) => service.is_active))
        }
      } catch (error) {
        console.error('Failed to load services:', error)
      } finally {
        setLoadingServices(false)
      }
    }
    loadServices()
  }, [])

  // Update available times when date or location changes
  useEffect(() => {
    if (selectedDate && selectedLocation) {
      const times = generateTimeSlots(selectedDate, selectedLocation)
      setAvailableTimes(times)
    } else {
      setAvailableTimes([])
    }
  }, [selectedDate, selectedLocation])

  // Set mounted state
  useEffect(() => {
    setIsMounted(true)
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Get selected service details
      const selectedService = services.find(s => s.id === values.service)

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: values.name,
          customer_phone: values.phone,
          customer_email: values.email,
          service_type: selectedService ? selectedService.service_name : values.service,
          service_id: values.service,
          appointment_date: format(values.date, "yyyy-MM-dd"),
          appointment_time: values.time,
          location: values.location,
          special_requests: values.message || "",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        form.reset()

        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSuccess(false)
        }, 5000)
      } else {
        alert("Failed to book appointment: " + (data.error || "Unknown error"))
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred. Please try again or call us at +91 89395 01637")
      setIsSubmitting(false)
    }
  }

  // Prevent hydration mismatch by ensuring component is mounted
  if (!isMounted) {
    return (
      <div className="animate-pulse">
        <div className="space-y-6">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div suppressHydrationWarning>
      {isSuccess ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">Booking Successful!</h3>
          <p className="text-gray-600">
            We've received your appointment request and will contact you shortly to confirm.
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} suppressHydrationWarning />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} suppressHydrationWarning />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email address" {...field} suppressHydrationWarning />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingServices ? (
                        <SelectItem value="loading" disabled>Loading services...</SelectItem>
                      ) : services.length > 0 ? (
                        services.map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.service_name} - ₹{service.price}
                            {service.subcategory && ` (${service.subcategory.replace('_', ' ')})`}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-services" disabled>No services available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Selection - Must be selected first */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedLocation(value)
                      // Reset date and time when location changes
                      form.setValue("date", undefined)
                      form.setValue("time", "")
                      setSelectedDate(undefined)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger suppressHydrationWarning>
                        <SelectValue placeholder="Select a location first" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent suppressHydrationWarning>
                      <SelectItem value="thirumullaivoyal">
                        Thirumullaivoyal Branch (No 50/4, CTH Road, Chennai-600062)
                      </SelectItem>
                      <SelectItem value="avadi">
                        Avadi Branch (No 199, NM Road, Chennai-600054)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Date
                      {!selectedLocation && (
                        <span className="text-sm text-muted-foreground">(Select location first)</span>
                      )}
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            disabled={!selectedLocation}
                            className={cn(
                              "pl-3 text-left font-normal h-12",
                              !field.value && "text-muted-foreground",
                              !selectedLocation && "cursor-not-allowed opacity-50"
                            )}
                            suppressHydrationWarning
                          >
                            {field.value ? (
                              <div className="flex items-center justify-between w-full">
                                <span>{format(field.value, "EEEE, MMM dd, yyyy")}</span>
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </div>
                            ) : (
                              <div className="flex items-center justify-between w-full">
                                <span>Pick a date</span>
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </div>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={8} suppressHydrationWarning>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date)
                            setSelectedDate(date)
                          }}
                          disabled={(date) => {
                            // Disable past dates
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            if (date < today) return true

                            // Disable Sundays (day 0)
                            if (date.getDay() === 0) return true

                            // Disable dates more than 30 days in advance
                            const maxDate = addDays(today, 30)
                            if (date > maxDate) return true

                            return false
                          }}
                          initialFocus
                          className="rounded-md border shadow-lg"
                          modifiers={{
                            sunday: (date) => date.getDay() === 0,
                          }}
                          modifiersStyles={{
                            sunday: { color: '#ef4444', fontWeight: 'bold' }
                          }}
                        />
                        <div className="p-3 border-t bg-gray-50 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-400 rounded"></div>
                            <span>Sundays - Closed</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span>Book up to 30 days in advance</span>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time
                      {(!selectedDate || !selectedLocation) && (
                        <span className="text-sm text-muted-foreground">(Select date first)</span>
                      )}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!selectedDate || !selectedLocation}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12" suppressHydrationWarning>
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent suppressHydrationWarning>
                        {availableTimes.length > 0 ? (
                          availableTimes.map((time24) => {
                            const hour = parseInt(time24.split(':')[0])
                            const minute = time24.split(':')[1]
                            const isPM = hour >= 12
                            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
                            const time12 = `${displayHour}:${minute} ${isPM ? 'PM' : 'AM'}`

                            return (
                              <SelectItem key={time24} value={time24}>
                                {time12}
                              </SelectItem>
                            )
                          })
                        ) : (
                          <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                            <Clock className="h-4 w-4 mx-auto mb-1 opacity-50" />
                            No available times for selected date
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    {selectedDate && selectedLocation && availableTimes.length === 0 && (
                      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        No slots available for today. Please select a future date.
                      </p>
                    )}
                    {selectedDate && selectedLocation && availableTimes.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedDate.getDay() === 0
                          ? "Sunday hours: 10:00 AM - 6:00 PM"
                          : "Monday-Saturday hours: 9:00 AM - 8:00 PM"
                        }
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>


            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requests or requirements..."
                      className="resize-none"
                      {...field}
                      suppressHydrationWarning
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting} suppressHydrationWarning>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Book Appointment"
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}
