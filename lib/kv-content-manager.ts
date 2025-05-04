import { kv } from "@vercel/kv"
import { getSiteContent as getFileContent, updateSiteContent as updateFileContent } from "./content-manager"
import type { SiteContent, NavigationItem, HeroContent, FooterContent } from "./content-manager"

// Key for storing site content in KV
const CONTENT_KEY = "site:content"

// Check if KV is available (has connection string)
export function isKVAvailable(): boolean {
  return process.env.KV_URL !== undefined && process.env.KV_REST_API_URL !== undefined
}

// Get content from KV or fall back to file system
export async function getSiteContent(): Promise<SiteContent> {
  try {
    // Try to get from KV if available
    if (isKVAvailable()) {
      try {
        // The Vercel KV client doesn't accept cache options for get
        const kvContent = await kv.get<SiteContent>(CONTENT_KEY)

        // If content exists in KV, return it
        if (kvContent) {
          console.log("Content loaded from KV")
          return kvContent
        }
      } catch (kvError) {
        console.error("Error accessing KV:", kvError)
        // Continue to fallback if KV access fails
      }

      // If no content in KV yet, get from file and store in KV
      console.log("No content in KV, loading from file")
      const fileContent = await getFileContent()

      try {
        await kv.set(CONTENT_KEY, fileContent)
      } catch (kvSetError) {
        console.error("Error setting KV content:", kvSetError)
        // Continue even if KV set fails
      }

      return fileContent
    }

    // Fall back to file system if KV not available
    console.log("KV not available, loading from file")
    return await getFileContent()
  } catch (error) {
    console.error("Error getting site content:", error)
    // Fall back to file content if KV fails
    return await getFileContent()
  }
}

// Update content in KV and optionally in file system
export async function updateSiteContent(content: SiteContent): Promise<void> {
  try {
    // Always try to update file system for local development
    try {
      await updateFileContent(content)
    } catch (fileError) {
      console.log("Could not update file system (expected in production)", fileError)
    }

    // Update KV if available
    if (isKVAvailable()) {
      try {
        await kv.set(CONTENT_KEY, content)
        console.log("Content saved to KV")
      } catch (kvError) {
        console.error("Error saving to KV:", kvError)
        throw new Error("Failed to save content to KV")
      }
    } else {
      console.log("KV not available, content only saved to file system")
    }
  } catch (error) {
    console.error("Error updating site content:", error)
    throw new Error("Failed to update site content")
  }
}

export type { SiteContent, NavigationItem, HeroContent, FooterContent }
