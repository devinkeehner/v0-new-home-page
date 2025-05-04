import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { getSiteContent } from "@/lib/kv-content-manager"

// Google Font alternatives based on branding guidelines
const headingFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
}) // Alternative for Kranto

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
}) // Source Sans as specified

export const metadata: Metadata = {
  title: "Connecticut House Republicans",
  description: "Official website of the Connecticut House Republicans",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get site content
  const siteContent = await getSiteContent()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${headingFont.variable} ${bodyFont.variable} font-body`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Header navItems={siteContent.navigation} />
          <main>{children}</main>
          <Footer content={siteContent.footer} />
        </ThemeProvider>
      </body>
    </html>
  )
}
