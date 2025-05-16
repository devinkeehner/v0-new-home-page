"use client"

import { XIcon } from "lucide-react"
import { useEffect } from "react"

interface LightboxProps {
  src: string
  alt?: string
  type?: "image" | "video" | "embed"
  embedHtml?: string
  onClose: () => void
}

export default function Lightbox({ src, alt, type = "image", embedHtml, onClose }: LightboxProps) {
  // Add keyboard event listener to close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    // Prevent scrolling of the body when lightbox is open
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [onClose])

  // Function to create Facebook video embed URL
  const createFacebookVideoEmbed = (postUrl: string) => {
    // Extract video ID from Facebook URL
    const videoIdMatch = postUrl.match(/\/videos\/(\d+)/) || postUrl.match(/\/watch\/\?v=(\d+)/)
    if (videoIdMatch && videoIdMatch[1]) {
      const videoId = videoIdMatch[1]
      // Construct proper video URL with Facebook's preferred format for autoplay
      return `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcthousegop%2Fvideos%2F${videoId}&show_text=false&mute=0&autoplay=true&width=560&height=315`
    }

    // If we can't extract the ID, just use the post URL
    return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(postUrl)}&width=500&show_text=false`
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 overscroll-behavior-contain"
      onClick={onClose}
    >
      <button
        className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        onClick={onClose}
      >
        <XIcon className="h-6 w-6" />
      </button>

      {type === "video" ? (
        <video src={src} controls autoPlay className="max-h-[80vh] max-w-[80vw]">
          Your browser does not support the video tag.
        </video>
      ) : type === "embed" ? (
        <div className="bg-white p-2 rounded-lg">
          {embedHtml ? (
            <div dangerouslySetInnerHTML={{ __html: embedHtml }} />
          ) : (
            <iframe
              src={createFacebookVideoEmbed(src)}
              width="560"
              height="315"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              autoPlay={true}
            ></iframe>
          )}
        </div>
      ) : (
        <img
          src={src || "/placeholder.svg"}
          alt={alt || "Large view"}
          className="max-h-[80vh] max-w-[80vw] object-contain"
          loading="eager" // Force eager loading in lightbox for immediate display
        />
      )}
    </div>
  )
}
