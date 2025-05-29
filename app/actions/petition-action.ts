"use server"

import { createClient } from "@supabase/supabase-js"

// Helper function to add contact to iContact
async function addContactToIContact(email: string, firstName: string, lastName: string) {
  const APP_ID = process.env.ICONTACT_APP_ID
  const USERNAME = process.env.ICONTACT_API_USERNAME
  const PASSWORD = process.env.ICONTACT_API_PASSWORD
  const ACCOUNT_ID = process.env.ICONTACT_ACCOUNT_ID
  const CLIENT_FOLDER_ID = process.env.ICONTACT_CLIENT_FOLDER_ID
  const LIST_ID = process.env.ICONTACT_LIST_ID

  if (!APP_ID || !USERNAME || !PASSWORD || !ACCOUNT_ID || !CLIENT_FOLDER_ID || !LIST_ID) {
    console.error("iContact API credentials or IDs are missing in environment variables.")
    return { success: false, error: "iContact configuration error." }
  }

  const BASE_URL = "https://app.icontact.com"
  const HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "API-Version": "2.2",
    "API-AppId": APP_ID,
    "API-Username": USERNAME,
    "API-Password": PASSWORD,
  }

  try {
    // 1. Create (or update) the contact
    console.log(`Attempting to add/update contact ${email} in iContact...`)
    const contactRes = await fetch(`${BASE_URL}/icp/a/${ACCOUNT_ID}/c/${CLIENT_FOLDER_ID}/contacts/`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify([
        { email, firstName, lastName, status: "normal" }, // "normal" = opted-in
      ]),
    })

    if (!contactRes.ok) {
      const errorBody = await contactRes.text()
      console.error("iContact API Error (contacts):", contactRes.status, errorBody)
      return {
        success: false,
        step: "contacts",
        error: `iContact API Error (contacts): ${contactRes.status} - ${errorBody || contactRes.statusText}`,
      }
    }

    const { contacts } = await contactRes.json()
    const contactId = contacts?.[0]?.contactId

    if (!contactId) {
      console.error("iContact API Error: Missing contactId in response.")
      return {
        success: false,
        step: "contacts",
        error: "iContact API Error: Missing contactId in response",
      }
    }
    console.log(`Contact ${email} (ID: ${contactId}) created/updated in iContact.`)

    // 2. Subscribe that contact to your list
    console.log(`Attempting to subscribe contact ${contactId} to list ${LIST_ID}...`)
    const subRes = await fetch(`${BASE_URL}/icp/a/${ACCOUNT_ID}/c/${CLIENT_FOLDER_ID}/subscriptions/`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify([{ contactId, listId: LIST_ID, status: "normal" }]),
    })

    if (!subRes.ok) {
      const errorBody = await subRes.text()
      console.error("iContact API Error (subscriptions):", subRes.status, errorBody)
      return {
        success: false,
        step: "subscriptions",
        error: `iContact API Error (subscriptions): ${subRes.status} - ${errorBody || subRes.statusText}`,
      }
    }

    console.log(`Contact ${contactId} successfully subscribed to list ${LIST_ID}.`)
    return { success: true, contactId }
  } catch (err: any) {
    console.error("iContact API call failed:", err)
    return {
      success: false,
      error: `iContact API call failed: ${err.message || err.toString()}`,
    }
  }
}

export async function submitPetition(formData: FormData) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables")
      return {
        success: false,
        message: "Configuration error. Please contact support.",
        error: "Missing Supabase environment variables",
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log("Testing Supabase connection...")
    const { error: testError } = await supabase
      .from("petition_signatures")
      .select("count", { count: "exact", head: true })

    if (testError) {
      console.error("Supabase table access error:", {
        message: testError.message,
        details: testError.details,
        hint: testError.hint,
        code: testError.code,
      })
      return {
        success: false,
        message: "Database connection error. Please contact support.",
        error: `Supabase table error: ${testError.message}`,
      }
    }
    console.log("Supabase table exists and is accessible.")

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

    console.log("Attempting to insert petition data into Supabase:", petitionData)
    const { data: supabaseData, error: supabaseError } = await supabase
      .from("petition_signatures")
      .insert([petitionData])
      .select()

    if (supabaseError) {
      console.error("Supabase insertion error details:", {
        message: supabaseError.message,
        details: supabaseError.details,
        hint: supabaseError.hint,
        code: supabaseError.code,
        fullError: supabaseError,
      })
      return {
        success: false,
        message: "There was a problem submitting your petition to the database. Please try again.",
        error: `Supabase database error: ${supabaseError.message || "Unknown error"}`,
      }
    }

    console.log("Successfully inserted petition into Supabase:", supabaseData)

    // Attempt to add contact to iContact after successful Supabase insert
    const iContactResult = await addContactToIContact(
      petitionData.email,
      petitionData.first_name,
      petitionData.last_name,
    )

    if (iContactResult.success) {
      console.log(`Successfully added/subscribed ${petitionData.email} to iContact list.`)
      return {
        success: true,
        message:
          "Thank you for signing the petition! Your voice has been recorded and you've been added to our mailing list.",
        data: supabaseData[0],
        iContactData: { contactId: iContactResult.contactId },
      }
    } else {
      console.warn(
        `Petition saved to database, but failed to add/subscribe ${petitionData.email} to iContact: ${iContactResult.error}`,
      )
      // Still return success for the petition, but with a note about iContact
      return {
        success: true,
        message:
          "Thank you for signing the petition! Your voice has been recorded. (Note: There was an issue subscribing to the mailing list.)",
        data: supabaseData[0],
        iContactError: iContactResult.error,
      }
    }
  } catch (error) {
    console.error("Petition submission error (overall):", error)
    return {
      success: false,
      message: "There was a problem submitting your petition. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
