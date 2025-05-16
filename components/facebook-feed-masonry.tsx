"use client"

import { useState, useRef } from "react"
import Masonry from "react-masonry-css"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, MessageSquare, ThumbsUp, Share2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import SocialFeedEmbed from "@/components/social-feed-embed"
import Lightbox from "@/components/lightbox"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface FacebookPost {
  id: string
  message?: string
  permalink_url: string
  created_time: string
  full_picture?: string
  attachments?: {
    data: Array<{
      media_type: string
      media_url?: string
      type: string
      url?: string
    }>
  }
}

// Helper functions as suggested
const isVideo = (post: FacebookPost) => post.attachments?.data?.some((att) => att.media_type === "video")

export default function FacebookFeedMasonry() {
  const { data, error, isLoading } = useSWR("/api/fb-feed", fetcher, {
    refreshInterval: 600_000, // Refresh every 10 minutes
    revalidateOnFocus: false,
  })
  const [selectedPhoto, setSelectedPhoto] = useState<{
    src: string
    alt?: string
    type?: "image" | "video" | "embed"
    embedHtml?: string
  } | null>(null)

  // Ref to track the clicked element for focus management
  const clickedElementRef = useRef<HTMLDivElement | null>(null)
  const postRefs = useRef<Array<HTMLDivElement | null>>([])

  // Breakpoints for the masonry layout
  const breakpointColumns = {
    default: 3,
    1280: 3,
    1024: 2,
    640: 1,
  }

  if (error) {
    console.error("Error loading Facebook feed, falling back to embedded feed:", error)
    // Fall back to the existing social feed component
    return <SocialFeedEmbed />
  }

  if (isLoading) {
    return (
      <Masonry breakpointCols={breakpointColumns} className="flex w-full -ml-4" columnClassName="pl-4 bg-transparent">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="mb-4 overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-20" />
              </CardFooter>
            </Card>
          ))}
      </Masonry>
    )
  }

  const posts = ((data?.data as FacebookPost[]) || []).slice(0, 6)

  // Format the post date
  const formatPostDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (e) {
      return dateString
    }
  }

  // Function to create Facebook video embed URL
  const createFacebookVideoEmbed = (postUrl: string) => {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(postUrl)}&show_text=0&width=560&height=315&autoplay=1`
  }

  // Function to open lightbox
  const openLightbox = (post: FacebookPost, index: number) => {
    // Store reference to clicked element for focus management
    clickedElementRef.current = postRefs.current[index]

    if (isVideo(post)) {
      // For videos, use embed
      setSelectedPhoto({
        src: post.permalink_url,
        type: "embed",
        alt: post.message || "Facebook video",
        embedHtml: `<iframe 
          src="${createFacebookVideoEmbed(post.permalink_url)}" 
          width="560" 
          height="315" 
          style="border:none;overflow:hidden" 
          scrolling="no" 
          frameborder="0" 
          allowfullscreen="true" 
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
        </iframe>`,
      })
    } else if (post.full_picture) {
      // For images
      setSelectedPhoto({
        src: post.full_picture,
        type: "image",
        alt: post.message || "Facebook post",
      })
    }
  }

  // Function to close lightbox
  const closeLightbox = () => {
    setSelectedPhoto(null)

    // Return focus to the clicked element
    setTimeout(() => {
      if (clickedElementRef.current) {
        clickedElementRef.current.focus()
      }
    }, 0)
  }

  return (
    <>
      <Masonry breakpointCols={breakpointColumns} className="flex w-full -ml-4" columnClassName="pl-4 bg-transparent">
        {posts.map((post, index) => {
          return (
            <Card
              key={post.id}
              className="mb-4 overflow-hidden hover:shadow-md transition-shadow"
              ref={(el) => (postRefs.current[index] = el)}
            >
              {/* Post Header */}
              <div className="flex items-center gap-3 border-b p-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <img
                    src="/images/ct-house-gop-logo.webp"
                    alt="Connecticut House Republicans"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <a
                      href="https://www.facebook.com/cthousegop"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary-navy hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Connecticut House Republicans
                    </a>
                    <svg className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500">{formatPostDate(post.created_time)}</span>
                </div>
              </div>

              {/* Post Content */}
              <CardContent className="p-4">
                {post.message && <p className="mb-3 whitespace-pre-line text-sm line-clamp-5">{post.message}</p>}

                {post.full_picture && (
                  <div
                    className="relative overflow-hidden rounded-md cursor-pointer card-image-hover"
                    onClick={() => openLightbox(post, index)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View ${isVideo(post) ? "video" : "image"}: ${post.message || "Facebook post"}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        openLightbox(post, index)
                      }
                    }}
                  >
                    <img
                      src={post.full_picture || "/placeholder.svg"}
                      alt={post.message || "Post image"}
                      className="w-full object-cover"
                      loading="lazy"
                      style={{ width: "100%" }} // Explicit width for Masonry
                    />
                    {isVideo(post) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="rounded-full bg-white/30 p-3">
                          <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="flex items-center gap-4 border-t border-b py-2 mt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Like</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Comment</span>
                  </div>
                </div>
              </CardContent>

              {/* Post Footer */}
              <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-secondary-red text-secondary-red hover:bg-secondary-red/10"
                  asChild
                >
                  <a href={post.permalink_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Facebook
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-secondary-red text-secondary-red hover:bg-secondary-red/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post.permalink_url)}`,
                      "share-facebook",
                      "width=580,height=296",
                    )
                  }}
                >
                  <Share2 className="mr-1 h-4 w-4" />
                  Share
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </Masonry>

      {/* Lightbox for images and videos */}
      {selectedPhoto && (
        <Lightbox
          src={selectedPhoto.src}
          alt={selectedPhoto.alt}
          type={selectedPhoto.type}
          embedHtml={selectedPhoto.embedHtml}
          onClose={closeLightbox}
        />
      )}
    </>
  )
}
