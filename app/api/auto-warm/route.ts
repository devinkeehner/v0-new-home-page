import { warmCache } from "@/lib/cache-warming"
import { NextResponse } from "next/server"

// This endpoint can be called by a cron job or webhook
export async function GET() {
  try {
    console.log("Auto-warming cache...")
    await warmCache()
    return NextResponse.json({ success: true, message: "Cache warmed successfully" })
  } catch (error) {
    console.error("Auto-warm failed:", error)
    return NextResponse.json({ success: false, error: "Cache warming failed" }, { status: 500 })
  }
}
