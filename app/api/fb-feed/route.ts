import { NextResponse } from "next/server"

const token = process.env.fb_page_token // Keep it in Vercel env vars
const page = "cthousegop" // Facebook page ID or username

const fields = [
  "id",
  "message",
  "permalink_url",
  "created_time",
  "full_picture",
  "attachments{media_type,media_url,type,url,target}",
].join(",")

export const revalidate = 300 // ISR – rebuild at most every 5 min

export async function GET() {
  try {
    // Check if token exists
    if (!token) {
      console.log("Facebook token not found")
      return NextResponse.json(
        {
          error: "Facebook token not configured",
          data: [], // Use 'data' key to match expected format
        },
        { status: 200 },
      )
    }

    console.log("Fetching Facebook posts with token:", token ? "Token exists" : "No token found")

    const apiUrl = `https://graph.facebook.com/v18.0/${page}/posts?fields=${fields}&limit=25&access_token=${token}`
    console.log("Facebook API URL:", apiUrl.replace(token || "", "[REDACTED]"))

    const r = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; CTHouseGOP/1.0)",
      },
    })

    if (!r.ok) {
      const errorText = await r.text()
      console.error("Facebook API error:", errorText)

      // Parse the error to check if it's a token issue
      try {
        const errorData = JSON.parse(errorText)
        if (
          errorData.error &&
          (errorData.error.code === 190 || // Invalid token
            errorData.error.code === 102 || // Session expired
            errorData.error.code === 463 || // Token expired subcode
            errorData.error.type === "OAuthException")
        ) {
          console.log("Facebook token expired or invalid, returning empty feed")
          return NextResponse.json(
            {
              error: "Facebook token expired",
              data: [], // Return empty data array
              message: "Facebook feed temporarily unavailable - token needs refresh",
              tokenExpired: true,
            },
            { status: 200 },
          )
        }
      } catch (parseError) {
        console.error("Error parsing Facebook API error:", parseError)
      }

      // For other errors, still return empty posts instead of failing
      return NextResponse.json(
        {
          error: "Facebook API unavailable",
          data: [], // Return empty data array
          message: "Facebook feed temporarily unavailable",
        },
        { status: 200 },
      )
    }

    const data = await r.text()
    console.log("Facebook API response received, length:", data.length)

    // Validate the response is valid JSON
    try {
      const jsonData = JSON.parse(data)
      if (!jsonData.data) {
        console.log("No posts data in Facebook response")
        return NextResponse.json(
          {
            data: [], // Return empty data array
            message: "No posts available",
          },
          { status: 200 },
        )
      }

      // Return the parsed data directly
      return NextResponse.json(jsonData, {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        },
      })
    } catch (parseError) {
      console.error("Error parsing Facebook response:", parseError)
      return NextResponse.json(
        {
          error: "Invalid Facebook response",
          data: [], // Return empty data array
        },
        { status: 200 },
      )
    }
  } catch (error) {
    console.error("Error fetching Facebook posts:", error)
    // Always return a successful response with empty posts to prevent page crashes
    return NextResponse.json(
      {
        error: "Internal server error",
        data: [], // Return empty data array
        message: "Facebook feed temporarily unavailable",
      },
      { status: 200 },
    )
  }
}
