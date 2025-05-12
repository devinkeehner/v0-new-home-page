"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

// Google Analytics tracking ID
const GA_TRACKING_ID = "G-QBXDQ0WXNK"

export function AnalyticsScripts() {
  const [disableAnalytics, setDisableAnalytics] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true)

    // Detect WordPress login cookie
    const isWpLoggedIn = document.cookie.split(";").some((c) => c.trim().startsWith("wordpress_logged_in_"))

    if (isWpLoggedIn) {
      // Prevent gtag from sending hits
      window[`ga-disable-${GA_TRACKING_ID}`] = true
      setDisableAnalytics(true)
    }
  }, [])

  // Only render scripts on client side to avoid hydration issues
  if (!isClient) return null

  return (
    <>
      {/* Only load gtag.js if not opted out */}
      {!disableAnalytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                linker: { domains: ['cthousegop.com','www.cthousegop.com'] }
              });
            `}
          </Script>
        </>
      )}
    </>
  )
}
