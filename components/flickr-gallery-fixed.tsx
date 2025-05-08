"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { fetchFlickrImages, type FlickrPhoto } from "@/lib/flickr"
import Lightbox from "@/components/lightbox"

export default function FlickrGallery() {
  const [photos, setPhotos] = useState<FlickrPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<FlickrPhoto | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setLoading(true)
        const images = await fetchFlickrImages(30) // Increased to get more photos for better mosaic

        if (images.length === 0) {
          throw new Error("No images found")
        }

        console.log(`Loaded ${images.length} Flickr images`)
        setPhotos(images)
      } catch (err) {
        console.error("Error loading photos:", err)
        setError(`Could not load photos: ${err instanceof Error ? err.message : "Unknown error"}`)
        // Use fallback photos
        setPhotos(getFallbackPhotos())
      } finally {
        setLoading(false)
      }
    }

    loadPhotos()
  }, [])

  // Get fallback photos
  const getFallbackPhotos = (): FlickrPhoto[] => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: `fallback-${i}`,
      title: `Connecticut House Republicans - Photo ${i + 1}`,
      server: "",
      secret: "",
      farm: 0,
      thumbnail: `/placeholder.svg?height=150&width=150&query=connecticut legislature event ${i + 1}`,
      medium: `/placeholder.svg?height=500&width=500&query=connecticut legislature event ${i + 1}`,
      large: `/placeholder.svg?height=1024&width=1024&query=connecticut legislature event ${i + 1}`,
      original: `/placeholder.svg?height=1024&width=1024&query=connecticut legislature event ${i + 1}`,
      datetaken: new Date().toISOString(),
      ownername: "Connecticut House Republicans",
      views: "0",
    }))
  }

  // Implement lazy loading with Intersection Observer
  useEffect(() => {
    if (!galleryRef.current || photos.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const dataSrc = img.getAttribute("data-src")

            if (dataSrc) {
              img.src = dataSrc
              img.removeAttribute("data-src")
              observer.unobserve(img)
            }
          }
        })
      },
      {
        rootMargin: "200px 0px", // Start loading images when they're 200px from viewport
        threshold: 0.01,
      },
    )

    // Observe all images with data-src attribute
    const images = galleryRef.current.querySelectorAll("img[data-src]")
    images.forEach((img) => observer.observe(img))

    return () => {
      images.forEach((img) => observer.unobserve(img))
      observer.disconnect()
    }
  }, [photos])

  const openPhotoModal = (photo: FlickrPhoto) => {
    setSelectedPhoto(photo)
  }

  const closePhotoModal = () => {
    setSelectedPhoto(null)
  }

  return (
    <section className="py-12">
      <div className="container">
        {/* Removed heading */}

        {loading && photos.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="mr-2 h-10 w-10 animate-spin text-secondary-red" />
            <span className="text-lg">Loading photos...</span>
          </div>
        )}

        {error && photos.length === 0 && (
          <div className="mx-auto max-w-md rounded-md bg-red-50 p-4 text-center text-red-800">
            <p className="mt-2 text-sm">{error}</p>
          </div>
        )}

        {/* Photo Gallery with Mosaic Layout */}
        <div ref={galleryRef} className="photo-mosaic">
          {photos.map((photo, index) => (
            <div
              key={`${photo.id}-${index}`}
              className="photo-item cursor-pointer overflow-hidden hover-zoom-container"
              onClick={() => openPhotoModal(photo)}
            >
              {/* Use spinner for loading state */}
              <div className="relative h-full w-full bg-gray-100 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400 absolute" />
                <img
                  src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                  data-src={photo.medium || "/placeholder.svg"}
                  alt={photo.title}
                  className="h-full w-full object-cover hover-zoom opacity-0"
                  onLoad={(e) => {
                    // Once loaded, hide spinner and show image
                    const target = e.target as HTMLImageElement
                    target.classList.remove("opacity-0")
                    const spinner = target.previousElementSibling
                    if (spinner) spinner.classList.add("hidden")
                  }}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox for selected photo */}
        {selectedPhoto && (
          <Lightbox
            src={selectedPhoto.large || selectedPhoto.medium || "/placeholder.svg"}
            alt={selectedPhoto.title}
            onClose={closePhotoModal}
          />
        )}

        {/* Added back the "See More Photos" button */}
        <div className="mt-8 text-center">
          <Link href="https://www.flickr.com/photos/cthouserepublicans/" target="_blank" rel="noopener noreferrer">
            <Button className="bg-secondary-red hover:bg-secondary-red/90">
              See More Photos <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

const USER_ID = "67565175@N02"
