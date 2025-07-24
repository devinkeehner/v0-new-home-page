// Update to remove caching for WordPress posts to improve load times
import { getCachedData } from "@/lib/upstash-kv"

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

    const cacheKey = `flickr-images:${count}:${TAG}`

    return await getCachedData(
      cacheKey,
      async () => {
        const res = await fetch(
          `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&user_id=${USER_ID}&tags=${TAG}&extras=date_taken,date_upload,owner_name,views,description&per_page=${count}&format=json&nojsoncallback=1`,
          { next: { revalidate: 3600 } },
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
          const base = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}`

          return {
            id: photo.id,
            title: photo.title || "Connecticut House Republicans",
            server: photo.server,
            secret: photo.secret,
            farm: photo.farm,
            thumbnail: `${base}_q.jpg`,
            medium: `${base}.jpg`,
            large: `${base}_b.jpg`,
            original: `${base}_o.jpg`,
            datetaken: photo.datetaken,
            dateupload: photo.dateupload,
            ownername: photo.ownername,
            views: photo.views,
            description: photo.description,
          }
        })
      },
      3600, // 1 hour cache
    )
  } catch (error) {
    console.error("Error fetching Flickr images:", error)
    return []
  }
}

function extractJsonFromMixedResponse(text: string): any {
  try {
    return JSON.parse(text)
  } catch (e) {
    try {
      const jsonStartIndex = text.indexOf("[")
      if (jsonStartIndex >= 0) {
        const jsonText = text.substring(jsonStartIndex)
        return JSON.parse(jsonText)
      }

      const objectStartIndex = text.indexOf("{")
      if (objectStartIndex >= 0) {
        const jsonText = text.substring(objectStartIndex)
        return JSON.parse(jsonText)
      }
    } catch (innerError) {
      console.error("Failed to extract JSON from mixed response:", innerError)
    }

    throw new Error(`Failed to parse response as JSON: ${text.substring(0, 200)}...`)
  }
}

async function fetchWordPressPosts(page = 1, perPage = 20, searchQuery = "", retryCount = 0) {
  const MAX_RETRIES = 2

  let apiUrl = `https://www.cthousegop.com/wp-json/wp/v2/posts?status=publish&page=${page}&per_page=${perPage}&orderby=date&order=desc&_embed`

  if (searchQuery) {
    apiUrl += `&search=${encodeURIComponent(searchQuery)}`
  }

  console.log(`Fetching WordPress posts from: ${apiUrl}`)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // Reduced timeout to 10 seconds

  try {
    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "CT House Republicans Website",
      },
      // Remove caching to improve load times
      cache: "no-store",
      next: { revalidate: 0 },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error(`Failed to fetch posts: ${response.status} ${response.statusText}`)
      throw new Error(`Failed to fetch posts: ${response.status}`)
    }

    const totalPages = Number.parseInt(response.headers.get("X-WP-TotalPages") || "1", 10)
    const totalPosts = Number.parseInt(response.headers.get("X-WP-Total") || "0", 10)

    const responseText = await response.text()

    try {
      const posts = extractJsonFromMixedResponse(responseText)

      posts.forEach((post) => {
        if (post.link && post.link.includes("cthousegop.com")) {
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

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying fetch (attempt ${retryCount + 1}/${MAX_RETRIES})`)
      await new Promise((resolve) => setTimeout(resolve, 500 * (retryCount + 1))) // Reduced retry delay
      return fetchWordPressPosts(page, perPage, searchQuery, retryCount + 1)
    }

    throw fetchError
  }
}

// Remove caching from WordPress posts to improve load times
export async function getWordPressPosts(page = 1, perPage = 20, searchQuery = "", forceRefresh = false) {
  try {
    console.log(
      `Fetching WordPress posts directly (no cache) - page: ${page}, perPage: ${perPage}, search: ${searchQuery}`,
    )
    return await fetchWordPressPosts(page, perPage, searchQuery)
  } catch (error) {
    console.error("Error in getWordPressPosts:", error)
    return {
      posts: [],
      totalPages: 0,
      totalPosts: 0,
    }
  }
}

export function formatWordPressDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function stripHtmlTags(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, "")
}

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
