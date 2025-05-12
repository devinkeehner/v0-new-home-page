import { NextResponse } from "next/server"
import { getCachedData } from "@/lib/kv"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {
    // Create a cache key based on the URL
    const cacheKey = `proxy:${url}`

    // Use the caching utility with a 5-minute TTL
    const html = await getCachedData(
      cacheKey,
      async () => {
        console.log(`Cache miss for ${url}, fetching fresh content`)
        const response = await fetch(url, {
          headers: {
            Accept: "text/html,application/xhtml+xml,application/xml",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
        }

        return await response.text()
      },
      300, // 5 minutes cache
    )

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    })
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
