import { getCachedData } from "@/lib/kv"

// Pre-cache popular/recent posts
export async function warmCache() {
  try {
    console.log("Starting cache warming...")

    // Warm the main posts cache
    await getCachedData(
      "wordpress:posts:recent",
      async () => {
        console.log("Warming main posts cache...")
        const response = await fetch(
          "https://www.cthousegop.com/wp-json/wp/v2/posts?status=publish&per_page=20&orderby=date&order=desc&_embed",
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          },
        )

        if (!response.ok) {
          throw new Error(`Failed to warm cache: ${response.status}`)
        }

        const posts = await response.json()
        console.log(`Warmed cache with ${posts.length} posts`)
        return { posts, totalPages: 1, totalPosts: posts.length }
      },
      3600, // 1 hour
    )

    // Pre-cache individual posts by slug
    const slugsToCache = [
      // Add specific post slugs that are frequently accessed
      "budget-priorities-2024",
      "tax-relief-initiatives",
      "legislative-updates",
      // Add more popular post slugs here
    ]

    for (const slug of slugsToCache) {
      try {
        await getCachedData(
          `wordpress:post:${slug}`,
          async () => {
            console.log(`Warming cache for post: ${slug}`)
            const response = await fetch(`https://www.cthousegop.com/wp-json/wp/v2/posts?slug=${slug}&_embed`, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            })

            if (!response.ok) {
              throw new Error(`Failed to cache post ${slug}: ${response.status}`)
            }

            const posts = await response.json()
            return posts.length > 0 ? posts[0] : null
          },
          3600, // 1 hour
        )
      } catch (error) {
        console.error(`Failed to warm cache for ${slug}:`, error)
      }
    }

    console.log("Cache warming completed")
  } catch (error) {
    console.error("Cache warming failed:", error)
  }
}

// API route to trigger cache warming
export async function triggerCacheWarming() {
  try {
    // Run cache warming in background
    warmCache().catch(console.error)
    return { success: true, message: "Cache warming started" }
  } catch (error) {
    console.error("Failed to trigger cache warming:", error)
    return { success: false, error: error.message }
  }
}
