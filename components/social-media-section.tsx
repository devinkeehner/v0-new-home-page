import FacebookFeedMasonry from "@/components/facebook-feed-masonry"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

export function SocialMediaSection() {
  return (
    <section className="py-12 bg-light-blue/20">
      <div className="container">
        <h2 className="mb-8 text-center text-3xl font-bold text-primary-navy">Social Media</h2>

        <FacebookFeedMasonry />

        <div className="mt-8 text-center">
          <Link href="https://www.facebook.com/cthousegop" target="_blank" rel="noopener noreferrer">
            <Button className="bg-secondary-red hover:bg-secondary-red/90">
              See More on Facebook <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

// Add default export
export default SocialMediaSection
