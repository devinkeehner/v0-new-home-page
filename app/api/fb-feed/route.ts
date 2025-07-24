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
    console.log("Fetching Facebook posts with token:", token ? "Token exists" : "No token found")

    const apiUrl = `https://graph.facebook.com/v18.0/${page}/posts?fields=${fields}&limit=25&access_token=${token}`
    console.log("Facebook API URL:", apiUrl.replace(token || "", "[REDACTED]"))

    const r = await fetch(apiUrl)

    if (!r.ok) {
      const errorText = await r.text()
      console.error("Facebook API error:", errorText)
      return NextResponse.json({ error: "Facebook fetch failed", details: errorText }, { status: 500 })
    }

    const data = await r.text()
    console.log("Facebook API response received, length:", data.length)

    return new NextResponse(data, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        // Add no-cache header to force revalidation
        Pragma: "no-cache",
      },
    })
  } catch (error) {
    console.error("Error fetching Facebook posts:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}
