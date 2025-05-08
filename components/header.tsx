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
import { useRouter } from "next/navigation"

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
  { name: "Contact", href: "/contact" },
  {
    name: "Representatives",
    href: "#",
    children: [
      { name: "Leadership Team", href: "/leadership-team" },
      { name: "Committee Assignments", href: "/committees" },
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
  const router = useRouter()
  const [activeDropdowns, setActiveDropdowns] = useState<string[]>([])
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const timeoutRef = useRef<{ [key: string]: NodeJS.Timeout | null }>({})
  const [isSignupExpanded, setIsSignupExpanded] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    zipCode: "",
    firstName: "",
    lastName: "",
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

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

  const isDropdownActive = (path: string) => {
    return activeDropdowns.includes(path) || activeDropdowns.some((id) => id.startsWith(`${path}-`))
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFocus = () => {
    if (!isSignupExpanded) {
      setIsSignupExpanded(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your newsletter service
    setFormSubmitted(true)

    // Reset after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false)
      setFormData({
        email: "",
        mobile: "",
        zipCode: "",
        firstName: "",
        lastName: "",
      })
      setIsSignupExpanded(false)
    }, 5000)
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

  // Completely rewritten mobile navigation rendering
  const MobileNavItem = ({ item, depth = 0, path = "" }: { item: any; depth?: number; path?: string }) => {
    const hasChildren = item.children && item.children.length > 0
    const currentPath = path ? `${path}-${item.name}` : item.name
    const isActive = isDropdownActive(currentPath)

    // Function to navigate to the item's href
    const navigateToLink = () => {
      if (item.href && item.href !== "#") {
        if (item.href.startsWith("http")) {
          window.open(item.href, "_blank", "noopener,noreferrer")
        } else {
          router.push(item.href)
        }
        setMobileMenuOpen(false)
      }
    }

    return (
      <div className={cn(depth > 0 ? "ml-4" : "")}>
        <div className="flex items-center justify-between">
          {/* The item name/text that navigates when clicked */}
          <button
            className={cn(
              "flex-grow text-left rounded-md px-3 py-2 text-base font-medium text-primary-navy hover:bg-muted",
              item.href === "#" && "cursor-default",
            )}
            onClick={() => {
              if (item.href && item.href !== "#") {
                navigateToLink()
              }
            }}
          >
            {item.name}
          </button>

          {/* The dropdown toggle button that only appears for items with children */}
          {hasChildren && (
            <button
              className="p-2 rounded-md hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation()
                toggleDropdown(currentPath)
              }}
              aria-label={isActive ? "Collapse" : "Expand"}
            >
              <ChevronDown className={cn("h-4 w-4 transition-transform", isActive ? "rotate-180" : "")} />
            </button>
          )}
        </div>

        {/* Dropdown content */}
        {isActive && hasChildren && (
          <div className="mt-1 space-y-1">
            {item.children.map((child: any, index: number) => (
              <MobileNavItem key={index} item={child} depth={depth + 1} path={currentPath} />
            ))}
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
            <Image
              src="/images/ct-house-gop-logo.jpg"
              alt="Connecticut House Republicans"
              width={200}
              height={50}
              className="h-14 w-auto"
            />
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
                    <Image
                      src="/images/ct-house-gop-logo.jpg"
                      alt="Connecticut House Republicans"
                      width={150}
                      height={40}
                      className="h-10 w-auto"
                    />
                  </Link>

                  {/* Signup Form in Mobile Menu - Updated to match slider */}
                  <div className="my-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-bold text-primary-navy mb-3">Stay Updated</h3>

                    {formSubmitted ? (
                      <div className="text-center py-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-1">Thank you for signing up!</h4>
                        <p className="text-gray-600 mb-4">You'll receive updates from Connecticut House Republicans.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Row 1: Email (3/5) and Mobile (2/5) */}
                        <div className="grid grid-cols-5 gap-2">
                          <div className="col-span-3 relative">
                            <input
                              type="email"
                              name="email"
                              placeholder="Email address"
                              value={formData.email}
                              onChange={handleInputChange}
                              onFocus={handleFocus}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="tel"
                              name="mobile"
                              placeholder="Mobile number"
                              value={formData.mobile}
                              onChange={handleInputChange}
                              onFocus={handleFocus}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        {!isSignupExpanded && (
                          <button
                            type="button"
                            className="w-full bg-secondary-red text-white py-2 px-4 rounded-md hover:bg-secondary-red/90"
                            onClick={handleFocus}
                          >
                            Sign Up
                          </button>
                        )}

                        <div
                          className={cn(
                            "space-y-3 overflow-hidden transition-all duration-500 ease-in-out",
                            isSignupExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0",
                          )}
                        >
                          {/* Row 2: First name (2/5) and Last name (3/5) */}
                          <div className="grid grid-cols-5 gap-2">
                            <div className="col-span-2">
                              <input
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                            <div className="col-span-3">
                              <input
                                type="text"
                                name="lastName"
                                placeholder="Last name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          {/* Row 3: Zip code (1/5) and Submit button (4/5) */}
                          <div className="grid grid-cols-5 gap-2">
                            <div className="col-span-1">
                              <input
                                type="text"
                                name="zipCode"
                                placeholder="Zip"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                            <div className="col-span-4">
                              <button
                                type="submit"
                                className="w-full bg-secondary-red text-white py-2 px-4 rounded-md hover:bg-secondary-red/90"
                              >
                                Sign Up for Updates
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Completely rewritten mobile navigation */}
                  <div className="mt-6 space-y-1">
                    {navItems.map((item, index) => (
                      <MobileNavItem key={index} item={item} />
                    ))}
                  </div>
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
