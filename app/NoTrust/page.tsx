import type { Metadata } from "next"
import NoTrustClientPage from "./NoTrustClientPage"

export const metadata: Metadata = {
  title: "Tell Governor Lamont to Veto HB 7259 - Stop the Trust Act Expansion | Connecticut House Republicans",
  description:
    "Connecticut House Republicans urge Governor Lamont to veto HB 7259, the dangerous Trust Act expansion. Sign the petition to protect Connecticut communities from this harmful legislation.",
  keywords:
    "Connecticut, Trust Act, HB 7259, Governor Lamont, veto, petition, House Republicans, immigration, public safety",
  openGraph: {
    title: "Tell Governor Lamont to Veto HB 7259 - Stop the Trust Act Expansion",
    description:
      "Connecticut House Republicans urge Governor Lamont to veto HB 7259, the dangerous Trust Act expansion. Sign the petition to protect Connecticut communities.",
    url: "https://cthousegop.com/NoTrust",
    siteName: "Connecticut House Republicans",
    images: [
      {
        url: "/images/house-republicans-social-image.jpg",
        width: 1080,
        height: 1080,
        alt: "Connecticut House Republicans - Tell Governor Lamont to Veto HB 7259",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tell Governor Lamont to Veto HB 7259 - Stop the Trust Act Expansion",
    description:
      "Connecticut House Republicans urge Governor Lamont to veto HB 7259, the dangerous Trust Act expansion. Sign the petition to protect Connecticut communities.",
    images: ["/images/house-republicans-social-image.jpg"],
    creator: "@cthousegop",
    site: "@cthousegop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://cthousegop.com/NoTrust",
  },
}

export default function NoTrustPage() {
  return <NoTrustClientPage />
}
