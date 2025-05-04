import { NextResponse } from "next/server"
import { fetchFlickrImages } from "@/lib/flickr"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tag = searchParams.get("tag") || "HRO"
  const perPage = Number.parseInt(searchParams.get("per_page") || "20", 10)

  try {
    const photos = await fetchFlickrImages(perPage)

    return NextResponse.json(
      { photos, status: "success" },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
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
