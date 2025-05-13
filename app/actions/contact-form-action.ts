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
  const FORM_ID = "9" // Using the correct form ID for contact form

  if (!GF_API_KEY || !GF_API_SECRET) {
    throw new Error("Gravity Forms API credentials are not set in environment variables.")
  }

  try {
    const url = `${WP_URL}/wp-json/gf/v2/forms/${FORM_ID}/submissions`

    // Map our form fields to Gravity Form input IDs using the flattened format for address fields
    const payload: Record<string, any> = {
      input_1_3: formData.firstName, // Name field (ID 1, subfield 3)
      input_1_6: formData.lastName, // Name field (ID 1, subfield 6)
      input_3: formData.email, // Email (ID 3)
      input_6: formData.phone || "", // Phone (ID 6)
      input_2_1: formData.address || "", // Address field (ID 2, subfield 1)
      input_2_3: formData.city || "", // Address field (ID 2, subfield 3)
      input_2_5: formData.zip || "", // Address field (ID 2, subfield 5)
      input_7: formData.representative || "To General Mailbox", // Select (ID 7)
      input_4: formData.message, // Textarea (ID 4)
    }

    // Handle issues (checkboxes, field ID 9)
    if (formData.issues && formData.issues.length > 0) {
      payload.input_9 = formData.issues
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
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
