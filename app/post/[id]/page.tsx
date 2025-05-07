import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Linkedin, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { fallbackPosts, formatWordPressDate, stripHtmlTags, getFeaturedImageUrl } from "@/lib/api"

// Function to fetch a single post by ID
async function getPostById(id: string) {
  try {
    const response = await fetch(`https://www.cthousegop.com/wp-json/wp/v2/posts/${id}?_embed`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`)
    }

    const post = await response.json()
    return post
  } catch (error) {
    console.error("Error fetching post:", error)
    return null
  }
}

// Function to fetch recent posts for the sidebar
async function getRecentPosts(excludeId: string) {
  try {
    const response = await fetch(
      `https://www.cthousegop.com/wp-json/wp/v2/posts?per_page=2&exclude=${excludeId}&_embed`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "no-store",
        next: { revalidate: 0 },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch recent posts: ${response.status}`)
    }

    const posts = await response.json()
    return posts
  } catch (error) {
    console.error("Error fetching recent posts:", error)
    return fallbackPosts.slice(0, 2)
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id)

  if (!post) {
    notFound()
  }

  const recentPosts = await getRecentPosts(params.id)
  const featuredImageUrl = getFeaturedImageUrl(post)

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content - 2/3 width on large screens */}
        <div className="lg:col-span-2">
          {/* Featured Image */}
          {featuredImageUrl && (
            <div className="relative mb-6 h-[400px] w-full overflow-hidden">
              <Image
                src={featuredImageUrl || "/placeholder.svg"}
                alt={post.title.rendered}
                fill
                className="object-cover"
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

          {/* Social Share Buttons */}
          <div className="mb-6 flex space-x-2">
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=https://main.cthousegop.com/post/${params.id}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <a
                href={`https://twitter.com/intent/tweet?url=https://main.cthousegop.com/post/${params.id}&text=${encodeURIComponent(post.title.rendered)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=https://main.cthousegop.com/post/${params.id}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <a
                href={`mailto:?subject=${encodeURIComponent(post.title.rendered)}&body=https://main.cthousegop.com/post/${params.id}`}
                aria-label="Share via Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <Separator className="mb-6" />

          {/* Post Content */}
          <div
            className="prose max-w-none prose-headings:text-primary-navy prose-a:text-secondary-red"
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

        {/* Sidebar - 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border p-6">
            <h2 className="mb-6 text-2xl font-bold text-primary-navy">Latest Posts</h2>

            <div className="space-y-6">
              {recentPosts.map((recentPost: any) => {
                const recentPostImageUrl = getFeaturedImageUrl(recentPost)

                return (
                  <Card key={recentPost.id} className="overflow-hidden">
                    {recentPostImageUrl && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={recentPostImageUrl || "/placeholder.svg"}
                          alt={recentPost.title.rendered}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <Link href={`/post/${recentPost.id}`}>
                        <h3
                          className="mb-2 text-lg font-bold text-secondary-red hover:underline"
                          dangerouslySetInnerHTML={{ __html: recentPost.title.rendered }}
                        />
                      </Link>
                      <p className="mb-2 text-sm text-gray-600">Posted on {formatWordPressDate(recentPost.date)}</p>
                      <p className="mb-4 text-sm text-gray-700 line-clamp-2">
                        {stripHtmlTags(recentPost.excerpt.rendered)}
                      </p>
                      <Button asChild className="bg-secondary-red hover:bg-secondary-red/90" size="sm">
                        <Link href={`/post/${recentPost.id}`}>Read More</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
