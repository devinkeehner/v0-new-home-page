"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, ChevronDown, ChevronRight, ChevronLeft, Facebook, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { XIcon } from "./icons/x-icon"
import { FlickrIcon } from "./icons/flickr-icon"

// Social media links
const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/pages/Connecticut-House-Republicans/117202885876",
    icon: Facebook,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/user/CTHouseRepublicans",
    icon: Youtube,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/cthousegop/",
    icon: Instagram,
  },
  {
    name: "X",
    href: "https://x.com/cthousegop",
    icon: XIcon,
  },
  {
    name: "Flickr",
    href: "https://www.flickr.com/photos/cthouserepublicans/",
    icon: FlickrIcon,
  },
]

// Restructured navigation items based on the new requirements
const navItems = [
  {
    name: "Contact",
    href: "#",
    children: [
      { name: "Contact Us", href: "/contact" },
      { name: "Media Inquiries", href: "/communications-contacts" },
    ],
  },
  {
    name: "Representatives",
    href: "#",
    children: [
      { name: "Leadership Team", href: "/leadership-team" },
      { name: "Caucus Members", href: "/caucus-members" },
      { name: "Find a Legislator", href: "https://www.cga.ct.gov/asp/menu/CGAFindLeg.asp" },
    ],
  },
  { name: "Newsroom", href: "/newsroom" },
  {
    name: "Legislation",
    href: "#",
    children: [
      { name: "Bill & Document Search", href: "https://search.cga.state.ct.us/r/basic/" },
      { name: "Bill Information Search", href: "https://www.cga.ct.gov/asp/CGABillInfo/CGABillInfoRequest.asp" },
      { name: "Legislative Committees", href: "https://www.cga.ct.gov/asp/menu/cgacommittees.asp" },
      { name: "Legislative Terms & Definitions", href: "https://www.cga.ct.gov/asp/content/Terms.asp" },
      { name: "Office of Legislative Research", href: "https://www.cga.ct.gov/olr/" },
      { name: "Browse State Statutes", href: "https://www.cga.ct.gov/current/pub/titles.htm" },
      { name: "How a Bill Becomes a Law", href: "https://www.cga.ct.gov/html/bill.pdf" },
    ],
  },
  {
    name: "Resources",
    href: "#",
    children: [
      {
        name: "Caucus Resources",
        href: "#",
        children: [
          { name: "Leadership Team", href: "/leadership-team" },
          { name: "House Republicans", href: "/" },
          { name: "Caucus Newsroom", href: "/newsroom" },
          { name: "Media Inquiries", href: "/contact" }, // Kept in Resources submenu
        ],
      },
      {
        name: "Legislative Resources",
        href: "#",
        children: [
          { name: "Bill & Document Search", href: "https://search.cga.state.ct.us/r/basic/" },
          { name: "Bill Information Search", href: "https://www.cga.ct.gov/asp/CGABillInfo/CGABillInfoRequest.asp" },
          { name: "Legislative Committees", href: "https://www.cga.ct.gov/asp/menu/cgacommittees.asp" },
          { name: "Legislative Terms & Definitions", href: "https://www.cga.ct.gov/asp/content/Terms.asp" },
          { name: "Office of Legislative Research", href: "https://www.cga.ct.gov/olr/" },
          { name: "Find a Legislator", href: "https://www.cga.ct.gov/asp/menu/CGAFindLeg.asp" },
          { name: "Connecticut General Assembly", href: "https://www.cga.ct.gov" },
          { name: "Browse State Statutes", href: "https://www.cga.ct.gov/current/pub/titles.htm" },
          { name: "How a Bill Becomes a Law", href: "https://www.cga.ct.gov/html/bill.pdf" },
        ],
      },
      {
        name: "Documents & Surveys",
        href: "#",
        children: [
          {
            name: "OLR Major Public Acts 2023",
            href: "https://www.cga.ct.gov/olr/Documents/year/MA/2023MA-20230620_Major%20Acts%20for%202023.pdf",
          },
          {
            name: "OLR Major Issues Report 2024",
            href: "https://www.cthousegop.com/wp-content/uploads/2024/02/2024-R-0002.pdf",
          },
        ],
      },
      {
        name: "Government",
        href: "#",
        children: [
          {
            name: "Departments & Agencies",
            href: "https://portal.ct.gov/en/Government/Departments-and-Agencies/Departments-and-Agencies",
          },
          { name: "Governor's Office", href: "https://portal.ct.gov/governor" },
          { name: "State Budget", href: "https://openbudget.ct.gov/#!/year/default" },
          { name: "State Checkbook", href: "https://opencheckbook.ct.gov/#!/year/2023/" },
        ],
      },
      {
        name: "Citizen Guide",
        href: "#",
        children: [
          { name: "2021 Redistricting Project", href: "https://cga.ct.gov/red" },
          { name: "About Connecticut", href: "https://portal.ct.gov/en/About" },
          { name: "How to Testify", href: "https://www.cga.ct.gov/asp/content/yourvoice.asp" },
        ],
      },
    ],
  },
]

export function Header() {
  const [activeDropdowns, setActiveDropdowns] = useState<string[]>([])
  const [sheetActiveDropdowns, setSheetActiveDropdowns] = useState<string[]>([])
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const timeoutRef = useRef<{ [key: string]: NodeJS.Timeout | null }>({})
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)

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
      // Clear any remaining timeouts
      Object.values(timeoutRef.current).forEach((timeout) => {
        if (timeout) clearTimeout(timeout)
      })
    }
  }, [activeDropdowns])

  const toggleDropdown = (path: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }

    setActiveDropdowns((current) => {
      // Check if this path is already active
      if (current.includes(path)) {
        // If active, remove it and its children
        return current.filter((id) => id !== path && !id.startsWith(`${path}-`))
      } else {
        // If not active, add it
        return [...current, path]
      }
    })
  }

  const toggleSheetDropdown = (path: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }

    setSheetActiveDropdowns((current) => {
      // Check if this path is already active
      if (current.includes(path)) {
        // If active, remove it and its children
        return current.filter((id) => id !== path && !id.startsWith(`${path}-`))
      } else {
        // If not active, add it
        return [...current, path]
      }
    })
  }

  const isDropdownActive = (path: string) => {
    return activeDropdowns.includes(path) || activeDropdowns.some((id) => id.startsWith(`${path}-`))
  }

  const isSheetDropdownActive = (path: string) => {
    return sheetActiveDropdowns.includes(path) || sheetActiveDropdowns.some((id) => id.startsWith(`${path}-`))
  }

  const handleMouseEnter = (path: string) => {
    // Clear any existing timeout for this path
    if (timeoutRef.current[path]) {
      clearTimeout(timeoutRef.current[path]!)
      timeoutRef.current[path] = null
    }

    // Close any sibling dropdowns at the same level
    setActiveDropdowns((prev) => {
      const pathParts = path.split("-")
      const parentPath = pathParts.slice(0, -1).join("-")

      // Filter out siblings but keep the parent and other branches
      const filtered = prev.filter((id) => {
        // Keep if it's not related to this level
        if (!id.includes(parentPath)) return true

        // Keep parent
        if (id === parentPath) return true

        // Keep if it's this path or its children
        if (id === path || id.startsWith(`${path}-`)) return true

        // Otherwise, it's a sibling or sibling's child - remove it
        return false
      })

      // Add this path if it's not already there
      if (!filtered.includes(path)) {
        return [...filtered, path]
      }
      return filtered
    })
  }

  const handleMouseLeave = (path: string) => {
    // Set a timeout before removing the dropdown
    timeoutRef.current[path] = setTimeout(() => {
      setActiveDropdowns((prev) => prev.filter((id) => id !== path && !id.startsWith(`${path}-`)))
      timeoutRef.current[path] = null
    }, 300) // 300ms delay before closing
  }

  // Determine if a menu should open to the left instead of right
  const shouldOpenLeft = (itemName: string) => {
    return itemName === "Resources"
  }

  const renderDesktopNavItem = (item: any, path = "") => {
    const hasChildren = item.children && item.children.length > 0
    const currentPath = path ? `${path}-${item.name}` : item.name
    const isActive = isDropdownActive(currentPath)
    const openLeft = shouldOpenLeft(item.name)

    if (!hasChildren) {
      return (
        <Link
          key={currentPath}
          href={item.href}
          className="text-sm font-medium transition-colors hover:text-secondary-red"
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
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
        onMouseEnter={() => handleMouseEnter(currentPath)}
        onMouseLeave={() => handleMouseLeave(currentPath)}
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
          <div
            className="absolute left-0 top-full z-10 mt-1 min-w-[200px] rounded-md border bg-white py-1 shadow-lg"
            onMouseEnter={() => handleMouseEnter(currentPath)}
            onMouseLeave={() => handleMouseLeave(currentPath)}
          >
            {item.children.map((child: any) => {
              const childHasChildren = child.children && child.children.length > 0
              const childPath = `${currentPath}-${child.name}`

              if (!childHasChildren) {
                return (
                  <Link
                    key={childPath}
                    href={child.href}
                    className="block px-4 py-2 text-sm hover:bg-muted hover:text-secondary-red"
                    onClick={() => setActiveDropdowns([])}
                    target={child.href.startsWith("http") ? "_blank" : undefined}
                    rel={child.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {child.name}
                  </Link>
                )
              }

              return (
                <div
                  key={childPath}
                  className="relative"
                  ref={(el) => (dropdownRefs.current[childPath] = el)}
                  onMouseEnter={() => handleMouseEnter(childPath)}
                  onMouseLeave={() => handleMouseLeave(childPath)}
                >
                  <button
                    className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-muted hover:text-secondary-red"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleDropdown(childPath)
                    }}
                  >
                    {child.name}
                    {openLeft ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>

                  {isDropdownActive(childPath) && (
                    <div
                      className={cn(
                        "absolute top-0 z-10 min-w-[200px] rounded-md border bg-white py-1 shadow-lg",
                        openLeft ? "right-full" : "left-full",
                      )}
                      onMouseEnter={() => handleMouseEnter(childPath)}
                      onMouseLeave={() => handleMouseLeave(childPath)}
                    >
                      {child.children.map((grandchild: any) => (
                        <Link
                          key={`${childPath}-${grandchild.name}`}
                          href={grandchild.href}
                          className="block px-4 py-2 text-sm hover:bg-muted hover:text-secondary-red"
                          onClick={() => setActiveDropdowns([])}
                          target={grandchild.href.startsWith("http") ? "_blank" : undefined}
                          rel={grandchild.href.startsWith("http") ? "noopener noreferrer" : undefined}
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

  // Sheet navigation item renderer
  const renderSheetNavItem = (item: any, path = "", depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const currentPath = path ? `${path}-${item.name}` : item.name
    const isActive = isSheetDropdownActive(currentPath)

    if (!hasChildren) {
      return (
        <Link
          key={currentPath}
          href={item.href}
          className={cn(
            "block py-2 text-base font-medium text-primary-navy hover:text-secondary-red",
            depth === 0 ? "border-b border-gray-200" : "",
            depth === 1 ? "pl-4" : "",
            depth === 2 ? "pl-8" : "",
            depth === 3 ? "pl-12" : "",
          )}
          onClick={() => setMobileMenuOpen(false)}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {item.name}
        </Link>
      )
    }

    return (
      <div key={currentPath} className={cn(depth === 0 ? "border-b border-gray-200" : "")}>
        <button
          className={cn(
            "flex w-full items-center justify-between py-2 text-base font-medium text-primary-navy hover:text-secondary-red",
            depth === 1 ? "pl-4" : "",
            depth === 2 ? "pl-8" : "",
            depth === 3 ? "pl-12" : "",
          )}
          onClick={() => toggleSheetDropdown(currentPath)}
          aria-expanded={isActive}
        >
          {item.name}
          <ChevronDown className={cn("h-4 w-4 transition-transform", isActive ? "rotate-180" : "")} />
        </button>

        {isActive && (
          <div className={cn("py-1", depth === 0 ? "" : "")}>
            {item.children.map((child: any) => renderSheetNavItem(child, currentPath, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex flex-col h-auto md:h-24">
        {/* Top row with logo and menu button */}
        <div className="flex justify-between items-center py-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-14 w-[240px]">
              {/* Placeholder for logo while loading */}
              {!logoLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse rounded"></div>}
              <Image
                src="https://www.cthousegop.com/wp-content/uploads/2025/05/ct_house_gop_logo-e1746997158682.webp"
                alt="Connecticut House Republicans"
                width={240}
                height={56}
                className={cn(
                  "h-auto w-auto transition-opacity duration-300",
                  logoLoaded ? "opacity-100" : "opacity-0",
                )}
                onLoad={() => setLogoLoaded(true)}
                loading="lazy"
                priority={false}
                unoptimized={true}
              />
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost">
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <div className="py-4">
                  <Link href="/" className="mb-6 flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                    <div className="relative h-10 w-[170px]">
                      <Image
                        src="https://www.cthousegop.com/wp-content/uploads/2025/05/ct_house_gop_logo-e1746997158682.webp"
                        alt="Connecticut House Republicans"
                        width={170}
                        height={40}
                        className="h-auto w-auto"
                        loading="lazy"
                        unoptimized={true}
                      />
                    </div>
                  </Link>

                  {/* Sheet Navigation */}
                  <div className="mt-6 space-y-1">{navItems.map((item) => renderSheetNavItem(item))}</div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Social Icons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-navy hover:text-secondary-red transition-colors"
                aria-label={link.name}
              >
                <link.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
        {/* Social Icons Row - Mobile Only */}
        <div className="md:hidden flex justify-center py-2 border-t border-gray-100">
          <div className="flex items-center justify-center space-x-5">
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-navy hover:text-secondary-red transition-colors"
                aria-label={link.name}
              >
                <link.icon className="h-6 w-6" />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom row with navigation - Desktop Only */}
        <nav className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6 mt-auto pb-2 justify-end">
          {navItems.map((item) => renderDesktopNavItem(item))}
        </nav>
      </div>
    </header>
  )
}
