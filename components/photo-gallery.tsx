import FlickrGalleryFixed from "@/components/flickr-gallery-fixed"

export function PhotoGallery() {
  return (
    <section className="py-12">
      <div className="container">
        {/* Removed heading and buttons */}
        <FlickrGalleryFixed />
      </div>
    </section>
  )
}
