import { getCachedData } from "@/lib/kv"

export interface WordPressPost {
  id: number
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  date: string
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string
      alt_text: string
    }>
  }
}

// Get posts for build-time caching
export async function getBuildTimePosts(): Promise<WordPressPost[]> {
  try {
    console.log("Fetching posts for build-time caching...")

    const response = await fetch(
      "https://www.cthousegop.com/wp-json/wp/v2/posts?status=publish&per_page=12&orderby=date&order=desc&_embed",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // Don't cache during build to get fresh data
        cache: "no-store",
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`)
    }

    const posts = await response.json()
    console.log(`Fetched ${posts.length} posts for build-time caching`)

    return posts
  } catch (error) {
    console.error("Failed to fetch build-time posts:", error)
    return []
  }
}

// Pre-cache posts during build
export async function preCachePosts(posts: WordPressPost[]) {
  console.log(`Pre-caching ${posts.length} posts...`)

  for (const post of posts) {
    try {
      // Cache individual post
      await getCachedData(
        `wordpress:post:${post.slug}`,
        async () => post,
        7200, // 2 hours cache
      )

      console.log(`Cached post: ${post.slug}`)
    } catch (error) {
      console.error(`Failed to cache post ${post.slug}:`, error)
    }
  }

  // Cache the posts list
  try {
    await getCachedData(
      "wordpress:posts:recent",
      async () => ({
        posts,
        totalPages: 1,
        totalPosts: posts.length,
      }),
      7200, // 2 hours cache
    )
    console.log("Cached recent posts list")
  } catch (error) {
    console.error("Failed to cache posts list:", error)
  }
}
