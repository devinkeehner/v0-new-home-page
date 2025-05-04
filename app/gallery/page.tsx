import FlickrGalleryFixed from "@/components/flickr-gallery-fixed"

export const metadata = {
  title: "Photo Gallery | Connecticut House Republicans",
  description: "Browse photos from Connecticut House Republicans events and activities",
}

export default function GalleryPage() {
  return (
    <div>
      <FlickrGalleryFixed />
    </div>
  )
}
