"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { BudgetDebateBanner } from "@/components/budget-debate-banner" // Import the banner

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Header /> {/* Always show the normal header */}
      {isHomePage && <BudgetDebateBanner />} {/* Show banner only on home page */}
      <main>{children}</main>
      <Footer />
    </ThemeProvider>
  )
}
