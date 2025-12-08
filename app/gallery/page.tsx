import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { query } from "@/lib/db"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata = {
  title: "Gallery | Le Stylist - Unisex Salon & Bridal Studio",
  description:
    "Browse our gallery of transformations, bridal makeovers, haircuts, and styling at Le Stylist salon in Avadi, Tamil Nadu.",
}

export const dynamic = 'force-dynamic'

async function fetchGalleryImages() {
  try {
    const images = await query(
      `SELECT id, title, image_url, category, description 
       FROM client_images 
       WHERE category IN ('hair', 'makeup', 'skin', 'client')
       ORDER BY display_order, created_at DESC`
    ) as any[]

    return {
      hair: images.filter(img => img.category === 'hair'),
      makeup: images.filter(img => img.category === 'makeup'),
      skin: images.filter(img => img.category === 'skin'),
      client: images.filter(img => img.category === 'client')
    }
  } catch (error) {
    console.warn('Error fetching gallery images:', error)
    return { hair: [], makeup: [], skin: [], client: [] }
  }
}

function GallerySection({ title, images, id }: { title: string, images: any[], id: string }) {
  if (images.length === 0) return null

  return (
    <div id={id} className="mb-16 scroll-mt-24">
      <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-8 border-l-4 border-primary pl-4">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-md bg-white">
            <div className="aspect-[4/5] relative overflow-hidden">
              <Image
                src={image.image_url}
                alt={image.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-white font-bold text-lg mb-1">{image.title}</h3>
                {image.description && (
                  <p className="text-white/80 text-sm line-clamp-2">{image.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function GalleryPage() {
  const gallery = await fetchGalleryImages()
  const hasImages = Object.values(gallery).some(arr => arr.length > 0)

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-12 bg-white mb-8">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-playfair font-bold mb-6">Our Portfolio</h1>
            <p className="text-lg text-gray-700">
              Explore our latest work across hair, makeup, and skin treatments.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          {hasImages ? (
            <>
              {/* Category Navigation */}
              <div className="flex flex-wrap justify-center gap-4 mb-12 sticky top-24 z-30 bg-gray-50/95 backdrop-blur py-4">
                {[
                  { id: 'hair', label: 'Hair Styling', count: gallery.hair.length },
                  { id: 'makeup', label: 'Makeup Artistry', count: gallery.makeup.length },
                  { id: 'skin', label: 'Skin Care', count: gallery.skin.length },
                  { id: 'client', label: 'Client Diaries', count: gallery.client.length },
                ].map(cat => cat.count > 0 && (
                  <Button key={cat.id} variant="outline" asChild className="rounded-full hover:bg-primary hover:text-white transition-colors">
                    <a href={`#${cat.id}`}>{cat.label}</a>
                  </Button>
                ))}
              </div>

              <GallerySection id="hair" title="Hair Styling & Treatments" images={gallery.hair} />
              <GallerySection id="makeup" title="Makeup Artistry" images={gallery.makeup} />
              <GallerySection id="skin" title="Skin Care & Facials" images={gallery.skin} />
              <GallerySection id="client" title="Client Diaries" images={gallery.client} />
            </>
          ) : (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image src="/placeholder.svg" width={40} height={40} alt="No images" className="opacity-20" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Gallery Coming Soon</h3>
              <p className="text-gray-500">We are currently updating our portfolio. Please check back later.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
