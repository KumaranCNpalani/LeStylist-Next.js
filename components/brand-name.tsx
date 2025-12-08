import { cn } from "@/lib/utils"

interface BrandNameProps {
  variant?: "default" | "large" | "small" | "inline"
  className?: string
  showTagline?: boolean
  textColor?: string
}

export default function BrandName({
  variant = "default",
  className,
  showTagline = true,
  textColor = "text-gray-800",
}: BrandNameProps) {
  const sizeClasses = {
    large: {
      le: "text-5xl md:text-7xl lg:text-8xl",
      stylist: "text-2xl md:text-3xl lg:text-4xl",
      tagline: "text-base md:text-lg lg:text-xl",
    },
    default: {
      le: "text-4xl",
      stylist: "text-lg",
      tagline: "text-xs",
    },
    small: {
      le: "text-2xl",
      stylist: "text-base",
      tagline: "text-xs",
    },
    inline: {
      le: "text-xl",
      stylist: "text-base",
      tagline: "text-xs",
    },
  }

  const sizes = sizeClasses[variant]

  return (
    <div className={cn("flex flex-col items-start", className)}>
      <div className="flex items-baseline">
        <span
          className={cn(
            "font-edwardian text-pink-500",
            sizes.le,
            variant === "inline" && "mr-1",
          )}
        >
          Lé
        </span>
        <span
          className={cn(
            "font-footlight ml-2",
            sizes.stylist,
            textColor,
            variant === "inline" && "ml-1",
          )}
        >
          Stylist
        </span>
      </div>
      {showTagline && (
        <span
          className={cn(
            "font-footlight mt-0.5",
            sizes.tagline,
            textColor === "text-white" ? "text-gray-300" : "text-gray-600",
          )}
        >
          Family Salon & Bridal Studio
        </span>
      )}
    </div>
  )
}

