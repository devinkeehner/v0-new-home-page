"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, ExternalLink, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FlickrPhoto {
  id: string
  title: string
  url_m?: string
  url_o?: string
  url_s?: string
  url_sq?: string
  dateupload: string
  datetaken: string
  owner: string
  ownername: string
  views: string
  description?: { _content?: string }
}

interface FlickrResponse {
  photos: {
    photo: FlickrPhoto[]
    page: number
    pages: number
    perpage: number
    total: number
  }
  stat: string
}

export default function FlickrGallery() {
  const [photos, setPhotos] = useState<FlickrPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<FlickrPhoto | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true)
        console.log("Fetching photos from Flickr API...")

        const response = await fetch("/api/flickr?tag=HRO&per_page=20")
        console.log("Flickr API response status:", response.status)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const responseText = await response.text()
        console.log(`Received response of length: ${responseText.length}`)

        let data
        try {
          data = JSON.parse(responseText)
        } catch (parseError) {
          console.error("Failed to parse response:", parseError)
          console.log("Response preview:", responseText.substring(0, 200))
          throw new Error("Invalid JSON response")
        }

        console.log("Parsed response:", data)

        if (!data || data.error) {
          throw new Error(data?.error || "Invalid response from API")
        }

        if (data.stat !== "ok" || !data.photos || !Array.isArray(data.photos.photo)) {
          console.error("Unexpected response structure:", JSON.stringify(data).substring(0, 500))
          throw new Error("Unexpected response format")
        }

        console.log(`Found ${data.photos.photo.length} photos`)
        setPhotos(data.photos.photo)
      } catch (err) {
        console.error("Error fetching photos:", err)
        setError(`Could not load photos: ${err instanceof Error ? err.message : "Unknown error"}`)
        // Use fallback photos
        setPhotos(getFallbackPhotos())
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  const getFallbackPhotos = (): FlickrPhoto[] => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: `fallback-${i}`,
      title: `Connecticut House Republicans - Photo ${i + 1}`,
      url_m: `/placeholder.svg?height=400&width=400&query=connecticut legislature event ${i + 1}`,
      dateupload: new Date().toISOString(),
      datetaken: new Date().toISOString(),
      owner: "fallback",
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

  // Force reflow of columns after photos are loaded
  useEffect(() => {
    if (photos.length > 0 && galleryRef.current) {
      // Force a reflow by temporarily changing a property
      const container = galleryRef.current
      const originalDisplay = container.style.display
      container.style.display = "none"

      // This forces the browser to recalculate layout
      void container.offsetHeight

      // Restore the original display value
      container.style.display = originalDisplay
    }
  }, [photos])

  const openPhotoModal = (photo: FlickrPhoto) => {
    setSelectedPhoto(photo)
    document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
  }

  const closePhotoModal = () => {
    setSelectedPhoto(null)
    document.body.style.overflow = "" // Restore scrolling
  }

  // Get Flickr photo page URL
  const getFlickrPhotoUrl = (photo: FlickrPhoto) => {
    return `https://www.flickr.com/photos/${photo.owner}/${photo.id}`
  }

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="mb-8 text-center text-3xl font-bold text-primary-navy">Photo Gallery</h2>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-secondary-red" />
            <span>Loading photos...</span>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-md rounded-md bg-red-50 p-4 text-center text-red-800">
            <p>{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-secondary-red hover:bg-secondary-red/90"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Photo Gallery with Masonry Layout */}
        <div ref={galleryRef} className="flickr-gallery mx-auto gap-4 sm:columns-2 md:columns-3 lg:columns-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="mb-4 block w-full overflow-hidden rounded-lg bg-white shadow-sm break-inside-avoid cursor-pointer group"
              onClick={() => openPhotoModal(photo)}
            >
              <div className="relative">
                <img
                  src="/loading-screen-animation.png"
                  data-src={photo.url_m || photo.url_s || photo.url_sq}
                  alt={photo.title || "Connecticut House Republicans"}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <ZoomIn className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="p-2">
                <h3 className="truncate text-sm font-medium text-primary-navy">
                  {photo.title || "Connecticut House Republicans"}
                </h3>
                <p className="text-xs text-gray-500">{new Date(photo.datetaken).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Photo Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={closePhotoModal}
          >
            <div
              className="relative max-h-[90vh] max-w-4xl overflow-auto rounded-lg bg-white p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                onClick={closePhotoModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <img
                src={selectedPhoto.url_o || selectedPhoto.url_m || selectedPhoto.url_s}
                alt={selectedPhoto.title || "Connecticut House Republicans"}
                className="max-h-[70vh] w-auto"
              />

              <div className="bg-white p-4">
                <h3 className="mb-1 text-lg font-bold text-primary-navy">
                  {selectedPhoto.title || "Connecticut House Republicans"}
                </h3>

                <p className="mb-2 text-sm text-gray-700">{selectedPhoto.description?._content || ""}</p>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <p>Taken on {new Date(selectedPhoto.datetaken).toLocaleDateString()}</p>
                    <p>{selectedPhoto.views} views</p>
                  </div>

                  <Link
                    href={getFlickrPhotoUrl(selectedPhoto)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-md bg-[#0063DC] px-4 py-2 text-sm font-medium text-white hover:bg-[#0063DC]/90"
                  >
                    View on Flickr <ExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="https://www.flickr.com/photos/cthouserepublicans/" target="_blank" rel="noopener noreferrer">
            <Button className="bg-secondary-red hover:bg-secondary-red/90">
              View Full Gallery <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
