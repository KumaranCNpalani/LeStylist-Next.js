import type React from "react"
import { Brain, Heart, Wifi, Smile } from "lucide-react"

interface ValueCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <div className="group rounded-lg border bg-card p-6 shadow-soft transition-all hover:shadow-lg">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

export default function ValueGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ValueCard
        icon={<Brain className="h-6 w-6" />}
        title="Science-Driven Design"
        description="Our devices are built on years of research into optimal reading experiences and cognitive science."
      />
      <ValueCard
        icon={<Heart className="h-6 w-6" />}
        title="A Mascot You'll Love"
        description="Meet our friendly mascot who guides you through your reading journey with personality and charm."
      />
      <ValueCard
        icon={<Wifi className="h-6 w-6 line-through" />}
        title="Offline Freedom"
        description="Disconnect from the digital noise and immerse yourself in distraction-free reading, anywhere."
      />
      <ValueCard
        icon={<Smile className="h-6 w-6" />}
        title="Designed for Delight"
        description="Every interaction with our device is crafted to bring joy and satisfaction to your reading experience."
      />
    </div>
  )
}
