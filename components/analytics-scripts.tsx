"use client"

import { useEffect } from "react"
import Script from "next/script"

// Google Analytics tracking ID
const GA_TRACKING_ID = "G-QBXDQ0WXNK"

export function AnalyticsScripts() {
  useEffect(() => {
    // Check for WordPress login cookie on the client side
    const isWpLoggedIn = document.cookie.split(";").some((c) => c.trim().startsWith("wordpress_logged_in_"))

    if (isWpLoggedIn) {
      // Disable tracking for WordPress logged-in users
      window[`ga-disable-${GA_TRACKING_ID}`] = true
      console.log("Analytics disabled for WordPress logged-in user")
    } else {
      console.log("Analytics enabled")
    }
  }, [])

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
            linker: { domains: ['cthousegop.com','www.cthousegop.com'] }
          });
        `}
      </Script>
    </>
  )
}
