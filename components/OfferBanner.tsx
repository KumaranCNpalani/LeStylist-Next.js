"use client"

import { useState, useEffect } from "react"
import { X, Tag, Sparkles } from "lucide-react"
import Link from "next/link"

interface Offer {
    id: number
    title: string
    description: string
    discount_value: number
    offer_type: string
}

export default function OfferBanner() {
    const [offers, setOffers] = useState<Offer[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        // Fetch active offers
        fetch('/api/offers/active')
            .then(res => res.json())
            .then(data => {
                if (data.offers && data.offers.length > 0) {
                    setOffers(data.offers)
                }
            })
            .catch(err => console.error('Error fetching offers:', err))
    }, [])

    useEffect(() => {
        // Rotate offers every 5 seconds
        if (offers.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % offers.length)
            }, 5000)
            return () => clearInterval(interval)
        }
    }, [offers.length])

    if (!isVisible || offers.length === 0) return null

    const currentOffer = offers[currentIndex]

    return (
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white py-3 px-4 relative overflow-hidden animate-gradient">
            {/* Animated background */}
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>

            <div className="container mx-auto relative z-10">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm animate-pulse">
                            <Tag className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="h-4 w-4 animate-pulse" />
                                <span className="font-bold text-sm sm:text-base">
                                    {currentOffer.title}
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm opacity-90 line-clamp-1">
                                {currentOffer.description} -
                                {currentOffer.offer_type === 'percentage' && ` ${currentOffer.discount_value}% OFF`}
                                {currentOffer.offer_type === 'fixed_amount' && ` ₹${currentOffer.discount_value} OFF`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/offers"
                            className="hidden sm:inline-block bg-white text-pink-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-pink-50 transition-colors"
                        >
                            View Offers
                        </Link>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            aria-label="Close banner"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Offer indicator dots */}
                {offers.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-2">
                        {offers.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-1.5 rounded-full transition-all ${index === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                                    }`}
                                aria-label={`Go to offer ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
      `}</style>
        </div>
    )
}
