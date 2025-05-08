import FlickrGalleryFixed from "@/components/flickr-gallery-fixed"

export const metadata = {
  title: "Photo Gallery | Connecticut House Republicans",
  description: "Browse photos from Connecticut House Republicans events and activities",
}

export default function GalleryPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-navy mb-4">Photo Gallery</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Browse through our collection of photos from Connecticut House Republicans events, press conferences, and
          legislative activities. These images showcase our caucus members working for the people of Connecticut.
        </p>
      </div>
      <FlickrGalleryFixed />
    </div>
  )
}
