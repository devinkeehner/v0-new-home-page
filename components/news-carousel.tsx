"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatWordPressDate, stripHtmlTags, getFeaturedImageUrl } from "@/lib/api"
import Image from "next/image"

// Define the WordPress post type
interface WordPressPost {
  id: number
  title: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  date: string
  link: string
  slug: string
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string
    }>
  }
  featured_media: number
}

interface NewsCarouselProps {
  posts: WordPressPost[]
}

export function NewsCarousel({ posts = [] }: NewsCarouselProps) {
  // Limit to 18 posts
  const limitedPosts = posts.slice(0, 18)

  // Group posts into sets of 3
  const itemsPerPage = 3
  const totalGroups = Math.ceil(limitedPosts.length / itemsPerPage)
  const postGroups = Array.from({ length: totalGroups }, (_, i) =>
    limitedPosts.slice(i * itemsPerPage, (i + 1) * itemsPerPage),
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalGroups)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalGroups) % totalGroups)
  }

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      nextSlide()
    }, 15000) // 15 seconds per slide

    return () => clearInterval(interval)
  }, [autoplay, currentIndex])

  if (posts.length === 0) {
    return (
      <section className="py-12">
        <div className="container">
          <h2 className="text-3xl font-bold text-primary-navy text-center">Latest News</h2>
          <div className="mt-8 text-center">Loading news...</div>
        </div>
      </section>
    )
  }

  // Render a single post card
  const renderPostCard = (post: WordPressPost) => {
    const imageUrl = getFeaturedImageUrl(post)
    const postSlug = post.slug || `${post.id}`

    return (
      <Card key={post.id} className="flex h-full flex-col overflow-hidden">
        <Link href={`/${postSlug}`} className="relative w-full transition-opacity hover:opacity-90">
          {/* Replace the existing image container with this: */}
          <div className="relative w-full pt-[52.5%] card-image-hover">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={post.title.rendered}
              fill
              className="object-cover transition-all duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </Link>
        <CardHeader>
          <Link href={`/${postSlug}`} className="hover:text-secondary-red transition-colors">
            <CardTitle
              className="line-clamp-2 text-lg text-primary-navy"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
          </Link>
          <CardDescription>{formatWordPressDate(post.date)}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="line-clamp-3 text-sm">{stripHtmlTags(post.excerpt.rendered)}</p>
        </CardContent>
        <CardFooter>
          <Link href={`/${postSlug}`}>
            <Button className="bg-secondary-red hover:bg-secondary-red/90">Read More</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <section className="py-12">
      <div className="container">
        <div className="mb-8 flex items-center justify-center">
          <h2 className="text-3xl font-bold text-primary-navy">Latest News</h2>
          <div className="hidden md:flex gap-2 absolute right-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full" aria-label="Next slide">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile view - stacked cards */}
        <div className="md:hidden space-y-6">{limitedPosts.slice(0, 3).map(renderPostCard)}</div>

        {/* Desktop view - carousel */}
        <div className="relative hidden md:block overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {postGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">{group.map(renderPostCard)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 hidden md:flex justify-center gap-2">
          {postGroups.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                setAutoplay(false)
              }}
              className={cn("h-2 w-8 rounded-full", index === currentIndex ? "bg-secondary-red" : "bg-gray-300")}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Add this line to ensure both named and default exports are available
export default NewsCarousel
