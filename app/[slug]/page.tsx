import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Suspense } from "react"
import { fallbackPosts, formatWordPressDate, stripHtmlTags, getFeaturedImageUrl } from "@/lib/api"
import "./post.css"

// Function to fetch a single post by slug with priority
async function getPostBySlug(slug: string) {
  try {
    console.log(`Priority fetch for post: ${slug}`)

    const response = await fetch(`https://www.cthousegop.com/wp-json/wp/v2/posts?slug=${slug}&_embed`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
      // Add priority hint
      priority: "high" as any,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`)
    }

    const posts = await response.json()
    return posts && posts.length > 0 ? posts[0] : null
  } catch (error) {
    console.error("Error fetching post:", error)
    return null
  }
}

// Function to fetch recent posts (lower priority)
async function getRecentPosts(excludeId: number) {
  try {
    console.log(`Secondary fetch for recent posts (excluding ${excludeId})`)

    // Add a small delay to deprioritize this request
    await new Promise((resolve) => setTimeout(resolve, 100))

    const response = await fetch(
      `https://www.cthousegop.com/wp-json/wp/v2/posts?per_page=2&exclude=${excludeId}&_embed`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "no-store",
        // Lower priority
        priority: "low" as any,
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch recent posts: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching recent posts:", error)
    return fallbackPosts.slice(0, 2)
  }
}

// Sidebar component that loads separately
function RecentPostsSidebar({ excludeId }: { excludeId: number }) {
  return (
    <Suspense
      fallback={
        <div className="rounded-lg border p-6">
          <h2 className="mb-6 text-2xl font-bold text-primary-navy">Latest Posts</h2>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="relative w-full pt-[52.5%] bg-gray-200 animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      }
    >
      <RecentPostsContent excludeId={excludeId} />
    </Suspense>
  )
}

async function RecentPostsContent({ excludeId }: { excludeId: number }) {
  const recentPosts = await getRecentPosts(excludeId)

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-6 text-2xl font-bold text-primary-navy">Latest Posts</h2>
      <div className="space-y-6">
        {recentPosts.map((recentPost: any) => {
          const recentPostImageUrl = getFeaturedImageUrl(recentPost)
          const recentPostSlug = recentPost.slug || `${recentPost.id}`

          return (
            <Card key={recentPost.id} className="overflow-hidden">
              {recentPostImageUrl && (
                <div className="relative w-full pt-[52.5%] card-image-hover">
                  <Image
                    src={recentPostImageUrl || "/placeholder.svg"}
                    alt={recentPost.title.rendered}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <Link href={`/${recentPostSlug}`}>
                  <h3
                    className="mb-2 text-lg font-bold text-secondary-red hover:underline"
                    dangerouslySetInnerHTML={{ __html: recentPost.title.rendered }}
                  />
                </Link>
                <p className="mb-2 text-sm text-gray-600">Posted on {formatWordPressDate(recentPost.date)}</p>
                <p className="mb-4 text-sm text-gray-700 line-clamp-2">{stripHtmlTags(recentPost.excerpt.rendered)}</p>
                <Button asChild className="bg-secondary-red hover:bg-secondary-red/90" size="sm">
                  <Link href={`/${recentPostSlug}`}>Read More</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  // Priority: Get the main post first
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const featuredImageUrl = getFeaturedImageUrl(post)
  const heightClass = "pt-[52.5%]" // (630/1200)*100 = 52.5%

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content - 2/3 width on large screens - PRIORITY */}
        <div className="lg:col-span-2">
          {/* Featured Image */}
          {featuredImageUrl && (
            <div className={`relative mb-6 w-full ${heightClass} overflow-hidden hover-zoom-container`}>
              <Image
                src={featuredImageUrl || "/placeholder.svg"}
                alt={post.title.rendered}
                fill
                className="object-cover hover-zoom"
                priority
              />
            </div>
          )}

          {/* Title */}
          <h1
            className="mb-2 text-3xl font-bold text-secondary-red"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {/* Date */}
          <div className="mb-4 flex items-center text-gray-600">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Posted on {formatWordPressDate(post.date)}</span>
          </div>

          <Separator className="mb-6" />

          {/* Post Content */}
          <div
            className="wp-content prose max-w-none prose-headings:text-primary-navy prose-a:text-secondary-red"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="mt-8">
              <span className="font-semibold">Categories: </span>
              {post._embedded &&
                post._embedded["wp:term"] &&
                post._embedded["wp:term"][0] &&
                post._embedded["wp:term"][0].map((category: any, index: number) => (
                  <span key={category.id}>
                    {category.name}
                    {index < post._embedded["wp:term"][0].length - 1 ? ", " : ""}
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* Sidebar - 1/3 width on large screens - SECONDARY */}
        <div className="lg:col-span-1">
          <RecentPostsSidebar excludeId={post.id} />
        </div>
      </div>
    </div>
  )
}
