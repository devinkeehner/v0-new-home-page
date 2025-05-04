"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { NavigationItem } from "@/lib/kv-content-manager"

interface HeaderProps {
  navItems: NavigationItem[]
}

export function Header({ navItems }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdowns, setActiveDropdowns] = useState<string[]>([])
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (activeDropdowns.length > 0) {
        let shouldCloseAll = true

        for (const dropdownId of activeDropdowns) {
          const dropdownElement = dropdownRefs.current[dropdownId]
          if (dropdownElement && dropdownElement.contains(event.target as Node)) {
            shouldCloseAll = false
            break
          }
        }

        if (shouldCloseAll) {
          setActiveDropdowns([])
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeDropdowns])

  const toggleDropdown = (path: string) => {
    setActiveDropdowns((current) => {
      if (current.includes(path)) {
        return current.filter((id) => id !== path)
      } else {
        return [...current, path]
      }
    })
  }

  const isDropdownActive = (path: string) => {
    return activeDropdowns.includes(path) || activeDropdowns.some((id) => id.startsWith(`${path}-`))
  }

  const renderDesktopNavItem = (item: NavigationItem, path = "") => {
    const hasChildren = item.children && item.children.length > 0
    const currentPath = path ? `${path}-${item.name}` : item.name
    const isActive = isDropdownActive(currentPath)

    if (!hasChildren) {
      return (
        <Link
          key={currentPath}
          href={item.href}
          className="text-sm font-medium transition-colors hover:text-secondary-red"
        >
          {item.name}
        </Link>
      )
    }

    return (
      <div
        key={currentPath}
        className="relative"
        ref={(el) => (dropdownRefs.current[currentPath] = el)}
        onMouseEnter={() => setActiveDropdowns((prev) => [...prev, currentPath])}
        onMouseLeave={() => setActiveDropdowns((prev) => prev.filter((id) => id !== currentPath))}
      >
        <button
          className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-secondary-red"
          onClick={() => toggleDropdown(currentPath)}
          aria-expanded={isActive}
        >
          {item.name}
          <ChevronDown className={cn("h-4 w-4 transition-transform", isActive ? "rotate-180" : "")} />
        </button>

        {isActive && (
          <div className="absolute left-0 top-full z-10 mt-1 min-w-[200px] rounded-md border bg-white py-1 shadow-lg">
            {item.children.map((child) => {
              const childHasChildren = child.children && child.children.length > 0
              const childPath = `${currentPath}-${child.name}`

              if (!childHasChildren) {
                return (
                  <Link
                    key={childPath}
                    href={child.href}
                    className="block px-4 py-2 text-sm hover:bg-muted hover:text-secondary-red"
                    onClick={() => setActiveDropdowns([])}
                  >
                    {child.name}
                  </Link>
                )
              }

              return (
                <div key={childPath} className="relative" ref={(el) => (dropdownRefs.current[childPath] = el)}>
                  <button
                    className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-muted hover:text-secondary-red"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleDropdown(childPath)
                    }}
                  >
                    {child.name}
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {isDropdownActive(childPath) && (
                    <div className="absolute left-full top-0 z-10 min-w-[200px] rounded-md border bg-white py-1 shadow-lg">
                      {child.children.map((grandchild) => (
                        <Link
                          key={`${childPath}-${grandchild.name}`}
                          href={grandchild.href}
                          className="block px-4 py-2 text-sm hover:bg-muted hover:text-secondary-red"
                          onClick={() => setActiveDropdowns([])}
                        >
                          {grandchild.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const renderMobileNavItem = (item: NavigationItem, depth = 0, path = "") => {
    const hasChildren = item.children && item.children.length > 0
    const currentPath = path ? `${path}-${item.name}` : item.name
    const isActive = isDropdownActive(currentPath)

    return (
      <div key={currentPath} className={cn(depth > 0 ? "ml-4" : "")}>
        {!hasChildren ? (
          <Link
            href={item.href}
            className="block rounded-md px-3 py-2 text-base font-medium text-primary-navy hover:bg-muted"
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.name}
          </Link>
        ) : (
          <>
            <button
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-primary-navy hover:bg-muted"
              onClick={() => toggleDropdown(currentPath)}
            >
              {item.name}
              <ChevronDown className={cn("h-4 w-4 transition-transform", isActive ? "rotate-180" : "")} />
            </button>

            {isActive && (
              <div className="mt-1 space-y-1">
                {item.children.map((child) => renderMobileNavItem(child, depth + 1, currentPath))}
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image
              src="/images/ct-house-gop-logo.jpg"
              alt="Connecticut House Republicans"
              width={200}
              height={50}
              className="h-14 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
          {navItems.map((item) => renderDesktopNavItem(item))}
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span className="sr-only">Open main menu</span>
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div className={cn("md:hidden", mobileMenuOpen ? "block" : "hidden")}>
        <div className="space-y-1 px-4 pb-3 pt-2">{navItems.map((item) => renderMobileNavItem(item))}</div>
      </div>
    </header>
  )
}
