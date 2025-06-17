import { getBuildTimePosts, preCachePosts } from "@/lib/build-cache"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Starting build-time cache warming...")

    // Fetch the first 12 posts
    const posts = await getBuildTimePosts()

    if (posts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No posts found to cache",
        },
        { status: 404 },
      )
    }

    // Pre-cache them
    await preCachePosts(posts)

    return NextResponse.json({
      success: true,
      message: `Successfully cached ${posts.length} posts`,
      cachedPosts: posts.map((p) => ({ slug: p.slug, title: p.title.rendered })),
    })
  } catch (error) {
    console.error("Build cache failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to cache posts during build",
      },
      { status: 500 },
    )
  }
}
