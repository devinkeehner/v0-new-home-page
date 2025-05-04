import Link from "next/link"
import { Button } from "@/components/ui/button"
import FlickrGalleryFixed from "@/components/flickr-gallery-fixed"

export function PhotoGallery() {
  return (
    <section className="py-12">
      <div className="container">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-primary-navy">Photo Gallery</h2>
          <Link href="/gallery">
            <Button variant="outline">View All Photos</Button>
          </Link>
        </div>

        {/* Use the fixed FlickrGallery component */}
        <FlickrGalleryFixed />

        <div className="mt-8 text-center">
          <Link href="/gallery">
            <Button className="bg-secondary-red hover:bg-secondary-red/90">View Full Gallery</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
