import type { LucideIcon } from "lucide-react"

interface ValueCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export default function ValueCard({ icon: Icon, title, description }: ValueCardProps) {
  return (
    <div className="group rounded-lg border bg-card p-6 shadow-soft transition-all hover:shadow-lg hover-grow">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
