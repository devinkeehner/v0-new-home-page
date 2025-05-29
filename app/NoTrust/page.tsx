import type { Metadata } from "next"
import NoTrustClientPage from "./NoTrustClientPage"

export const metadata: Metadata = {
  title: "Tell Governor Lamont to Veto HB 7259 - Connecticut House Republicans",
  description:
    "Join Connecticut House Republicans in urging Governor Lamont to veto HB 7259, the dangerous Trust Act expansion that threatens public safety. Sign the petition today.",
  openGraph: {
    title: "Tell Governor Lamont to Veto HB 7259",
    description:
      "Join Connecticut House Republicans in urging Governor Lamont to veto HB 7259, the dangerous Trust Act expansion that threatens public safety.",
    images: [
      {
        url: "/social/trust-act-facebook-ad.jpg",
        width: 1080,
        height: 1080,
        alt: "House Republicans to Governor Lamont - Veto HB 7259",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tell Governor Lamont to Veto HB 7259",
    description:
      "Join Connecticut House Republicans in urging Governor Lamont to veto HB 7259, the dangerous Trust Act expansion that threatens public safety.",
    images: ["/social/trust-act-facebook-ad.jpg"],
  },
}

export default function NoTrustPage() {
  return <NoTrustClientPage />
}
