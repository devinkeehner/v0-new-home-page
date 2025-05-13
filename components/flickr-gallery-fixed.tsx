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
  const [useFallback, setUseFallback] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Fix hydration issues by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const loadPhotos = async () => {
      try {
        setLoading(true)
        console.log("Fetching Flickr images...")
        const images = await fetchFlickrImages(30) // Increased to get more photos for better mosaic

        console.log(`Received ${images.length} images from Flickr API`)

        if (!images || images.length === 0) {
          console.log("No images returned from Flickr API, using fallback")
          throw new Error("No images found")
        }

        setPhotos(images)
        setUseFallback(false)
      } catch (err) {
        console.error("Error loading photos:", err)
        setError(`Could not load photos: ${err instanceof Error ? err.message : "Unknown error"}`)
        console.log("Using fallback photos due to error")
        // Use fallback photos
        setPhotos(getFallbackPhotos())
        setUseFallback(true)
      } finally {
        setLoading(false)
      }
    }

    loadPhotos()
  }, [mounted])

  // Get fallback photos
  const getFallbackPhotos = (): FlickrPhoto[] => {
    console.log("Generating fallback photos")
    // Use a stable seed for random placeholder images to avoid hydration mismatches
    const fallbackPhotos = Array.from({ length: 12 }, (_, i) => ({
      id: `fallback-${i}`,
      title: `Connecticut House Republicans - Photo ${i + 1}`,
      server: "",
      secret: "",
      farm: 0,
      thumbnail: `/placeholder.svg?height=150&width=150&query=connecticut legislature event ${i + 1}`,
      medium: `/placeholder.svg?height=500&width=500&query=connecticut legislature event ${i + 1}`,
      large: `/placeholder.svg?height=1024&width=1024&query=connecticut legislature event ${i + 1}`,
      original: `/placeholder.svg?height=1024&width=1024&query=connecticut legislature event ${i + 1}`,
      datetaken: "2023-01-01T00:00:00Z", // Use a fixed date to avoid hydration issues
      ownername: "Connecticut House Republicans",
      views: "0",
    }))
    console.log(`Generated ${fallbackPhotos.length} fallback photos`)
    return fallbackPhotos
  }

  // Implement lazy loading with Intersection Observer
  useEffect(() => {
    if (!mounted || !galleryRef.current || photos.length === 0) return

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
  }, [photos, mounted])

  const openPhotoModal = (photo: FlickrPhoto) => {
    setSelectedPhoto(photo)
  }

  const closePhotoModal = () => {
    setSelectedPhoto(null)
  }

  // If not mounted yet, return a simple loading state to avoid hydration issues
  if (!mounted) {
    return (
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-center py-12">
            <div className="h-10 w-10 rounded-full border-4 border-gray-300 border-t-secondary-red animate-spin"></div>
          </div>
        </div>
      </section>
    )
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

        {error && !useFallback && (
          <div className="mx-auto max-w-md rounded-md bg-red-50 p-4 text-center text-red-800">
            <p className="mt-2 text-sm">{error}</p>
          </div>
        )}

        {/* Photo Gallery with Mosaic Layout */}
        {photos.length > 0 ? (
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
                    data-src={
                      photo.medium ||
                      photo.thumbnail ||
                      "/placeholder.svg?height=500&width=500&query=connecticut legislature" ||
                      "/placeholder.svg"
                    }
                    alt={photo.title}
                    className="h-full w-full object-cover hover-zoom opacity-0"
                    onLoad={(e) => {
                      // Once loaded, hide spinner and show image
                      const target = e.target as HTMLImageElement
                      target.classList.remove("opacity-0")
                      const spinner = target.previousElementSibling
                      if (spinner) spinner.classList.add("hidden")
                    }}
                    onError={(e) => {
                      // If image fails to load, use placeholder
                      const target = e.target as HTMLImageElement
                      target.src = `/placeholder.svg?height=500&width=500&query=connecticut legislature event`
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
        ) : (
          !loading && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No photos available at this time.</p>
              <div className="mt-4">
                <Button
                  onClick={() => {
                    setPhotos(getFallbackPhotos())
                    setUseFallback(true)
                    setError(null)
                  }}
                  className="bg-secondary-red hover:bg-secondary-red/90"
                >
                  Load Sample Photos
                </Button>
              </div>
            </div>
          )
        )}

        {/* Lightbox for selected photo */}
        {selectedPhoto && (
          <Lightbox
            src={
              selectedPhoto.large ||
              selectedPhoto.medium ||
              "/placeholder.svg?height=1024&width=1024&query=connecticut legislature"
            }
            alt={selectedPhoto.title}
            onClose={closePhotoModal}
          />
        )}

        {/* Added back the "See More Photos" button */}
        {photos.length > 0 && (
          <div className="mt-8 text-center">
            <Link href="https://www.flickr.com/photos/cthouserepublicans/" target="_blank" rel="noopener noreferrer">
              <Button className="bg-secondary-red hover:bg-secondary-red/90">
                See More Photos <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
