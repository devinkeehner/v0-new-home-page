import { NextResponse } from "next/server"
import { setCache, getFromCache } from "@/lib/upstash-kv"

export async function GET() {
  try {
    const testKey = "test-connection"
    const testValue = { message: "Redis is working!", timestamp: Date.now() }

    // Try to set a test value
    await setCache(testKey, testValue, 60) // 1 minute TTL

    // Try to get it back
    const retrieved = await getFromCache(testKey)

    return NextResponse.json({
      success: true,
      message: "Redis connection test successful",
      testValue,
      retrieved,
      match: JSON.stringify(testValue) === JSON.stringify(retrieved),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Redis connection test failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
