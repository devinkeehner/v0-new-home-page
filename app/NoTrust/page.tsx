import type { Metadata } from "next"
import NoTrustClientPage from "./NoTrustClientPage"

export const metadata: Metadata = {
  title: "Stand Against HB 7259 - Connecticut House Republicans",
  description:
    "Join Connecticut House Republicans in opposing HB 7259, the dangerous Trust Act expansion. Support our continued efforts to protect Connecticut communities.",
  openGraph: {
    title: "Stand Against HB 7259",
    description:
      "Join Connecticut House Republicans in opposing HB 7259, the dangerous Trust Act expansion. Support our continued efforts to protect Connecticut communities.",
    images: [
      {
        url: "/social/el-leches-facebook-ad.png",
        width: 1200,
        height: 630,
        alt: "ICE arrests alleged gang member hiding from Mexican authorities in sanctuary city - El Leches arrested in New Haven",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stand Against HB 7259",
    description:
      "Join Connecticut House Republicans in opposing HB 7259, the dangerous Trust Act expansion. Support our continued efforts to protect Connecticut communities.",
    images: ["/social/el-leches-facebook-ad.png"],
  },
}

export default function NoTrustPage() {
  return <NoTrustClientPage />
}
