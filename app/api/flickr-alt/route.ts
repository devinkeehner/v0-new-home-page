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

    // Use the caching utility with a longer timeout
    const data = await getCachedData(
      cacheKey,
      async () => {
        // This function only runs on cache miss
        const apiUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&user_id=${FLICKR_USER_ID}&tags=${tag}&tag_mode=any&per_page=${perPage}&format=json&nojsoncallback=1&extras=url_sq,url_t,url_s,url_m,url_o,date_taken,owner_name,views,description`

        console.log(`Fetching from Flickr API: ${apiUrl.replace(FLICKR_API_KEY, "API_KEY_HIDDEN")}`)

        // Add timeout and retry logic
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        try {
          const response = await fetch(apiUrl, {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
              "User-Agent": "CT House Republicans Website",
            },
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            console.error(`Flickr API HTTP error: ${response.status} ${response.statusText}`)
            throw new Error(`Flickr API error: ${response.status} ${response.statusText}`)
          }

          const jsonData = await response.json()

          // Log the response for debugging
          console.log("Flickr API response:", JSON.stringify(jsonData).substring(0, 200) + "...")

          return jsonData
        } catch (fetchError) {
          clearTimeout(timeoutId)
          throw fetchError
        }
      },
      600, // 10 minutes cache - increased to reduce API calls
    )

    // More lenient validation with fallback
    if (!data) {
      console.error("Empty response from Flickr API")
      return NextResponse.json(
        {
          stat: "ok",
          photos: { photo: [] },
        },
        { status: 200 },
      )
    }

    // If we get an error response from Flickr, log it but don't throw
    if (data.stat !== "ok") {
      console.error("Flickr API returned error:", data)
      return NextResponse.json(
        {
          stat: "ok",
          photos: { photo: [] },
          originalError: data,
        },
        { status: 200 },
      )
    }

    // If photos structure is missing, create an empty one
    if (!data.photos || !Array.isArray(data.photos.photo)) {
      console.error("Unexpected Flickr API response structure:", JSON.stringify(data).substring(0, 500))
      data.photos = { photo: [] }
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    })
  } catch (error) {
    console.error("Error fetching from alternative Flickr API:", error)

    // Return a valid but empty response instead of an error
    return NextResponse.json(
      {
        stat: "ok",
        photos: { photo: [] },
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    )
  }
}
