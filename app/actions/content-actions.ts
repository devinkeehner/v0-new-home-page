"use server"

import { getSiteContent, updateSiteContent, type SiteContent, type NavigationItem } from "@/lib/kv-content-manager"
import { revalidatePath } from "next/cache"

// Update navigation items
export async function updateNavigation(navigation: NavigationItem[]) {
  try {
    const content = await getSiteContent()
    content.navigation = navigation
    await updateSiteContent(content)
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error updating navigation:", error)
    return { success: false, error: "Failed to update navigation" }
  }
}

// Update hero content
export async function updateHeroContent(heroContent: SiteContent["hero"]) {
  try {
    const content = await getSiteContent()
    content.hero = heroContent
    await updateSiteContent(content)
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error updating hero content:", error)
    return { success: false, error: "Failed to update hero content" }
  }
}

// Update footer content
export async function updateFooterContent(footerContent: SiteContent["footer"]) {
  try {
    const content = await getSiteContent()
    content.footer = footerContent
    await updateSiteContent(content)
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error updating footer content:", error)
    return { success: false, error: "Failed to update footer content" }
  }
}
