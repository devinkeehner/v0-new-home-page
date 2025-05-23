import { NextResponse } from "next/server"
import { fetchFlickrImages } from "@/lib/flickr"
import { getCachedData } from "@/lib/kv"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tag = searchParams.get("tag") || "HRO"
  const perPage = Number.parseInt(searchParams.get("per_page") || "20", 10)

  try {
    // Use the caching utility with a 5-minute TTL
    const cacheKey = `flickr:${tag}:${perPage}`
    const photos = await getCachedData(
      cacheKey,
      () => fetchFlickrImages(perPage),
      300, // 5 minutes cache
    )

    return NextResponse.json(
      { photos, status: "success" },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    )
  } catch (error) {
    console.error("Error in Flickr API route:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        status: "error",
      },
      { status: 500 },
    )
  }
}
