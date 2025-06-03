"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BudgetDebateBanner } from "@/components/budget-debate-banner"
import { Suspense } from "react"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <Header />
      {isHomePage && <BudgetDebateBanner />}
      <Suspense>
        {" "}
        {/* Ensure Suspense wraps main content if needed for other children */}
        <main>{children}</main>
      </Suspense>
      <Footer />
    </ThemeProvider>
  )
}
