import fs from "fs/promises"
import path from "path"

const contentFilePath = path.join(process.cwd(), "content", "site-content.json")

// In-memory cache for sandbox environments
let contentCache: SiteContent | null = null

export type NavigationItem = {
  name: string
  href: string
  children?: NavigationItem[] // Add support for nested items
}

export type HeroContent = {
  title: string
  subtitle: string
  newsletterText: string
}

export type FooterContent = {
  tagline: string
  resources: NavigationItem[]
  quickLinks: NavigationItem[]
  contactInfo: NavigationItem[]
}

export type SiteContent = {
  navigation: NavigationItem[]
  hero: HeroContent
  footer: FooterContent
}

// Default content if file doesn't exist
const defaultContent: SiteContent = {
  navigation: [
    { name: "Home", href: "/" },
    {
      name: "Representatives",
      href: "/representatives",
      children: [
        { name: "Leadership", href: "/representatives/leadership" },
        { name: "By District", href: "/representatives/by-district" },
      ],
    },
    { name: "Newsroom", href: "/newsroom" },
    { name: "Legislation", href: "/legislation" },
    { name: "Committees", href: "/committees" },
    { name: "Resources", href: "/resources" },
    { name: "Contact", href: "/contact" },
  ],
  hero: {
    title: "Connecticut House Republicans",
    subtitle: "Fighting for Connecticut's families and businesses with common-sense solutions.",
    newsletterText: "Stay informed with the latest news and updates from our caucus.",
  },
  footer: {
    tagline: "Fighting for Connecticut's families and businesses with common-sense solutions.",
    resources: [
      { name: "Caucus Resources", href: "/resources/caucus" },
      { name: "Legislative Resources", href: "/resources/legislative" },
      { name: "Documents & Surveys", href: "/resources/documents" },
      { name: "Citizen Guide", href: "/resources/citizen-guide" },
    ],
    quickLinks: [
      { name: "Representatives", href: "/representatives" },
      { name: "Newsroom", href: "/newsroom" },
      { name: "Legislation", href: "/legislation" },
      { name: "Committees", href: "/committees" },
    ],
    contactInfo: [
      { name: "Legislative Office Building, Room 4200", href: "#" },
      { name: "300 Capitol Avenue", href: "#" },
      { name: "Hartford, CT 06106", href: "#" },
      { name: "860-240-8700", href: "tel:8602408700" },
    ],
  },
}

// Read content from the JSON file or use cache in sandbox
export async function getSiteContent(): Promise<SiteContent> {
  // If we have cached content, return it
  if (contentCache) {
    return contentCache
  }

  try {
    // Try to read from file
    const content = await fs.readFile(contentFilePath, "utf8")
    const parsedContent = JSON.parse(content) as SiteContent
    contentCache = parsedContent
    return parsedContent
  } catch (error) {
    console.log("Could not read content file, using default content")
    // If file doesn't exist or can't be read, use default content
    contentCache = defaultContent
    return defaultContent
  }
}

// Write updated content to the JSON file and update cache
export async function updateSiteContent(content: SiteContent): Promise<void> {
  try {
    // Update the in-memory cache
    contentCache = content

    // Try to write to file system (may fail in sandbox)
    try {
      // Ensure the directory exists
      await fs.mkdir(path.dirname(contentFilePath), { recursive: true })
      // Write the content with pretty formatting
      await fs.writeFile(contentFilePath, JSON.stringify(content, null, 2), "utf8")
      console.log("Content saved to file successfully")
    } catch (fileError) {
      console.log("Could not write to file system, using in-memory cache only", fileError)
      // In sandbox, we'll rely on the in-memory cache
    }
  } catch (error) {
    console.error("Error updating site content:", error)
    throw new Error("Failed to update site content")
  }
}
