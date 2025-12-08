import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  title: string
  description: string
  imageSrc: string
  href: string
  className?: string
}

export default function ProductCard({ title, description, imageSrc, href, className }: ProductCardProps) {
  return (
    <div
      className={cn(
        "group overflow-hidden rounded-lg border bg-card shadow-soft transition-all hover:shadow-lg",
        className,
      )}
    >
      <div className="aspect-[16/9] w-full overflow-hidden">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          width={600}
          height={340}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className="mb-4 text-muted-foreground">{description}</p>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href={href}>Learn More</Link>
        </Button>
      </div>
    </div>
  )
}
