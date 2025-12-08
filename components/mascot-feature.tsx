import Image from "next/image"

export default function MascotFeature() {
  return (
    <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-8 md:p-10">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="relative h-48 w-48 md:h-64 md:w-64 rounded-full bg-white shadow-soft overflow-hidden">
            <Image
              src="/placeholder.svg?height=256&width=256"
              alt="Rhythm Mascot"
              width={256}
              height={256}
              className="object-cover"
            />
          </div>
        </div>
        <div className="w-full md:w-2/3 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Meet Our Mascot</h2>
          <p className="text-muted-foreground md:text-lg">
            Say hello to Pagie, your reading companion! Pagie is more than just a mascot – they're your guide to a
            better reading experience. With a friendly smile and helpful personality, Pagie helps you navigate your
            reading journey, offering tips, encouragement, and a touch of whimsy along the way. Designed with care to
            make your offline reading experience more delightful, Pagie embodies our commitment to making reading both
            joyful and meaningful.
          </p>
        </div>
      </div>
    </div>
  )
}
