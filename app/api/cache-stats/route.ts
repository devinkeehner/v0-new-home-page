import { getCacheStats } from "@/lib/upstash-kv"
import { NextResponse } from "next/server"

export async function GET() {
  const stats = getCacheStats()
  return NextResponse.json(stats)
}
