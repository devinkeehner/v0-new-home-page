"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Save } from "lucide-react"
import { updateHeroContent } from "@/app/actions/content-actions"
import type { HeroContent } from "@/lib/kv-content-manager"

interface AdminHeroProps {
  initialContent: HeroContent
  onUpdate?: (content: HeroContent) => void
}

export function AdminHero({ initialContent, onUpdate }: AdminHeroProps) {
  const [content, setContent] = useState<HeroContent>(initialContent)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update local state when initialContent changes
  useEffect(() => {
    setContent(initialContent)
  }, [initialContent])

  const handleChange = (field: keyof HeroContent, value: string) => {
    const updatedContent = { ...content, [field]: value }
    setContent(updatedContent)
    if (onUpdate) onUpdate(updatedContent)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await updateHeroContent(content)

      if (result.success) {
        toast({
          title: "Success",
          description: "Hero content updated successfully",
        })
      } else {
        throw new Error(result.error || "Failed to update hero content")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
        <CardDescription>Edit the main hero section content</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input id="title" value={content.title} onChange={(e) => handleChange("title", e.target.value)} required />
          </div>

          <div className="space-y-2">
            <label htmlFor="subtitle" className="text-sm font-medium">
              Subtitle
            </label>
            <Textarea
              id="subtitle"
              value={content.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="newsletterText" className="text-sm font-medium">
              Newsletter Text
            </label>
            <Input
              id="newsletterText"
              value={content.newsletterText}
              onChange={(e) => handleChange("newsletterText", e.target.value)}
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-secondary-red hover:bg-secondary-red/90">
          {isSubmitting ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
