import { Hero } from "@/components/hero"
import { BudgetTaxSlider } from "@/components/budget-tax-slider"
import { BudgetSection } from "@/components/budget-section"
import { TaxReliefSection } from "@/components/tax-relief-section"
import { NewsCarousel } from "@/components/news-carousel"
import SocialFeedEmbed from "@/components/social-feed-embed"
import { PhotoGallery } from "@/components/photo-gallery"
import { getWordPressPosts } from "@/lib/api"

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

  return (
    <>
      <Hero />
      <BudgetTaxSlider />
      <BudgetSection />
      <TaxReliefSection />
      <NewsCarousel posts={posts} />
      <SocialFeedEmbed />
      <PhotoGallery />
    </>
  )
}
