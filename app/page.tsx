import { Hero } from "@/components/hero"
import { NewsCarousel } from "@/components/news-carousel"
import SocialFeedEmbed from "@/components/social-feed-embed"
import { PhotoGallery } from "@/components/photo-gallery"
import { getWordPressPosts } from "@/lib/api"
import { getSiteContent } from "@/lib/kv-content-manager"

export default async function Home() {
  // Fetch WordPress posts with error handling
  let posts = []
  try {
    posts = await getWordPressPosts()
    console.log(`Successfully fetched ${posts.length} posts`)
  } catch (error) {
    console.error("Error in Home component:", error)
    // Continue rendering the page even if posts fetch fails
  }

  // Get site content
  const siteContent = await getSiteContent()

  return (
    <>
      <Hero content={siteContent.hero} />
      <NewsCarousel posts={posts} />
      <SocialFeedEmbed />
      <PhotoGallery />
    </>
  )
}
