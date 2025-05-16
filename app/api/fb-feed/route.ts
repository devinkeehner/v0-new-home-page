import { NextResponse } from "next/server"

const token = process.env.fb_page_token // Keep it in Vercel env vars
const page = "cthousegop" // Facebook page ID or username

const fields = [
  "id",
  "message",
  "permalink_url",
  "created_time",
  "full_picture",
  "attachments{media_type,media_url,type,url}",
].join(",")

export const revalidate = 300 // ISR – rebuild at most every 5 min

export async function GET() {
  try {
    const r = await fetch(
      `https://graph.facebook.com/v18.0/${page}/posts` + `?fields=${fields}&limit=25&access_token=${token}`,
    )

    if (!r.ok) {
      console.error("Facebook API error:", await r.text())
      return NextResponse.json({ error: "Facebook fetch failed" }, { status: 500 })
    }

    return new NextResponse(await r.text(), {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
    })
  } catch (error) {
    console.error("Error fetching Facebook posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
