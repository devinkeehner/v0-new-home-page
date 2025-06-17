// Add this import at the top
import { getCachedData } from "@/lib/kv"

// Flickr API credentials
const API_KEY = process.env.flick_key || "73b5dd919d6a510e2a2326f637b8aa21"
const USER_ID = process.env.flick_ID || "67565175@N02"
const TAG = process.env.flick_tag || "HRO"

export interface FlickrPhoto {
  id: string
  title: string
  server: string
  secret: string
  farm: number
  thumbnail: string
  medium: string
  large: string
  original: string
  datetaken?: string
  dateupload?: string
  ownername?: string
  views?: string
  description?: { _content?: string }
}

export async function fetchFlickrImages(count = 20): Promise<FlickrPhoto[]> {
  try {
    console.log(`Fetching ${count} Flickr images with tag: ${TAG}`)

    // Create a cache key based on the count
    const cacheKey = `flickr-images:${count}:${TAG}`

    return await getCachedData(
      cacheKey,
      async () => {
        const res = await fetch(
          `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&user_id=${USER_ID}&tags=${TAG}&extras=date_taken,date_upload,owner_name,views,description&per_page=${count}&format=json&nojsoncallback=1`,
          { next: { revalidate: 3600 } }, // Cache for 1 hour
        )

        if (!res.ok) {
          throw new Error(`Flickr API error: ${res.status} ${res.statusText}`)
        }

        const data = await res.json()

        if (data.stat !== "ok" || !data.photos || !Array.isArray(data.photos.photo)) {
          console.error("Unexpected Flickr API response:", JSON.stringify(data).substring(0, 500))
          throw new Error("Invalid response from Flickr API")
        }

        return data.photos.photo.map((photo: any) => {
          // Construct image URLs using the Flickr URL pattern
          const base = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}`

          return {
            id: photo.id,
            title: photo.title || "Connecticut House Republicans",
            server: photo.server,
            secret: photo.secret,
            farm: photo.farm,
            thumbnail: `${base}_q.jpg`, // 150x150 square thumbnail
            medium: `${base}.jpg`, // 500px on longest side
            large: `${base}_b.jpg`, // 1024px on longest side
            original: `${base}_o.jpg`, // Original image
            datetaken: photo.datetaken,
            dateupload: photo.dateupload,
            ownername: photo.ownername,
            views: photo.views,
            description: photo.description,
          }
        })
      },
      1800, // 30 minutes cache
    )
  } catch (error) {
    console.error("Error fetching Flickr images:", error)
    return []
  }
}

/**
 * Extracts JSON from a mixed HTML/JSON response
 * This handles the case where the WordPress API returns HTML before the JSON data
 */
function extractJsonFromMixedResponse(text: string): any {
  try {
    // First try to parse as is - maybe it's valid JSON
    return JSON.parse(text)
  } catch (e) {
    // If that fails, try to find JSON in the text
    try {
      // Look for the first '[' character which likely indicates the start of JSON array
      const jsonStartIndex = text.indexOf("[")
      if (jsonStartIndex >= 0) {
        const jsonText = text.substring(jsonStartIndex)
        return JSON.parse(jsonText)
      }

      // If no array found, look for object start
      const objectStartIndex = text.indexOf("{")
      if (objectStartIndex >= 0) {
        const jsonText = text.substring(objectStartIndex)
        return JSON.parse(jsonText)
      }
    } catch (innerError) {
      console.error("Failed to extract JSON from mixed response:", innerError)
    }

    // If all parsing attempts fail, throw the original error
    throw new Error(`Failed to parse response as JSON: ${text.substring(0, 200)}...`)
  }
}

// Function to fetch posts directly from WordPress API
async function fetchWordPressPosts(page = 1, perPage = 20, searchQuery = "") {
  // Use the WordPress API directly
  let apiUrl = `https://www.cthousegop.com/wp-json/wp/v2/posts?status=publish&page=${page}&per_page=${perPage}&orderby=date&order=desc&_embed`

  // Add search parameter if provided
  if (searchQuery) {
    apiUrl += `&search=${encodeURIComponent(searchQuery)}`
  }

  console.log(`Fetching WordPress posts from: ${apiUrl}`)

  // Add timeout to prevent hanging requests
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

  try {
    // Use a more robust fetch with proper headers and cache control
    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "CT House Republicans Website",
      },
      cache: "no-store", // Don't cache the response to avoid stale data
      next: { revalidate: 0 }, // Disable revalidation for now
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error(`Failed to fetch posts: ${response.status} ${response.statusText}`)
      throw new Error(`Failed to fetch posts: ${response.status}`)
    }

    // Get total pages from headers
    const totalPages = Number.parseInt(response.headers.get("X-WP-TotalPages") || "1", 10)
    const totalPosts = Number.parseInt(response.headers.get("X-WP-Total") || "0", 10)

    // Get the response text instead of directly parsing as JSON
    const responseText = await response.text()

    // Try to extract JSON from the potentially mixed response
    try {
      const posts = extractJsonFromMixedResponse(responseText)

      // Update post links to use main.cthousegop.com
      posts.forEach((post) => {
        if (post.link && post.link.includes("cthousegop.com")) {
          // Extract the slug from the original link
          const urlParts = post.link.split("/")
          const slug = urlParts[urlParts.length - 2] || post.slug || `post-${post.id}`
          post.link = `https://main.cthousegop.com/${slug}`
        }
      })

      return {
        posts,
        totalPages,
        totalPosts,
      }
    } catch (parseError) {
      console.error("Error parsing WordPress response:", parseError)
      console.log("Response preview:", responseText.substring(0, 500))
      throw parseError
    }
  } catch (fetchError) {
    clearTimeout(timeoutId)
    console.error("Fetch error:", fetchError)
    throw fetchError
  }
}

// Main function to get WordPress posts with caching
export async function getWordPressPosts(page = 1, perPage = 20, searchQuery = "", forceRefresh = false) {
  try {
    // For backward compatibility with existing code
    if (page === 1 && perPage === 20 && !searchQuery) {
      // Use caching for WordPress posts
      const cacheKey = `wordpress:posts:recent`

      return await getCachedData(
        cacheKey,
        async () => {
          // This function only runs on cache miss
          console.log(`Cache miss for WordPress posts, fetching fresh data`)

          const result = await fetchWordPressPosts(1, 20)
          return result
        },
        1800, // 30 minutes cache
        forceRefresh,
      )
    }

    // For pagination and search
    // Create a cache key that includes pagination and search parameters
    const cacheKey = searchQuery
      ? `wordpress:posts:search:${searchQuery}:page:${page}:per:${perPage}`
      : `wordpress:posts:page:${page}:per:${perPage}`

    // Use caching with fallback to direct API
    return await getCachedData(
      cacheKey,
      () => fetchWordPressPosts(page, perPage, searchQuery),
      1800, // 30 minutes cache
      forceRefresh,
    )
  } catch (error) {
    console.error("Error in getWordPressPosts:", error)

    // If caching fails, try direct API as a last resort
    try {
      return await fetchWordPressPosts(page, perPage, searchQuery)
    } catch (directError) {
      console.error("Direct API call also failed:", directError)
      // Return empty result with pagination info
      return {
        posts: [],
        totalPages: 0,
        totalPosts: 0,
      }
    }
  }
}

// Format WordPress date to a more readable format
export function formatWordPressDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Strip HTML tags from a string
export function stripHtmlTags(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, "")
}

// Get the featured image URL from a WordPress post
export function getFeaturedImageUrl(post: any): string | null {
  if (
    post._embedded &&
    post._embedded["wp:featuredmedia"] &&
    post._embedded["wp:featuredmedia"][0] &&
    post._embedded["wp:featuredmedia"][0].source_url
  ) {
    return post._embedded["wp:featuredmedia"][0].source_url
  }
  return null
}

export const fallbackPosts = []
