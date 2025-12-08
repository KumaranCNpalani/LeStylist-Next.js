import type { LucideIcon } from "lucide-react"

interface StepProps {
  number: number
  title: string
  description: string
  icon: LucideIcon
}

function Step({ number, title, description, icon: Icon }: StepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Icon className="h-8 w-8" />
        </div>
        <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold">
          {number}
        </div>
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

interface HowItWorksProps {
  steps: StepProps[]
}

export default function HowItWorks({ steps }: HowItWorksProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
      {steps.map((step) => (
        <Step key={step.number} {...step} />
      ))}
    </div>
  )
}
