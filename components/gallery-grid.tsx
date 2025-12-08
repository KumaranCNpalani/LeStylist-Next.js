"use client"

import React, { useMemo, useState } from "react"

interface ImageItem {
  id: number
  title: string
  image_url: string
  category: string
  description: string
}

export default function GalleryGrid({ images }: { images: ImageItem[] }) {
  const [filter, setFilter] = useState<string>("all")

  const categories = useMemo(() => {
    const set = new Set<string>()
    images.forEach((i) => set.add(i.category || "uncategorized"))
    return ["all", ...Array.from(set)]
  }, [images])

  const filtered = useMemo(() => {
    if (filter === "all") return images
    return images.filter((i) => (i.category || "uncategorized") === filter)
  }, [images, filter])

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-4 py-2 border ${filter === c ? 'bg-primary text-white' : 'bg-white'}`}>
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((img) => (
          <figure key={img.id} className="rounded-lg overflow-hidden bg-white shadow">
            <div className="w-full flex items-center justify-center bg-gray-100">
              <img src={img.image_url} alt={img.title || 'Gallery image'} className="max-w-full h-auto object-contain" />
            </div>
            <figcaption className="p-3">
              <h3 className="font-semibold text-sm mb-1">{img.title}</h3>
              {img.description && <p className="text-xs text-muted-foreground">{img.description}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
