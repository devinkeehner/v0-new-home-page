"use server"

// This file provides server actions to submit forms to Gravity Forms
// Uses fetch to POST to the Gravity Forms v2 REST API with HTTP Basic Auth

export async function submitNewsletterForm(formData: {
  email: string
  mobile?: string
  zipCode?: string
  firstName?: string
  lastName?: string
  city?: string
}) {
  // These should be set in your Vercel project environment variables
  const GF_API_KEY = process.env.GF_API_KEY
  const GF_API_SECRET = process.env.GF_API_SECRET
  const WP_URL = process.env.WP_URL || "https://www.cthousegop.com"
  const FORM_ID = process.env.FORM_ID || "20"

  if (!GF_API_KEY || !GF_API_SECRET) {
    throw new Error("Gravity Forms API credentials are not set in environment variables.")
  }

  try {
    const url = `${WP_URL}/wp-json/gf/v2/forms/${FORM_ID}/submissions`

    // Map our form fields to Gravity Form input IDs using the flattened format for address fields
    const payload = {
      input_4: formData.firstName || "", // First Name (Field ID 4)
      input_5: formData.lastName || "", // Last Name (Field ID 5)
      input_6: formData.mobile || "", // Phone (Field ID 6)
      input_3: formData.email, // Email (Field ID 3)
      input_2_3: formData.city || "", // Address - City (Field ID 2, Subfield 3)
      input_2_5: formData.zipCode || "", // Address - ZIP (Field ID 2, Subfield 5)
    }

    const auth = Buffer.from(`${GF_API_KEY}:${GF_API_SECRET}`).toString("base64")

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errorData = await res.text() // Get text first for better error details
      console.error("Gravity Forms API Error Response:", errorData)
      try {
        const errorJson = JSON.parse(errorData)
        throw new Error(`Gravity Forms submission failed: ${res.status} ${JSON.stringify(errorJson)}`)
      } catch (e) {
        throw new Error(`Gravity Forms submission failed: ${res.status} ${errorData}`)
      }
    }

    const result = await res.json()
    return { success: true, data: result }
  } catch (error) {
    console.error("Form submission error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
