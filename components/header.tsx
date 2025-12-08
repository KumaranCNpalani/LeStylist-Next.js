"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Phone, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import BrandName from "@/components/brand-name"
import Logo from "@/components/logo"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <div className="flex items-center gap-3">
              <Logo size="md" priority className="group-hover:scale-110" />
              <div className="hidden sm:block">
                <BrandName variant="default" textColor="text-gray-800" />
              </div>
              <div className="sm:hidden">
                <BrandName variant="small" showTagline={false} textColor="text-gray-800" />
              </div>
            </div>
          </Link>
        </div>
      </header>
    )
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <div className="flex items-center gap-3">
            {/* Logo Image */}
            <Logo size="md" priority className="group-hover:scale-110" />
            {/* Brand Name Text */}
            <div className="hidden sm:block">
              <BrandName variant="default" textColor="text-gray-800" />
            </div>
            {/* Mobile: Just show logo */}
            <div className="sm:hidden">
              <BrandName variant="small" showTagline={false} textColor="text-gray-800" />
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105 relative group"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105 relative group"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
          </Link>
          <div className="relative group">
            <button
              className="flex items-center text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105"
              suppressHydrationWarning
            >
              Services
              <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
              <div className="py-2">
                <Link
                  href="/services"
                  className="block px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                >
                  All Services
                </Link>
                <Link
                  href="/services/women"
                  className="block px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                >
                  Women Services
                </Link>
                <Link
                  href="/services/men"
                  className="block px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                >
                  Men Services
                </Link>
                <Link
                  href="/services/makeup"
                  className="block px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                >
                  Makeup
                </Link>
                <Link
                  href="/services/hydrafacial"
                  className="block px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                >
                  Hydrafacial
                </Link>
              </div>
            </div>
          </div>
          <Link
            href="/gallery"
            className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105 relative group"
          >
            Gallery
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/offers"
            className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105 relative group"
          >
            Offers
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/franchise"
            className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105 relative group"
          >
            Franchise
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
          </Link>
          <div className="flex items-center space-x-2 animate-pulse-slow">
            <Phone className="h-4 w-4 text-primary" />
            <a href="tel:+918939501637" className="text-sm font-medium hover:text-primary transition-colors">
              +91 89395 01637
            </a>
          </div>
          <Button asChild className="animate-scale-in hover:scale-105 transition-transform duration-300">
            <Link href="/booking">Book Now</Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 hover:scale-110 transition-transform duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          suppressHydrationWarning
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 animate-rotate-in" />
          ) : (
            <Menu className="h-6 w-6 animate-fade-in" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-40 bg-background lg:hidden transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <nav className="container flex flex-col space-y-6 p-6 h-full overflow-y-auto">
          <Link
            href="/"
            className="text-lg font-medium hover:text-primary transition-all duration-300 hover:translate-x-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-lg font-medium hover:text-primary transition-all duration-300 hover:translate-x-2"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <div>
            <button
              className="flex items-center justify-between w-full text-lg font-medium hover:text-primary transition-all duration-300"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
            >
              Services
              <ChevronDown
                className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isServicesOpen && "rotate-180",
                )}
              />
            </button>
            {isServicesOpen && (
              <div className="mt-2 ml-4 space-y-2 animate-fade-in-up">
                <Link
                  href="/services"
                  className="block text-base text-gray-600 hover:text-primary transition-all duration-300 hover:translate-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Services
                </Link>
                <Link
                  href="/services/women"
                  className="block text-base text-gray-600 hover:text-primary transition-all duration-300 hover:translate-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Women Services
                </Link>
                <Link
                  href="/services/men"
                  className="block text-base text-gray-600 hover:text-primary transition-all duration-300 hover:translate-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Men Services
                </Link>
                <Link
                  href="/services/makeup"
                  className="block text-base text-gray-600 hover:text-primary transition-all duration-300 hover:translate-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Makeup
                </Link>
                <Link
                  href="/services/hydrafacial"
                  className="block text-base text-gray-600 hover:text-primary transition-all duration-300 hover:translate-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hydrafacial
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/gallery"
            className="text-lg font-medium hover:text-primary transition-all duration-300 hover:translate-x-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Gallery
          </Link>
          <Link
            href="/offers"
            className="text-lg font-medium hover:text-primary transition-all duration-300 hover:translate-x-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Offers
          </Link>
          <Link
            href="/franchise"
            className="text-lg font-medium hover:text-primary transition-all duration-300 hover:translate-x-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Franchise
          </Link>
          <div className="flex items-center space-x-2 py-2">
            <Phone className="h-5 w-5 text-primary" />
            <span className="text-base font-medium">+91 98765 43210</span>
          </div>
          <Button asChild className="w-full animate-bounce-in" onClick={() => setIsMenuOpen(false)}>
            <Link href="/booking">Book Now</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
