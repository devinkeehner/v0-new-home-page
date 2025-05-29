"use server"

import { createClient } from "@supabase/supabase-js"

export async function submitPetition(formData: FormData) {
  try {
    // Create Supabase client with proper error handling
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables")
      return {
        success: false,
        message: "Configuration error. Please contact support.",
        error: "Missing environment variables",
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // First, let's test the connection and check if the table exists
    console.log("Testing Supabase connection...")
    const { data: testData, error: testError } = await supabase
      .from("petition_signatures")
      .select("count", { count: "exact", head: true })

    if (testError) {
      console.error("Table access error:", {
        message: testError.message,
        details: testError.details,
        hint: testError.hint,
        code: testError.code,
      })
      return {
        success: false,
        message: "Database connection error. Please contact support.",
        error: `Table error: ${testError.message}`,
      }
    }

    console.log("Table exists and is accessible")

    // Extract and validate form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const zip = formData.get("zip") as string
    const town = formData.get("town") as string

    if (!firstName || !lastName || !email || !zip || !town) {
      return {
        success: false,
        message: "Please fill in all required fields.",
        error: "Missing required fields",
      }
    }

    const petitionData = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      mobile: (formData.get("mobile") as string)?.trim() || null,
      zip_code: zip.trim(),
      town: town.trim(),
      impact_description: (formData.get("impact") as string)?.trim() || null,
    }

    console.log("Attempting to insert petition data:", petitionData)

    // Insert the petition signature into the database
    const { data, error } = await supabase.from("petition_signatures").insert([petitionData]).select()

    if (error) {
      console.error("Supabase insertion error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error,
      })
      return {
        success: false,
        message: "There was a problem submitting your petition. Please try again.",
        error: `Database error: ${error.message || "Unknown error"}`,
      }
    }

    console.log("Successfully inserted petition:", data)

    return {
      success: true,
      message: "Thank you for signing the petition! Your voice has been recorded.",
      data: data[0],
    }
  } catch (error) {
    console.error("Petition submission error:", error)
    return {
      success: false,
      message: "There was a problem submitting your petition. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
