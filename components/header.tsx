"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Structured navigation items based on the provided content
const navItems = [
  { name: "Home", href: "/" },
  {
    name: "Representatives",
    href: "/representatives",
    children: [
      { name: "Leadership Team", href: "https://www.cthousegop.com/leadership-team-2023/" },
      { name: "Find a Legislator", href: "https://www.cga.ct.gov/asp/menu/CGAFindLeg.asp" },
    ],
  },
  {
    name: "Newsroom",
    href: "/newsroom",
    children: [
      { name: "Caucus Newsroom", href: "https://www.cthousegop.com/caucus-newsroom/" },
      { name: "Media Inquiries", href: "https://www.cthousegop.com/communications-contacts/" },
    ],
  },
  {
    name: "Legislation",
    href: "/legislation",
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
    href: "/resources",
    children: [
      {
        name: "Caucus Resources",
        href: "#",
        children: [
          { name: "Leadership Team", href: "https://www.cthousegop.com/leadership-team-2023/" },
          { name: "House Republicans", href: "https://www.cthousegop.com" },
          { name: "Caucus Newsroom", href: "https://www.cthousegop.com/caucus-newsroom/" },
          { name: "Media Inquiries", href: "https://www.cthousegop.com/communications-contacts/" },
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
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [activeDropdowns, setActiveDropdowns] = useState<string[]>([])
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const timeoutRef = useRef<{ [key: string]: NodeJS.Timeout | null }>({})

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

  const handleMouseEnter = (path: string) => {
    // Clear any existing timeout for this path
    if (timeoutRef.current[path]) {
      clearTimeout(timeoutRef.current[path]!)
      timeoutRef.current[path] = null
    }

    // Add this path to active dropdowns
    setActiveDropdowns((prev) => {
      if (!prev.includes(path)) {
        return [...prev, path]
      }
      return prev
    })
  }

  const handleMouseLeave = (path: string) => {
    // Set a timeout before removing the dropdown
    timeoutRef.current[path] = setTimeout(() => {
      setActiveDropdowns((prev) => prev.filter((id) => id !== path))
      timeoutRef.current[path] = null
    }, 500) // 500ms delay before closing
  }

  const renderDesktopNavItem = (item: any, path = "") => {
    const hasChildren = item.children && item.children.length > 0
    const currentPath = path ? `${path}-${item.name}` : item.name
    const isActive = isDropdownActive(currentPath)

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
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {isDropdownActive(childPath) && (
                    <div
                      className="absolute left-full top-0 z-10 min-w-[200px] rounded-md border bg-white py-1 shadow-lg"
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

  const renderMobileNavItem = (item: any, depth = 0, path = "") => {
    const hasChildren = item.children && item.children.length > 0
    const currentPath = path ? `${path}-${item.name}` : item.name
    const isActive = isDropdownActive(currentPath)

    return (
      <div key={currentPath} className={cn(depth > 0 ? "ml-4" : "")}>
        {!hasChildren ? (
          <Link
            href={item.href}
            className="block rounded-md px-3 py-2 text-base font-medium text-primary-navy hover:bg-muted"
            onClick={() => setActiveDropdowns([])}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
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
                {item.children.map((child: any) => renderMobileNavItem(child, depth + 1, currentPath))}
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

        {/* Mobile Menu Button with Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="py-4">
              <Link href="/" className="mb-6 flex items-center space-x-2">
                <Image
                  src="/images/ct-house-gop-logo.jpg"
                  alt="Connecticut House Republicans"
                  width={150}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <div className="mt-6 space-y-1">{navItems.map((item) => renderMobileNavItem(item))}</div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
