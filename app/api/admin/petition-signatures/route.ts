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

    // Fetch all petition signatures, ordered by most recent first
    const { data: signatures, error } = await supabase
      .from("petition_signatures")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching signatures:", error)
      return NextResponse.json({ error: "Failed to fetch signatures" }, { status: 500 })
    }

    return NextResponse.json(
      { signatures: signatures || [] },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      },
    )
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
