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
  } catch (error) {
    console.error("Error fetching Flickr images:", error)
    return []
  }
}
