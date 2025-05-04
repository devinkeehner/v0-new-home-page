"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminNavigation } from "@/components/admin/navigation-editor"
import { AdminHero } from "@/components/admin/hero-editor"
import { AdminFooter } from "@/components/admin/footer-editor"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { SiteContent } from "@/lib/kv-content-manager"

interface AdminTabsProps {
  initialContent: SiteContent
}

export function AdminTabs({ initialContent }: AdminTabsProps) {
  // Keep track of the current content state
  const [content, setContent] = useState<SiteContent>(initialContent)
  const [error, setError] = useState<string | null>(null)

  // Update local state when initialContent change
  useEffect(() => {
    try {
      setContent(initialContent)
      setError(null)
    } catch (err) {
      setError("Failed to load content. Please refresh the page.")
      console.error("Error setting initial content:", err)
    }
  }, [initialContent])

  // Update content when navigation changes
  const handleNavigationUpdate = (navigation: SiteContent["navigation"]) => {
    try {
      setContent((prev) => ({ ...prev, navigation }))
    } catch (err) {
      console.error("Error updating navigation:", err)
    }
  }

  // Update content when hero changes
  const handleHeroUpdate = (hero: SiteContent["hero"]) => {
    try {
      setContent((prev) => ({ ...prev, hero }))
    } catch (err) {
      console.error("Error updating hero:", err)
    }
  }

  // Update content when footer changes
  const handleFooterUpdate = (footer: SiteContent["footer"]) => {
    try {
      setContent((prev) => ({ ...prev, footer }))
    } catch (err) {
      console.error("Error updating footer:", err)
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Tabs defaultValue="navigation" className="w-full">
      <TabsList className="mb-6 grid w-full grid-cols-3">
        <TabsTrigger value="navigation">Navigation</TabsTrigger>
        <TabsTrigger value="hero">Hero Section</TabsTrigger>
        <TabsTrigger value="footer">Footer</TabsTrigger>
      </TabsList>

      <TabsContent value="navigation">
        <AdminNavigation initialNavItems={content.navigation} onUpdate={handleNavigationUpdate} />
      </TabsContent>

      <TabsContent value="hero">
        <AdminHero initialContent={content.hero} onUpdate={handleHeroUpdate} />
      </TabsContent>

      <TabsContent value="footer">
        <AdminFooter initialContent={content.footer} onUpdate={handleFooterUpdate} />
      </TabsContent>
    </Tabs>
  )
}
