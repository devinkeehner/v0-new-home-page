"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, Loader2, AlertCircle, ThumbsUp, MessageSquare, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Define the structure for our parsed posts
interface SocialPost {
  content: string
  date: string
  imageUrl: string | null
  videoUrl?: string | null
  videoEmbedHtml?: string | null
  likes: string
  comments?: string
  link: string
  postType: "photo" | "video" | "status"
  author?: string
}

// Add state for lightbox
export default function SocialFeedEmbed() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentFeedIndex, setCurrentFeedIndex] = useState(0)
  const [posts, setPosts] = useState<SocialPost[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxContent, setLightboxContent] = useState<{
    src: string
    type: "image" | "video" | "embed"
    alt?: string
    embedHtml?: string
  }>({
    src: "",
    type: "image",
  })

  const feedUrls = [
    "https://www.cthousegop.com/social-link-6/",
    "https://www.cthousegop.com/social-links-12/",
    "https://www.cthousegop.com/social-links-18/",
  ]

  const fetchSocialFeed = async (urlIndex: number) => {
    try {
      setLoading(true)
      console.log(`Fetching social feed from: ${feedUrls[urlIndex]}`)

      // Use our proxy API route to avoid CORS issues
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(feedUrls[urlIndex])}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const html = await response.text()
      console.log("Social feed data received, length:", html.length)

      // Parse the HTML to extract posts
      const extractedPosts = extractPostsFromHtml(html)
      console.log(`Extracted ${extractedPosts.length} posts`)

      if (extractedPosts.length === 0) {
        throw new Error("No posts found in the response")
      }

      // If we're loading more posts, replace the current posts with the new set
      // This ensures we're showing the correct posts for each feed URL
      setPosts(extractedPosts)
      setCurrentFeedIndex(urlIndex)
    } catch (err) {
      console.error("Failed to load social feed:", err)
      setError(`Could not load social feed: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  // Extract post data from the HTML
  const extractPostsFromHtml = (htmlString: string): SocialPost[] => {
    try {
      // Create a temporary DOM element to parse the HTML
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlString, "text/html")

      // Find all post elements - try different selectors
      let postElements = doc.querySelectorAll(".brick.efbl-story-wrapper")

      // If no posts found with the primary selector, try alternatives
      if (postElements.length === 0) {
        postElements = doc.querySelectorAll(".efbl-story-wrapper")
      }

      if (postElements.length === 0) {
        postElements = doc.querySelectorAll(".efbl_feed_wraper .efbl_story_wrapper")
      }

      if (postElements.length === 0) {
        console.log("No post elements found with any selector")
        return []
      }

      console.log(`Found ${postElements.length} post elements`)

      // Extract data from each post
      return Array.from(postElements).map((post) => {
        // Extract post content
        const contentElement =
          post.querySelector(".efbl-description-wrap") ||
          post.querySelector(".efbl_content_wraper") ||
          post.querySelector(".description")
        const content = contentElement ? contentElement.textContent?.trim() || "" : ""

        // Extract post date
        const dateElement =
          post.querySelector(".efbl-profile-title span:last-child") ||
          post.querySelector(".efbl_date") ||
          post.querySelector(".time")
        const date = dateElement ? dateElement.textContent?.trim() || "" : ""

        // Extract image URL if available
        const imageElement =
          (post.querySelector(".img-responsive") as HTMLImageElement) || (post.querySelector("img") as HTMLImageElement)
        const imageUrl = imageElement ? imageElement.src : null

        // Extract video URL if available - try multiple approaches
        let videoUrl = null
        let videoEmbedHtml = null

        // Try to find direct video element
        const videoElement = post.querySelector("video source") as HTMLSourceElement
        if (videoElement && videoElement.src) {
          videoUrl = videoElement.src
        }

        // If no direct video, look for iframe embed
        if (!videoUrl) {
          const iframeElement = post.querySelector("iframe") as HTMLIFrameElement
          if (iframeElement && iframeElement.src) {
            // For iframe embeds, we'll use the iframe HTML directly
            videoEmbedHtml = iframeElement.outerHTML
          }
        }

        // Look for Facebook video links
        if (!videoUrl && !videoEmbedHtml) {
          const videoLinks = Array.from(post.querySelectorAll('a[href*="facebook.com/watch"]'))
          if (videoLinks.length > 0) {
            const videoLink = videoLinks[0] as HTMLAnchorElement
            videoUrl = videoLink.href
          }
        }

        // Extract engagement stats
        const likesElement =
          post.querySelector(".efbl-reacted-item") || post.querySelector(".efbl_likes") || post.querySelector(".likes")
        const likes = likesElement ? likesElement.textContent?.trim() || "0" : "0"

        // Extract comments count if available
        const commentsElement = post.querySelector(".efbl-comments")
        const comments = commentsElement ? commentsElement.textContent?.trim() || "0" : "0"

        // Extract link to original post
        const linkElement =
          (post.querySelector(".efbl-view-on-fb") as HTMLAnchorElement) ||
          (post.querySelector("a[href*='facebook.com']") as HTMLAnchorElement)
        const link = linkElement ? linkElement.href : "https://www.facebook.com/cthousegop"

        // Determine post type
        const hasVideo =
          post.querySelector(".icon-esf-video-camera") !== null ||
          post.querySelector("video") !== null ||
          videoUrl !== null ||
          videoEmbedHtml !== null ||
          post.querySelector('a[href*="facebook.com/watch"]') !== null

        const postType = hasVideo ? "video" : imageUrl ? "photo" : "status"

        // Extract author name if available
        const authorElement = post.querySelector(".efbl-profile-title")
        const author = authorElement
          ? authorElement.textContent?.trim().split("\n")[0] || "Connecticut House Republicans"
          : "Connecticut House Republicans"

        return {
          content,
          date,
          imageUrl,
          videoUrl,
          videoEmbedHtml,
          likes,
          comments,
          link,
          postType,
          author,
        }
      })
    } catch (err) {
      console.error("Error parsing HTML:", err)
      return []
    }
  }

  // Initial load
  useEffect(() => {
    fetchSocialFeed(0)
  }, [])

  // Force reflow of columns after posts are loaded
  useEffect(() => {
    if (posts.length > 0 && containerRef.current) {
      // Force a reflow by temporarily changing a property
      const container = containerRef.current
      const originalDisplay = container.style.display
      container.style.display = "none"

      // This forces the browser to recalculate layout
      void container.offsetHeight

      // Restore the original display value
      container.style.display = originalDisplay
    }
  }, [posts])

  // Handle load more button click
  const handleLoadMore = () => {
    if (currentFeedIndex < feedUrls.length - 1) {
      const nextIndex = currentFeedIndex + 1
      fetchSocialFeed(nextIndex)
    }
  }

  // Add functions to handle lightbox
  const openLightbox = (post: SocialPost) => {
    if (post.postType === "video") {
      if (post.videoEmbedHtml) {
        // If we have an embed HTML, use that
        setLightboxContent({
          src: post.link,
          type: "embed",
          alt: post.content,
          embedHtml: post.videoEmbedHtml,
        })
      } else if (post.videoUrl) {
        // If we have a direct video URL, use that
        setLightboxContent({
          src: post.videoUrl,
          type: "video",
          alt: post.content,
        })
      } else {
        // If we don't have a video URL, open the Facebook post in a new tab
        window.open(post.link, "_blank")
        return // Don't open lightbox
      }
    } else if (post.imageUrl) {
      setLightboxContent({
        src: post.imageUrl,
        type: "image",
        alt: post.content,
      })
    }
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  // Add function to handle share
  const handleShare = (post: SocialPost, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening the lightbox

    // Create share URL for Facebook
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post.link)}`

    // Open in a new window
    window.open(shareUrl, "share-facebook", "width=580,height=296")
  }

  // Function to create Facebook video embed URL
  const createFacebookVideoEmbed = (postUrl: string) => {
    // Extract video ID from Facebook URL
    const videoIdMatch = postUrl.match(/\/videos\/(\d+)/) || postUrl.match(/\/watch\/\?v=(\d+)/)
    if (videoIdMatch && videoIdMatch[1]) {
      const videoId = videoIdMatch[1]
      return `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fvideo.php%3Fv%3D${videoId}&show_text=0&width=560`
    }

    // If we can't extract the ID, just use the post URL
    return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(postUrl)}&width=500&show_text=false`
  }

  return (
    <section className="bg-light-blue/20 py-12">
      <div className="container">
        <h2 className="mb-8 text-center text-3xl font-bold text-primary-navy">Social Media</h2>

        {loading && currentFeedIndex === 0 && posts.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-secondary-red" />
            <span>Loading social feed...</span>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800">
            <div className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              <h3 className="font-medium">Error loading social feed</h3>
            </div>
            <p className="mt-2 text-sm">{error}</p>
            <Button
              onClick={() => fetchSocialFeed(currentFeedIndex)}
              className="mt-4 bg-secondary-red hover:bg-secondary-red/90"
              size="sm"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* True masonry layout using CSS columns with proper distribution */}
        <div ref={containerRef} className="social-feed-container mx-auto gap-4 sm:columns-2 md:columns-3 lg:columns-3">
          {posts.map((post, index) => (
            <div
              key={index}
              className="mb-4 block w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm break-inside-avoid"
            >
              {/* Post Header */}
              <div className="flex items-center gap-3 border-b p-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src="https://www.cthousegop.com/wp-content/uploads/2025/01/ct_house_gop_with_background.jpg"
                    alt="Connecticut House Republicans"
                    width={40}
                    height={40}
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <Link
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary-navy hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {post.author || "Connecticut House Republicans"}
                    </Link>
                    <svg className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500">{post.date}</span>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-3">
                <p className="mb-3 whitespace-pre-line text-sm">{post.content}</p>

                {post.imageUrl && (
                  <div
                    className="relative mb-3 overflow-hidden rounded-md cursor-pointer"
                    onClick={() => openLightbox(post)}
                  >
                    <img
                      src={post.imageUrl || "/placeholder.svg"}
                      alt="Post image"
                      className="w-full object-cover"
                      loading="lazy"
                    />
                    {post.postType === "video" && (
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
                <div className="flex items-center gap-4 border-t border-b py-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </div>
                  {post.comments && Number.parseInt(post.comments) > 0 && (
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Footer */}
              <div className="flex items-center justify-between p-2">
                <Link
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-md bg-[#1877F2] px-4 py-2 text-sm font-medium text-white hover:bg-[#1877F2]/90"
                  onClick={(e) => e.stopPropagation()}
                >
                  View on Facebook
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-secondary-red text-secondary-red hover:bg-secondary-red/10"
                  onClick={(e) => handleShare(post, e)}
                >
                  <Share2 className="mr-1 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          {loading && currentFeedIndex > 0 ? (
            <Button disabled className="bg-secondary-red hover:bg-secondary-red/90">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading more posts...
            </Button>
          ) : currentFeedIndex < feedUrls.length - 1 ? (
            <Button onClick={handleLoadMore} className="bg-secondary-red hover:bg-secondary-red/90">
              Load More
            </Button>
          ) : (
            <Link href="https://www.facebook.com/cthousegop" target="_blank" rel="noopener noreferrer">
              <Button className="bg-secondary-red hover:bg-secondary-red/90">
                See More on Facebook <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
      {/* Lightbox for images and videos */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={closeLightbox}>
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
              onClick={closeLightbox}
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

            {lightboxContent.type === "video" ? (
              <video src={lightboxContent.src} controls autoPlay className="max-h-[80vh] max-w-[80vw]">
                Your browser does not support the video tag.
              </video>
            ) : lightboxContent.type === "embed" ? (
              <div className="bg-white p-2 rounded-lg">
                {lightboxContent.embedHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: lightboxContent.embedHtml }} />
                ) : (
                  <iframe
                    src={createFacebookVideoEmbed(lightboxContent.src)}
                    width="560"
                    height="315"
                    style={{ border: "none", overflow: "hidden" }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  ></iframe>
                )}
              </div>
            ) : (
              <img
                src={lightboxContent.src || "/placeholder.svg"}
                alt={lightboxContent.alt || "Lightbox image"}
                className="max-h-[80vh] max-w-[80vw] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </section>
  )
}
