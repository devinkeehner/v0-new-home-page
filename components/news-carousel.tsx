"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatWordPressDate, stripHtmlTags, getFeaturedImageUrl } from "@/lib/api"

interface Post {
  id: number
  title: { rendered: string }
  excerpt: { rendered: string }
  date: string
  slug: string
  _embedded?: any
}

export function NewsCarousel({ posts }: { posts: Post[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const postsPerPage = 3
  const totalPages = Math.ceil(posts.length / postsPerPage)

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 150) {
      // Swipe left
      handleNext()
    }

    if (touchStart - touchEnd < -150) {
      // Swipe right
      handlePrev()
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (autoplay) {
      interval = setInterval(() => {
        handleNext()
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoplay, currentIndex])

  const visiblePosts = posts.slice(currentIndex * postsPerPage, (currentIndex + 1) * postsPerPage)

  return (
    <div className="relative w-full overflow-hidden py-8">
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => {
            const featuredImageUrl = getFeaturedImageUrl(post)
            return (
              <Card key={post.id} className="overflow-hidden">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={featuredImageUrl || "/placeholder.svg?height=400&width=600&query=news"}
                    alt={post.title.rendered}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <Link href={`/${post.slug}`}>
                    <h3
                      className="mb-2 text-lg font-bold text-secondary-red hover:underline"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                  </Link>
                  <p className="mb-2 text-sm text-gray-600">Posted on {formatWordPressDate(post.date)}</p>
                  <p className="mb-4 text-sm text-gray-700 line-clamp-2">{stripHtmlTags(post.excerpt.rendered)}</p>
                  <Button asChild className="bg-secondary-red hover:bg-secondary-red/90" size="sm">
                    <Link href={`/${post.slug}`}>Read More</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 transform">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/80 shadow-md"
          onClick={handlePrev}
          aria-label="Previous posts"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 transform">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/80 shadow-md"
          onClick={handleNext}
          aria-label="Next posts"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Pagination indicators */}
      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`h-2 w-8 rounded-full ${index === currentIndex ? "bg-secondary-red" : "bg-gray-300"}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
