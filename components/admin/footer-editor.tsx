"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Trash2, Plus, Save, GripVertical } from "lucide-react"
import { updateFooterContent } from "@/app/actions/content-actions"
import type { FooterContent, NavigationItem } from "@/lib/kv-content-manager"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"

interface SortableItemProps {
  id: string
  item: NavigationItem
  index: number
  handleItemChange: (index: number, field: keyof NavigationItem, value: string) => void
  handleRemoveItem: (index: number) => void
}

function SortableItem({ id, item, index, handleItemChange, handleRemoveItem }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-md border p-2",
        isDragging ? "z-10 bg-muted opacity-80 shadow-md" : "",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="cursor-grab touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
        <span className="sr-only">Drag to reorder</span>
      </Button>

      <div className="grid flex-1 grid-cols-2 gap-3">
        <Input
          placeholder="Link Name"
          value={item.name}
          onChange={(e) => handleItemChange(index, "name", e.target.value)}
          required
        />
        <Input
          placeholder="URL"
          value={item.href}
          onChange={(e) => handleItemChange(index, "href", e.target.value)}
          required
        />
      </div>
      <Button type="button" variant="outline" size="icon" onClick={() => handleRemoveItem(index)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

interface AdminFooterProps {
  initialContent: FooterContent
  onUpdate?: (content: FooterContent) => void
}

export function AdminFooter({ initialContent, onUpdate }: AdminFooterProps) {
  const [content, setContent] = useState<FooterContent>(initialContent)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState<keyof Omit<FooterContent, "tagline"> | null>(null)

  // Update local state when initialContent changes
  useEffect(() => {
    setContent(initialContent)
  }, [initialContent])

  // Set up sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance required before activating
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleTaglineChange = (value: string) => {
    const updatedContent = { ...content, tagline: value }
    setContent(updatedContent)
    if (onUpdate) onUpdate(updatedContent)
  }

  const handleAddItem = (section: keyof Omit<FooterContent, "tagline">) => {
    const updatedContent = {
      ...content,
      [section]: [...content[section], { name: "", href: "/" }],
    }
    setContent(updatedContent)
    if (onUpdate) onUpdate(updatedContent)
  }

  const handleRemoveItem = (section: keyof Omit<FooterContent, "tagline">, index: number) => {
    const updatedContent = {
      ...content,
      [section]: content[section].filter((_, i) => i !== index),
    }
    setContent(updatedContent)
    if (onUpdate) onUpdate(updatedContent)
  }

  const handleItemChange = (
    section: keyof Omit<FooterContent, "tagline">,
    index: number,
    field: keyof NavigationItem,
    value: string,
  ) => {
    const updatedItems = [...content[section]]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    const updatedContent = {
      ...content,
      [section]: updatedItems,
    }
    setContent(updatedContent)
    if (onUpdate) onUpdate(updatedContent)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id && activeSection) {
      setContent((prevContent) => {
        const oldIndex = Number.parseInt(active.id.toString().split("-")[1])
        const newIndex = Number.parseInt(over.id.toString().split("-")[1])

        const updatedContent = {
          ...prevContent,
          [activeSection]: arrayMove(prevContent[activeSection], oldIndex, newIndex),
        }

        if (onUpdate) onUpdate(updatedContent)
        return updatedContent
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await updateFooterContent(content)

      if (result.success) {
        toast({
          title: "Success",
          description: "Footer content updated successfully",
        })
      } else {
        throw new Error(result.error || "Failed to update footer content")
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
        <CardTitle>Footer Content</CardTitle>
        <CardDescription>Edit the footer content and links. Drag items to reorder them.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="tagline" className="text-sm font-medium">
              Tagline
            </label>
            <Textarea
              id="tagline"
              value={content.tagline}
              onChange={(e) => handleTaglineChange(e.target.value)}
              required
              rows={2}
            />
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            {/* Resources Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Resources</h3>
              <SortableContext
                items={content.resources.map((_, i) => `resource-${i}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3" onFocus={() => setActiveSection("resources")}>
                  {content.resources.map((item, index) => (
                    <SortableItem
                      key={`resource-${index}`}
                      id={`resource-${index}`}
                      item={item}
                      index={index}
                      handleItemChange={(index, field, value) => handleItemChange("resources", index, field, value)}
                      handleRemoveItem={(index) => handleRemoveItem("resources", index)}
                    />
                  ))}
                </div>
              </SortableContext>
              <Button type="button" variant="outline" onClick={() => handleAddItem("resources")}>
                <Plus className="mr-2 h-4 w-4" /> Add Resource Link
              </Button>
            </div>

            {/* Quick Links Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Quick Links</h3>
              <SortableContext
                items={content.quickLinks.map((_, i) => `quickLink-${i}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3" onFocus={() => setActiveSection("quickLinks")}>
                  {content.quickLinks.map((item, index) => (
                    <SortableItem
                      key={`quickLink-${index}`}
                      id={`quickLink-${index}`}
                      item={item}
                      index={index}
                      handleItemChange={(index, field, value) => handleItemChange("quickLinks", index, field, value)}
                      handleRemoveItem={(index) => handleRemoveItem("quickLinks", index)}
                    />
                  ))}
                </div>
              </SortableContext>
              <Button type="button" variant="outline" onClick={() => handleAddItem("quickLinks")}>
                <Plus className="mr-2 h-4 w-4" /> Add Quick Link
              </Button>
            </div>

            {/* Contact Info Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <SortableContext
                items={content.contactInfo.map((_, i) => `contactInfo-${i}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3" onFocus={() => setActiveSection("contactInfo")}>
                  {content.contactInfo.map((item, index) => (
                    <SortableItem
                      key={`contactInfo-${index}`}
                      id={`contactInfo-${index}`}
                      item={item}
                      index={index}
                      handleItemChange={(index, field, value) => handleItemChange("contactInfo", index, field, value)}
                      handleRemoveItem={(index) => handleRemoveItem("contactInfo", index)}
                    />
                  ))}
                </div>
              </SortableContext>
              <Button type="button" variant="outline" onClick={() => handleAddItem("contactInfo")}>
                <Plus className="mr-2 h-4 w-4" /> Add Contact Info
              </Button>
            </div>
          </DndContext>
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
