"use server"

// This file provides a server action to submit the contact form to Gravity Forms

export async function submitContactForm(formData: {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  zip?: string
  issues?: string[]
  representative?: string
  message: string
}) {
  // These should be set in your Vercel project environment variables
  const GF_API_KEY = process.env.GF_API_KEY
  const GF_API_SECRET = process.env.GF_API_SECRET
  const WP_URL = process.env.WP_URL || "https://www.cthousegop.com"
  const CONTACT_FORM_ID = process.env.CONTACT_FORM_ID || "21" // Using a different form ID for contact form

  if (!GF_API_KEY || !GF_API_SECRET) {
    throw new Error("Gravity Forms API credentials are not set in environment variables.")
  }

  try {
    const url = `${WP_URL}/wp-json/gf/v2/forms/${CONTACT_FORM_ID}/submissions`

    // Map our form fields to Gravity Form input IDs using the flattened format for address fields
    const payload = {
      input_1: formData.firstName,
      input_2: formData.lastName,
      input_3: formData.email,
      input_4: formData.phone || "",
      input_5: formData.address || "",
      input_6_3: formData.city || "", // Address - City (Field ID 6, Subfield 3)
      input_6_5: formData.zip || "", // Address - ZIP (Field ID 6, Subfield 5)
      input_8: formData.issues ? formData.issues.join(", ") : "",
      input_9: formData.representative || "To General Mailbox",
      input_10: formData.message,
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
    return {
      success: true,
      data: result,
      reference: `REF-${Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")}`,
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
