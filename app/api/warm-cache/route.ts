import { triggerCacheWarming } from "@/lib/cache-warming"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const result = await triggerCacheWarming()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to warm cache" }, { status: 500 })
  }
}

export async function GET() {
  // Allow GET requests too for easy testing
  return POST()
}
