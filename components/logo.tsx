"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  invert?: boolean
  priority?: boolean
}

export default function Logo({ size = "md", className, invert = false, priority = false }: LogoProps) {
  const [imgSrc, setImgSrc] = useState("/logo.png")
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Check if logo exists by trying to load it
    const img = new window.Image()
    img.onerror = () => {
      if (!hasError) {
        setHasError(true)
        setImgSrc("/placeholder-logo.png")
      }
    }
    img.onload = () => {
      setHasError(false)
    }
    img.src = "/logo.png"
  }, [hasError])

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-14 w-14 md:h-16 md:w-16",
    lg: "h-20 w-20 md:h-24 md:w-24",
    xl: "h-32 w-32 md:h-40 md:w-40",
  }

  return (
    <div className={cn("relative flex-shrink-0", sizeClasses[size], className)}>
      <Image
        src={imgSrc}
        alt="Lé Stylist Logo"
        fill
        className={cn(
          "object-contain transition-transform duration-300",
          invert && "brightness-0 invert",
        )}
        priority={priority}
        sizes={
          size === "sm"
            ? "40px"
            : size === "md"
              ? "64px"
              : size === "lg"
                ? "96px"
                : "160px"
        }
        unoptimized={hasError}
      />
    </div>
  )
}

