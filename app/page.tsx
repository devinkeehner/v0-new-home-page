import { BudgetTaxSlider } from "@/components/budget-tax-slider"
import { NewsCarousel } from "@/components/news-carousel"
import { PhotoGallery } from "@/components/photo-gallery"
import { getWordPressPosts } from "@/lib/api"
import SocialMediaSection from "@/components/social-media-section"

export default async function Home() {
  // Fetch WordPress posts with error handling
  let posts = []
  try {
    const response = await getWordPressPosts()
    // Extract posts array from the response object
    posts = response.posts || []
    console.log(`Successfully fetched ${posts.length} posts`)
  } catch (error) {
    console.error("Error in Home component:", error)
    // Continue rendering the page even if posts fetch fails
  }

  return (
    <>
      {/* temporarly removed by user <Hero /> */}
      <BudgetTaxSlider />
      {/* temporarly removed by user <BudgetSection />*/}
      {/* temporarly removed by user <TaxReliefSection />*/}
      <NewsCarousel posts={posts} />
      <SocialMediaSection />
      <PhotoGallery />
    </>
  )
}
