import type { LucideIcon } from "lucide-react"

interface ProductFeatureProps {
  icon: LucideIcon
  title: string
  description: string
}

export default function ProductFeature({ icon: Icon, title, description }: ProductFeatureProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
