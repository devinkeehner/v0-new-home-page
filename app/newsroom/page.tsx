import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { fallbackPosts, formatWordPressDate, stripHtmlTags, getFeaturedImageUrl } from "@/lib/api"

async function getPosts() {
  try {
    const response = await fetch("https://www.cthousegop.com/wp-json/wp/v2/posts?_embed&per_page=12", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`)
    }

    const posts = await response.json()
    return posts
  } catch (error) {
    console.error("Error fetching posts:", error)
    return fallbackPosts
  }
}

export default async function NewsroomPage() {
  const posts = await getPosts()

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold text-primary-navy">Newsroom</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Stay up to date with the latest news, press releases, and updates from the Connecticut House Republicans.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => {
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
                  <h2
                    className="mb-2 text-xl font-bold text-secondary-red hover:underline"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                </Link>
                <p className="mb-2 text-sm text-gray-600">Posted on {formatWordPressDate(post.date)}</p>
                <p className="mb-4 text-gray-700 line-clamp-3">{stripHtmlTags(post.excerpt.rendered)}</p>
                <Button asChild className="bg-secondary-red hover:bg-secondary-red/90">
                  <Link href={`/${post.slug}`}>Read More</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
