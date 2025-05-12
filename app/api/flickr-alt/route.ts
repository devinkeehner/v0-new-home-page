import { NextResponse } from "next/server"
import { getCachedData } from "@/lib/kv"

// Flickr API credentials
const FLICKR_API_KEY = process.env.flick_key || "73b5dd919d6a510e2a2326f637b8aa21"
const FLICKR_USER_ID = process.env.flick_ID || "67565175@N02"
const FLICKR_TAG = process.env.flick_tag || "HRO"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tag = searchParams.get("tag") || FLICKR_TAG
  const perPage = searchParams.get("per_page") || "20"

  try {
    // Create a cache key based on the request parameters
    const cacheKey = `flickr-alt:${tag}:${perPage}`

    // Use the caching utility
    const data = await getCachedData(
      cacheKey,
      async () => {
        // This function only runs on cache miss
        const apiUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&user_id=${FLICKR_USER_ID}&tags=${tag}&tag_mode=any&per_page=${perPage}&format=json&nojsoncallback=1&extras=url_sq,url_t,url_s,url_m,url_o,date_taken,owner_name,views,description`

        console.log(`Fetching from Flickr API: ${apiUrl.replace(FLICKR_API_KEY, "API_KEY_HIDDEN")}`)

        const response = await fetch(apiUrl)

        if (!response.ok) {
          throw new Error(`Flickr API error: ${response.status} ${response.statusText}`)
        }

        return await response.json()
      },
      300, // 5 minutes cache
    )

    // Validate the response structure
    if (!data || data.stat !== "ok" || !data.photos || !Array.isArray(data.photos.photo)) {
      console.error("Unexpected Flickr API response structure:", JSON.stringify(data).substring(0, 500))
      throw new Error("Unexpected response format from Flickr API")
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    })
  } catch (error) {
    console.error("Error fetching from alternative Flickr API:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
