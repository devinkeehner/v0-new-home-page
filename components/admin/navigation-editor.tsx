"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import {
  Trash2,
  Plus,
  Save,
  GripVertical,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  ChevronUp,
  ChevronDownIcon,
} from "lucide-react"
import { updateNavigation } from "@/app/actions/content-actions"
import type { NavigationItem } from "@/lib/kv-content-manager"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"

// Unique identifier for menu items that includes the full path
type ItemId = string

// Function to create a unique ID for each item based on its path
const createItemId = (path: number[]): ItemId => `item-${path.join("-")}`

// Function to parse an item ID back into a path
const parseItemId = (id: ItemId): number[] => {
  const parts = id.split("-")
  if (parts[0] !== "item") return []
  return parts.slice(1).map(Number)
}

interface SortableItemProps {
  item: NavigationItem
  path: number[]
  handleItemChange: (path: number[], field: keyof NavigationItem, value: string) => void
  handleRemoveItem: (path: number[]) => void
  handleAddItemAtSameLevel: (path: number[]) => void
  handleAddSubmenu: (path: number[]) => void
  handlePromoteItem: (path: number[]) => void
  handleDemoteItem: (path: number[]) => void
  handleMoveUp: (path: number[]) => void
  handleMoveDown: (path: number[]) => void
  isRemoveDisabled: boolean
  canPromote: boolean
  canDemote: boolean
  canMoveUp: boolean
  canMoveDown: boolean
}

function SortableItem({
  item,
  path,
  handleItemChange,
  handleRemoveItem,
  handleAddItemAtSameLevel,
  handleAddSubmenu,
  handlePromoteItem,
  handleDemoteItem,
  handleMoveUp,
  handleMoveDown,
  isRemoveDisabled,
  canPromote,
  canDemote,
  canMoveUp,
  canMoveDown,
}: SortableItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const itemId = createItemId(path)
  const level = path.length - 1
  const hasChildren = item.children && item.children.length > 0

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: itemId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div className="space-y-2">
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "flex items-center gap-2 rounded-md border p-2",
          isDragging ? "z-10 bg-muted opacity-80 shadow-md" : "",
          level > 0 ? `ml-${level * 6}` : "",
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

        {hasChildren && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}

        {!hasChildren && <div className="w-8" />}

        <div className="grid flex-1 grid-cols-2 gap-3">
          <Input
            placeholder="Menu Item Name"
            value={item.name}
            onChange={(e) => handleItemChange(path, "name", e.target.value)}
            required
          />
          <Input
            placeholder="URL (e.g., /about)"
            value={item.href}
            onChange={(e) => handleItemChange(path, "href", e.target.value)}
            required
          />
        </div>

        <div className="flex gap-1">
          {/* Move Up button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handleMoveUp(path)}
            disabled={!canMoveUp}
            title="Move item up"
            className={cn(!canMoveUp && "opacity-50")}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>

          {/* Move Down button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handleMoveDown(path)}
            disabled={!canMoveDown}
            title="Move item down"
            className={cn(!canMoveDown && "opacity-50")}
          >
            <ChevronDownIcon className="h-4 w-4" />
          </Button>

          {/* Promote button (move left/up a level) */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handlePromoteItem(path)}
            disabled={!canPromote}
            title="Promote item (move up a level)"
            className={cn(!canPromote && "opacity-50")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {/* Demote button (move right/down a level) */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handleDemoteItem(path)}
            disabled={!canDemote}
            title="Demote item (move down a level)"
            className={cn(!canDemote && "opacity-50")}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>

          {/* Add item at same level button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handleAddItemAtSameLevel(path)}
            title="Add new item at same level"
          >
            <Plus className="h-4 w-4" />
          </Button>

          {/* Remove button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handleRemoveItem(path)}
            disabled={isRemoveDisabled}
            title="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Render children if expanded */}
      {hasChildren && isExpanded && (
        <SortableChildren
          items={item.children}
          parentPath={path}
          handleItemChange={handleItemChange}
          handleRemoveItem={handleRemoveItem}
          handleAddItemAtSameLevel={handleAddItemAtSameLevel}
          handleAddSubmenu={handleAddSubmenu}
          handlePromoteItem={handlePromoteItem}
          handleDemoteItem={handleDemoteItem}
          handleMoveUp={handleMoveUp}
          handleMoveDown={handleMoveDown}
        />
      )}
    </div>
  )
}

interface SortableChildrenProps {
  items: NavigationItem[]
  parentPath: number[]
  handleItemChange: (path: number[], field: keyof NavigationItem, value: string) => void
  handleRemoveItem: (path: number[]) => void
  handleAddItemAtSameLevel: (path: number[]) => void
  handleAddSubmenu: (path: number[]) => void
  handlePromoteItem: (path: number[]) => void
  handleDemoteItem: (path: number[]) => void
  handleMoveUp: (path: number[]) => void
  handleMoveDown: (path: number[]) => void
}

function SortableChildren({
  items,
  parentPath,
  handleItemChange,
  handleRemoveItem,
  handleAddItemAtSameLevel,
  handleAddSubmenu,
  handlePromoteItem,
  handleDemoteItem,
  handleMoveUp,
  handleMoveDown,
}: SortableChildrenProps) {
  // Create sortable IDs for this level
  const sortableIds = items.map((_, index) => createItemId([...parentPath, index]))

  return (
    <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
      <div className="ml-8 space-y-2">
        {items.map((item, index) => {
          const itemPath = [...parentPath, index]
          return (
            <SortableItem
              key={createItemId(itemPath)}
              item={item}
              path={itemPath}
              handleItemChange={handleItemChange}
              handleRemoveItem={handleRemoveItem}
              handleAddItemAtSameLevel={handleAddItemAtSameLevel}
              handleAddSubmenu={handleAddSubmenu}
              handlePromoteItem={handlePromoteItem}
              handleDemoteItem={handleDemoteItem}
              handleMoveUp={handleMoveUp}
              handleMoveDown={handleMoveDown}
              isRemoveDisabled={false}
              canPromote={true} // Submenu items can always be promoted
              canDemote={index > 0} // Can demote if not the first item at this level
              canMoveUp={index > 0} // Can move up if not the first item
              canMoveDown={index < items.length - 1} // Can move down if not the last item
            />
          )
        })}
      </div>
    </SortableContext>
  )
}

interface AdminNavigationProps {
  initialNavItems: NavigationItem[]
  onUpdate?: (navItems: NavigationItem[]) => void
}

export function AdminNavigation({ initialNavItems, onUpdate }: AdminNavigationProps) {
  const [navItems, setNavItems] = useState<NavigationItem[]>(initialNavItems)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<NavigationItem | null>(null)

  // Update local state when initialNavItems change
  useEffect(() => {
    setNavItems(initialNavItems)
  }, [initialNavItems])

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

  // Helper function to get an item at a specific path
  const getItemAtPath = useCallback(
    (path: number[]): NavigationItem | null => {
      if (path.length === 0) return null

      try {
        let current: NavigationItem | undefined = navItems[path[0]]
        for (let i = 1; i < path.length; i++) {
          if (!current || !current.children) return null
          current = current.children[path[i]]
          if (!current) return null
        }
        return current || null
      } catch (error) {
        console.error("Error getting item at path:", error)
        return null
      }
    },
    [navItems],
  )

  // Helper function to update the navigation tree
  const updateNavigationTree = useCallback(
    (updater: (items: NavigationItem[]) => NavigationItem[]) => {
      const updatedItems = updater([...navItems])
      setNavItems(updatedItems)
      if (onUpdate) onUpdate(updatedItems)
    },
    [navItems, onUpdate],
  )

  // Helper function to update an item at a specific path
  const updateItemAtPath = useCallback(
    (path: number[], updater: (item: NavigationItem) => NavigationItem) => {
      if (path.length === 0) return

      updateNavigationTree((items) => {
        const result = [...items]

        if (path.length === 1) {
          result[path[0]] = updater(result[path[0]])
          return result
        }

        // For nested items, we need to traverse the tree
        const updateNestedItem = (currentItems: NavigationItem[], currentPath: number[]): NavigationItem[] => {
          if (currentPath.length === 1) {
            const index = currentPath[0]
            if (index >= 0 && index < currentItems.length) {
              const updatedItems = [...currentItems]
              updatedItems[index] = updater(updatedItems[index])
              return updatedItems
            }
            return currentItems
          }

          const index = currentPath[0]
          if (index >= 0 && index < currentItems.length) {
            const updatedItems = [...currentItems]
            const item = updatedItems[index]
            if (item.children) {
              updatedItems[index] = {
                ...item,
                children: updateNestedItem(item.children, currentPath.slice(1)),
              }
            }
            return updatedItems
          }
          return currentItems
        }

        return updateNestedItem(result, path)
      })
    },
    [updateNavigationTree],
  )

  // Helper function to remove an item at a specific path
  const removeItemAtPath = useCallback(
    (path: number[]) => {
      if (path.length === 0) return

      updateNavigationTree((items) => {
        if (path.length === 1) {
          return items.filter((_, i) => i !== path[0])
        }

        // For nested items, we need to traverse the tree
        const removeNestedItem = (currentItems: NavigationItem[], currentPath: number[]): NavigationItem[] => {
          if (currentPath.length === 1) {
            return currentItems.filter((_, i) => i !== currentPath[0])
          }

          const index = currentPath[0]
          if (index >= 0 && index < currentItems.length) {
            const updatedItems = [...currentItems]
            const item = updatedItems[index]
            if (item.children) {
              const updatedChildren = removeNestedItem(item.children, currentPath.slice(1))
              updatedItems[index] = {
                ...item,
                children: updatedChildren.length > 0 ? updatedChildren : undefined,
              }
            }
            return updatedItems
          }
          return currentItems
        }

        return removeNestedItem(items, path)
      })
    },
    [updateNavigationTree],
  )

  // Helper function to insert an item at a specific path
  const insertItemAtPath = useCallback(
    (item: NavigationItem, targetPath: number[]) => {
      updateNavigationTree((items) => {
        if (targetPath.length === 1) {
          const result = [...items]
          result.splice(targetPath[0], 0, item)
          return result
        }

        // For nested items, we need to traverse the tree
        const insertNestedItem = (currentItems: NavigationItem[], currentPath: number[]): NavigationItem[] => {
          if (currentPath.length === 1) {
            const result = [...currentItems]
            result.splice(currentPath[0], 0, item)
            return result
          }

          const index = currentPath[0]
          if (index >= 0 && index < currentItems.length) {
            const updatedItems = [...currentItems]
            const currentItem = updatedItems[index]
            if (currentItem.children) {
              updatedItems[index] = {
                ...currentItem,
                children: insertNestedItem(currentItem.children, currentPath.slice(1)),
              }
            } else if (currentPath.length === 2 && currentPath[1] === 0) {
              // Special case: inserting as the first child of an item with no children yet
              updatedItems[index] = {
                ...currentItem,
                children: [item],
              }
            }
            return updatedItems
          }
          return currentItems
        }

        return insertNestedItem(items, targetPath)
      })
    },
    [updateNavigationTree],
  )

  // Add a new top-level item
  const handleAddItem = useCallback(() => {
    updateNavigationTree((items) => [...items, { name: "", href: "/" }])
  }, [updateNavigationTree])

  // Add a new item at the same level as the specified path
  const handleAddItemAtSameLevel = useCallback(
    (path: number[]) => {
      if (path.length === 0) return

      updateNavigationTree((items) => {
        // For top-level items
        if (path.length === 1) {
          const result = [...items]
          result.splice(path[0] + 1, 0, { name: "", href: "/" })
          return result
        }

        // For nested items
        const parentPath = path.slice(0, -1)
        const currentIndex = path[path.length - 1]

        const insertAtSameLevel = (currentItems: NavigationItem[], currentPath: number[]): NavigationItem[] => {
          if (currentPath.length === 1) {
            const index = currentPath[0]
            if (index >= 0 && index < currentItems.length) {
              const updatedItems = [...currentItems]
              const parent = updatedItems[index]

              if (parent.children) {
                updatedItems[index] = {
                  ...parent,
                  children: [
                    ...parent.children.slice(0, currentIndex + 1),
                    { name: "", href: "/" },
                    ...parent.children.slice(currentIndex + 1),
                  ],
                }
              }
              return updatedItems
            }
            return currentItems
          }

          const index = currentPath[0]
          if (index >= 0 && index < currentItems.length) {
            const updatedItems = [...currentItems]
            const item = updatedItems[index]
            if (item.children) {
              updatedItems[index] = {
                ...item,
                children: insertAtSameLevel(item.children, currentPath.slice(1)),
              }
            }
            return updatedItems
          }
          return currentItems
        }

        return insertAtSameLevel(items, parentPath)
      })
    },
    [updateNavigationTree],
  )

  // Remove an item at the specified path
  const handleRemoveItem = useCallback(
    (path: number[]) => {
      removeItemAtPath(path)
    },
    [removeItemAtPath],
  )

  // Update an item's field at the specified path
  const handleItemChange = useCallback(
    (path: number[], field: keyof NavigationItem, value: string) => {
      updateItemAtPath(path, (item) => ({ ...item, [field]: value }))
    },
    [updateItemAtPath],
  )

  // Add a submenu item to the specified path
  const handleAddSubmenu = useCallback(
    (path: number[]) => {
      updateItemAtPath(path, (item) => ({
        ...item,
        children: [...(item.children || []), { name: "", href: "/" }],
      }))
    },
    [updateItemAtPath],
  )

  // Move an item up in its current level
  const handleMoveUp = useCallback(
    (path: number[]) => {
      if (path.length === 0) return

      const index = path[path.length - 1]
      if (index === 0) return // Already at the top

      // Create a deep copy of the current navigation items
      const newNavItems = JSON.parse(JSON.stringify(navItems))

      // Function to swap items at the specified path
      const swapItems = (items: NavigationItem[], currentPath: number[]): NavigationItem[] => {
        if (currentPath.length === 1) {
          const idx = currentPath[0]
          if (idx <= 0 || idx >= items.length) return items

          // Swap with the previous item
          const result = [...items]
          const temp = result[idx]
          result[idx] = result[idx - 1]
          result[idx - 1] = temp
          return result
        }

        const idx = currentPath[0]
        if (idx >= 0 && idx < items.length) {
          const result = [...items]
          if (result[idx].children) {
            result[idx] = {
              ...result[idx],
              children: swapItems(result[idx].children!, currentPath.slice(1)),
            }
          }
          return result
        }

        return items
      }

      // Swap the item with the one above it
      const updatedItems = swapItems(newNavItems, path)

      // Update the state
      setNavItems(updatedItems)
      if (onUpdate) onUpdate(updatedItems)
    },
    [navItems, onUpdate],
  )

  // Move an item down in its current level
  const handleMoveDown = useCallback(
    (path: number[]) => {
      if (path.length === 0) return

      // Create a deep copy of the current navigation items
      const newNavItems = JSON.parse(JSON.stringify(navItems))

      // Function to get the parent array at the specified path
      const getParentArray = (items: NavigationItem[], parentPath: number[]): NavigationItem[] | null => {
        if (parentPath.length === 0) return items

        let current = items
        for (let i = 0; i < parentPath.length; i++) {
          const idx = parentPath[i]
          if (idx >= current.length || !current[idx].children) return null
          current = current[idx].children!
        }

        return current
      }

      // Get the parent path and the index of the item
      const parentPath = path.slice(0, -1)
      const index = path[path.length - 1]

      // Get the parent array
      const parentArray = getParentArray(newNavItems, parentPath)
      if (!parentArray || index >= parentArray.length - 1) return // Already at the bottom

      // Function to swap items at the specified path
      const swapItems = (items: NavigationItem[], currentPath: number[]): NavigationItem[] => {
        if (currentPath.length === 1) {
          const idx = currentPath[0]
          if (idx < 0 || idx >= items.length - 1) return items

          // Swap with the next item
          const result = [...items]
          const temp = result[idx]
          result[idx] = result[idx + 1]
          result[idx + 1] = temp
          return result
        }

        const idx = currentPath[0]
        if (idx >= 0 && idx < items.length) {
          const result = [...items]
          if (result[idx].children) {
            result[idx] = {
              ...result[idx],
              children: swapItems(result[idx].children!, currentPath.slice(1)),
            }
          }
          return result
        }

        return items
      }

      // Swap the item with the one below it
      const updatedItems = swapItems(newNavItems, path)

      // Update the state
      setNavItems(updatedItems)
      if (onUpdate) onUpdate(updatedItems)
    },
    [navItems, onUpdate],
  )

  // Promote an item up one level in the hierarchy
  const handlePromoteItem = useCallback(
    (path: number[]) => {
      if (path.length <= 1) return // Can't promote top-level items

      // Create a completely new navigation structure to avoid reference issues
      const newNavItems = JSON.parse(JSON.stringify(navItems)) as NavigationItem[]

      // Get the item to promote
      let itemToPromote: NavigationItem | null = null

      // Function to find and remove the item from its current position
      const findAndRemoveItem = (items: NavigationItem[], currentPath: number[]): NavigationItem[] => {
        if (currentPath.length === 1) {
          const index = currentPath[0]
          if (index >= 0 && index < items.length) {
            itemToPromote = items[index] // Save the item before removing
            return [...items.slice(0, index), ...items.slice(index + 1)]
          }
          return items
        }

        const index = currentPath[0]
        if (index >= 0 && index < items.length) {
          const item = items[index]
          if (item.children) {
            const updatedChildren = findAndRemoveItem(item.children, currentPath.slice(1))
            return [
              ...items.slice(0, index),
              { ...item, children: updatedChildren.length > 0 ? updatedChildren : undefined },
              ...items.slice(index + 1),
            ]
          }
        }
        return items
      }

      // Function to insert the item at its new position
      const insertItemAfterParent = (
        items: NavigationItem[],
        parentPath: number[],
        item: NavigationItem,
      ): NavigationItem[] => {
        if (parentPath.length === 0) {
          // Insert at top level after the specified index
          const parentIndex = path[path.length - 2] // Get the parent's index
          return [...items.slice(0, parentIndex + 1), item, ...items.slice(parentIndex + 1)]
        }

        const index = parentPath[0]
        if (index >= 0 && index < items.length) {
          return [
            ...items.slice(0, index),
            {
              ...items[index],
              children: insertItemAfterParent(items[index].children || [], parentPath.slice(1), item),
            },
            ...items.slice(index + 1),
          ]
        }
        return items
      }

      // Get the parent path
      const parentPath = path.slice(0, -1)
      const grandparentPath = parentPath.slice(0, -1)

      // First, find and remove the item from its current position
      let updatedItems = findAndRemoveItem(newNavItems, path)

      // If we found the item, insert it after its parent
      if (itemToPromote) {
        const parentIndex = parentPath[parentPath.length - 1]

        if (grandparentPath.length === 0) {
          // Insert at top level
          updatedItems.splice(parentIndex + 1, 0, itemToPromote)
        } else {
          // Insert at the appropriate nested level
          updatedItems = insertItemAfterParent(updatedItems, grandparentPath, itemToPromote)
        }

        // Update the state with the new structure
        setNavItems(updatedItems)
        if (onUpdate) onUpdate(updatedItems)
      }
    },
    [navItems, onUpdate],
  )

  // Demote an item to become a child of the previous sibling
  const handleDemoteItem = useCallback(
    (path: number[]) => {
      const index = path[path.length - 1]
      if (index === 0) return // Can't demote the first item at any level

      // Create a deep copy of the current navigation items
      const newNavItems = JSON.parse(JSON.stringify(navItems))

      // Get the item to be demoted
      const getItem = (items: NavigationItem[], itemPath: number[]): NavigationItem | null => {
        if (itemPath.length === 0) return null

        let current = items
        let itemRef: NavigationItem | null = null

        for (let i = 0; i < itemPath.length; i++) {
          const idx = itemPath[i]
          if (idx >= current.length) return null

          if (i === itemPath.length - 1) {
            itemRef = current[idx]
          } else {
            if (!current[idx].children) return null
            current = current[idx].children!
          }
        }

        return itemRef
      }

      // Get the previous sibling's path
      const siblingPath = [...path.slice(0, -1), index - 1]

      // Get the item to demote and the previous sibling
      const itemToDemote = getItem(newNavItems, path)
      const previousSibling = getItem(newNavItems, siblingPath)

      if (!itemToDemote || !previousSibling) return

      // Remove the item from its current position
      const removeItem = (items: NavigationItem[], itemPath: number[]): NavigationItem[] => {
        if (itemPath.length === 1) {
          return [...items.slice(0, itemPath[0]), ...items.slice(itemPath[0] + 1)]
        }

        const idx = itemPath[0]
        const newItems = [...items]
        newItems[idx] = {
          ...newItems[idx],
          children: removeItem(newItems[idx].children || [], itemPath.slice(1)),
        }

        return newItems
      }

      // First remove the item
      let updatedItems = removeItem(newNavItems, path)

      // Then add it as a child of the previous sibling
      const addToSibling = (items: NavigationItem[], sibPath: number[], item: NavigationItem): NavigationItem[] => {
        if (sibPath.length === 1) {
          const sibIdx = sibPath[0]
          const newItems = [...items]
          newItems[sibIdx] = {
            ...newItems[sibIdx],
            children: [...(newItems[sibIdx].children || []), item],
          }
          return newItems
        }

        const idx = sibPath[0]
        const newItems = [...items]
        newItems[idx] = {
          ...newItems[idx],
          children: addToSibling(newItems[idx].children || [], sibPath.slice(1), item),
        }

        return newItems
      }

      // Add the item to the previous sibling
      updatedItems = addToSibling(updatedItems, siblingPath, itemToDemote)

      // Update the state
      setNavItems(updatedItems)
      if (onUpdate) onUpdate(updatedItems)
    },
    [navItems, onUpdate],
  )

  // Handle drag start event
  const handleDragStart = useCallback(
    (event: { active: { id: string } }) => {
      const path = parseItemId(event.active.id as string)
      const item = getItemAtPath(path)
      setActiveId(event.active.id as string)
      if (item) {
        setDraggedItem(JSON.parse(JSON.stringify(item))) // Deep clone the item
      }
    },
    [getItemAtPath],
  )

  // Handle drag end event
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      // Clear drag state
      setActiveId(null)

      if (!over || active.id === over.id) {
        setDraggedItem(null)
        return
      }

      const sourcePath = parseItemId(active.id as string)
      const destinationPath = parseItemId(over.id as string)

      if (sourcePath.length === 0 || destinationPath.length === 0) {
        setDraggedItem(null)
        return
      }

      // Check if we're trying to move an item into its own descendant
      let isDescendant = false
      if (sourcePath.length < destinationPath.length) {
        isDescendant = sourcePath.every((value, index) => destinationPath[index] === value)
      }

      if (isDescendant) {
        toast({
          title: "Invalid Move",
          description: "Cannot move an item into its own descendant",
          variant: "destructive",
        })
        setDraggedItem(null)
        return
      }

      // Get the item being dragged (use the stored draggedItem to avoid reference issues)
      if (!draggedItem) {
        setDraggedItem(null)
        return
      }

      // Instead of trying to adjust indices, we'll use a more direct approach
      // We'll create a completely new navigation structure by:
      // 1. Creating a deep copy of the current structure
      // 2. Removing the source item
      // 3. Inserting it at the exact destination position

      // Create a deep copy of the current navigation items
      const newNavItems = JSON.parse(JSON.stringify(navItems)) as NavigationItem[]

      // Get the source item (we already have it in draggedItem)
      // Remove the source item from its current position
      const removeSourceItem = (items: NavigationItem[], path: number[]): NavigationItem[] => {
        if (path.length === 1) {
          return [...items.slice(0, path[0]), ...items.slice(path[0] + 1)]
        }

        const index = path[0]
        if (index >= 0 && index < items.length) {
          const updatedItems = [...items]
          const item = updatedItems[index]
          if (item.children) {
            updatedItems[index] = {
              ...item,
              children: removeSourceItem(item.children, path.slice(1)),
            }
          }
          return updatedItems
        }
        return items
      }

      // Insert the item at the destination position
      const insertAtDestination = (items: NavigationItem[], path: number[], item: NavigationItem): NavigationItem[] => {
        if (path.length === 1) {
          const result = [...items]
          // Insert exactly at the specified position
          result.splice(path[0], 0, item)
          return result
        }

        const index = path[0]
        if (index >= 0 && index < items.length) {
          const updatedItems = [...items]
          const currentItem = updatedItems[index]
          if (currentItem.children) {
            updatedItems[index] = {
              ...currentItem,
              children: insertAtDestination(currentItem.children, path.slice(1), item),
            }
          } else if (path.length === 2 && path[1] === 0) {
            // Special case: inserting as the first child of an item with no children yet
            updatedItems[index] = {
              ...currentItem,
              children: [item],
            }
          }
          return updatedItems
        }
        return items
      }

      // First remove the source item
      let updatedItems = removeSourceItem(newNavItems, sourcePath)

      // Then insert it at the destination
      updatedItems = insertAtDestination(updatedItems, destinationPath, draggedItem)

      // Update state with the new structure
      setNavItems(updatedItems)
      if (onUpdate) onUpdate(updatedItems)

      // Clear the dragged item
      setDraggedItem(null)
    },
    [draggedItem, navItems, onUpdate, getItemAtPath],
  )

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await updateNavigation(navItems)

      if (result.success) {
        toast({
          title: "Success",
          description: "Navigation items updated successfully",
        })
      } else {
        throw new Error(result.error || "Failed to update navigation")
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

  // Create sortable IDs for the top level
  const topLevelIds = navItems.map((_, index) => createItemId([index]))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Navigation Menu</CardTitle>
        <CardDescription>
          Edit the main navigation menu items. Use the arrow buttons to reorder or move items between levels.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={topLevelIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {navItems.map((item, index) => (
                  <SortableItem
                    key={createItemId([index])}
                    item={item}
                    path={[index]}
                    handleItemChange={handleItemChange}
                    handleRemoveItem={handleRemoveItem}
                    handleAddItemAtSameLevel={handleAddItemAtSameLevel}
                    handleAddSubmenu={handleAddSubmenu}
                    handlePromoteItem={handlePromoteItem}
                    handleDemoteItem={handleDemoteItem}
                    handleMoveUp={handleMoveUp}
                    handleMoveDown={handleMoveDown}
                    isRemoveDisabled={navItems.length <= 1}
                    canPromote={false} // Top-level items can't be promoted
                    canDemote={index > 0} // Can demote if not the first item
                    canMoveUp={index > 0} // Can move up if not the first item
                    canMoveDown={index < navItems.length - 1} // Can move down if not the last item
                  />
                ))}
              </div>
            </SortableContext>

            {/* Drag overlay for visual feedback */}
            <DragOverlay>
              {activeId && draggedItem && (
                <div className="rounded-md border bg-white p-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <div className="font-medium">{draggedItem.name || "Untitled Item"}</div>
                  </div>
                </div>
              )}
            </DragOverlay>
          </DndContext>

          <Button type="button" variant="outline" className="mt-4" onClick={handleAddItem}>
            <Plus className="mr-2 h-4 w-4" /> Add Menu Item
          </Button>
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
