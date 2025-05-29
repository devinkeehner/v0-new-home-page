import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get total signatures count
    const { count: totalSignatures, error: totalError } = await supabase
      .from("petition_signatures")
      .select("*", { count: "exact", head: true })

    if (totalError) {
      console.error("Error getting total count:", totalError)
      return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
    }

    // Get today's signatures
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: todaySignatures, error: todayError } = await supabase
      .from("petition_signatures")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString())

    if (todayError) {
      console.error("Error getting today's count:", todayError)
    }

    // Get this week's signatures
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const { count: weekSignatures, error: weekError } = await supabase
      .from("petition_signatures")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString())

    if (weekError) {
      console.error("Error getting week's count:", weekError)
    }

    // Get top towns
    const { data: topTownsData, error: townsError } = await supabase.from("petition_signatures").select("town")

    let topTowns: Array<{ town: string; count: number }> = []
    if (!townsError && topTownsData) {
      const townCounts = topTownsData.reduce((acc: Record<string, number>, sig) => {
        acc[sig.town] = (acc[sig.town] || 0) + 1
        return acc
      }, {})

      topTowns = Object.entries(townCounts)
        .map(([town, count]) => ({ town, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
    }

    // Get top zip codes
    const { data: topZipData, error: zipError } = await supabase.from("petition_signatures").select("zip_code")

    let topZipCodes: Array<{ zip_code: string; count: number }> = []
    if (!zipError && topZipData) {
      const zipCounts = topZipData.reduce((acc: Record<string, number>, sig) => {
        acc[sig.zip_code] = (acc[sig.zip_code] || 0) + 1
        return acc
      }, {})

      topZipCodes = Object.entries(zipCounts)
        .map(([zip_code, count]) => ({ zip_code, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
    }

    // Get daily signatures for the last 7 days
    const { data: dailyData, error: dailyError } = await supabase
      .from("petition_signatures")
      .select("created_at")
      .gte("created_at", weekAgo.toISOString())

    let dailySignatures: Array<{ date: string; count: number }> = []
    if (!dailyError && dailyData) {
      const dailyCounts: Record<string, number> = {}

      // Initialize all days in the last 7 days with 0
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        dailyCounts[dateStr] = 0
      }

      // Count actual signatures
      dailyData.forEach((sig) => {
        const date = new Date(sig.created_at)
        const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        if (dailyCounts.hasOwnProperty(dateStr)) {
          dailyCounts[dateStr]++
        }
      })

      dailySignatures = Object.entries(dailyCounts).map(([date, count]) => ({ date, count }))
    }

    // Get hourly distribution
    const { data: hourlyData, error: hourlyError } = await supabase.from("petition_signatures").select("created_at")

    let hourlyDistribution: Array<{ hour: number; count: number }> = []
    if (!hourlyError && hourlyData) {
      const hourlyCounts: Record<number, number> = {}

      // Initialize all hours with 0
      for (let i = 0; i < 24; i++) {
        hourlyCounts[i] = 0
      }

      // Count signatures by hour
      hourlyData.forEach((sig) => {
        const hour = new Date(sig.created_at).getHours()
        hourlyCounts[hour]++
      })

      hourlyDistribution = Object.entries(hourlyCounts).map(([hour, count]) => ({
        hour: Number.parseInt(hour),
        count,
      }))
    }

    const analytics = {
      totalSignatures: totalSignatures || 0,
      todaySignatures: todaySignatures || 0,
      weekSignatures: weekSignatures || 0,
      topTowns,
      topZipCodes,
      dailySignatures,
      hourlyDistribution,
    }

    return NextResponse.json(analytics, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
