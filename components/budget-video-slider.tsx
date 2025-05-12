"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Play, Download, ExternalLink, BarChart3, ChevronLeft, ChevronRight } from "lucide-react"

// YouTube video data with correct IDs and titles
const videos = [
  {
    id: "OuHKIQiIKvU",
    title: 'House GOP Leader Candelora on "Reality Check Budget"',
    description: "Opening remarks from House Republican Leader Vincent Candelora on the House GOP budget proposal.",
  },
  {
    id: "C5eCXBRdY_Q",
    title: 'Rep. Nuccio on CT House GOP "Reality Check" Budget',
    description: "Representative Nuccio explains the CT House GOP Reality Check Budget.",
  },
  {
    id: "fM5h3gSA5DA",
    title: "Rep. Polletta on the CT House GOP Reality Check Budget",
    description: "Representative Polletta discusses the CT House GOP Reality Check Budget.",
  },
  {
    id: "26puTolmveY",
    title: "House Republicans Answer Questions Reality Check Budget",
    description: "House Republicans respond to questions about the Reality Check Budget.",
  },
]

// Budget data for each fiscal year
const budgetData = {
  fy26: {
    category: "FY 26",
    democrats: 27189048121,
    governor: 26974306953,
    republicans: 26973278978,
    repVsGov: 577975,
    repVsDem: 215319143,
  },
  fy27: {
    category: "FY 27",
    democrats: 28526419193,
    governor: 28225833956,
    republicans: 27456715271,
    repVsGov: 769118685,
    repVsDem: 1069703922,
  },
  total: {
    category: "2-Year Total",
    democrats: 55715467314,
    governor: 55200140909,
    republicans: 54429994249,
    repVsGov: 769696660,
    repVsDem: 1285023065,
  },
}

// Format large numbers for display
const formatBudgetNumber = (num: number) => {
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(1)}B`
  } else if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`
  } else {
    return `$${num.toLocaleString()}`
  }
}

export function BudgetVideoSlider() {
  const [activeTab, setActiveTab] = useState("videos")
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideWidth, setSlideWidth] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Update slide width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (sliderRef.current) {
        setSlideWidth(sliderRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const handleThumbnailClick = (index: number) => {
    if (index === activeVideoIndex && isPlaying) return
    setActiveVideoIndex(index)
    setIsPlaying(false)
  }

  const handlePlayVideo = () => {
    setIsPlaying(true)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0))
  }

  // Mouse drag handlers for slider
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0))
    setScrollLeft(sliderRef.current?.scrollLeft || 0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (sliderRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2 // Scroll speed multiplier
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (sliderRef.current) {
      const slideIndex = Math.round(sliderRef.current.scrollLeft / slideWidth)
      setCurrentSlide(slideIndex)
      sliderRef.current.scrollTo({
        left: slideIndex * slideWidth,
        behavior: "smooth",
      })
    }
  }

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0))
    setScrollLeft(sliderRef.current?.scrollLeft || 0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const x = e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (sliderRef.current) {
      const slideIndex = Math.round(sliderRef.current.scrollLeft / slideWidth)
      setCurrentSlide(slideIndex)
      sliderRef.current.scrollTo({
        left: slideIndex * slideWidth,
        behavior: "smooth",
      })
    }
  }

  // Programmatically scroll to slide
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: currentSlide * slideWidth,
        behavior: "smooth",
      })
    }
  }, [currentSlide, slideWidth])

  return (
    <section className="py-12 px-4 bg-[#F5F5F5] overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-primary-navy">Reality Check Budget</h2>
            <div className="flex-shrink-0">
              <img
                src="https://www.cthousegop.com/wp-content/uploads/2025/04/483233292_1346994719868798_7975581270295086386_n-1.png"
                alt="CT House GOP Logo"
                width={120}
                height={120}
                className="rounded-full"
                loading="lazy"
              />
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mt-4">
            Explore our responsible budget plan that spends less while delivering real tax relief for Connecticut
            residents.
          </p>
        </div>

        <div className="relative">
          {/* Slider Navigation */}
          <div className="flex justify-center mb-6 relative z-10">
            <div className="inline-flex bg-white rounded-full p-1 shadow-md">
              <button
                onClick={() => setCurrentSlide(0)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  currentSlide === 0 ? "bg-primary-navy text-white" : "text-gray-600 hover:bg-gray-100",
                )}
              >
                <span className="flex items-center gap-2">
                  <Play className="h-4 w-4" /> Budget Videos
                </span>
              </button>
              <button
                onClick={() => setCurrentSlide(1)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  currentSlide === 1 ? "bg-primary-navy text-white" : "text-gray-600 hover:bg-gray-100",
                )}
              >
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" /> Budget Comparison
                </span>
              </button>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 z-10 pointer-events-none">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={cn(
                "rounded-full bg-white shadow-md pointer-events-auto",
                currentSlide === 0 ? "opacity-50 cursor-not-allowed" : "opacity-100",
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={currentSlide === 1}
              className={cn(
                "rounded-full bg-white shadow-md pointer-events-auto",
                currentSlide === 1 ? "opacity-50 cursor-not-allowed" : "opacity-100",
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Slider Container */}
          <div
            ref={sliderRef}
            className="flex overflow-x-hidden snap-x snap-mandatory touch-pan-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Slide 1: Videos */}
            <div className="min-w-full w-full flex-shrink-0 snap-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Main video player */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {isPlaying ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videos[activeVideoIndex].id}?autoplay=1&rel=0`}
                      title={videos[activeVideoIndex].title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full aspect-video"
                    ></iframe>
                  ) : (
                    <div className="relative aspect-video cursor-pointer" onClick={handlePlayVideo}>
                      <Image
                        src={`https://img.youtube.com/vi/${videos[activeVideoIndex].id}/maxresdefault.jpg`}
                        alt={videos[activeVideoIndex].title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transition-transform hover:scale-110">
                          <Play className="h-12 w-12 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="font-bold text-lg text-primary-navy">{videos[activeVideoIndex].title}</h3>
                    <p className="text-gray-600 text-sm">{videos[activeVideoIndex].description}</p>
                  </div>
                </div>

                {/* Video thumbnails */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-primary-navy">Budget Videos</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {videos.map((video, index) => (
                      <div
                        key={video.id}
                        className={cn(
                          "cursor-pointer transition-all duration-200 flex gap-4 p-3 rounded-lg",
                          index === activeVideoIndex
                            ? "bg-light-blue/30 border border-primary-navy"
                            : "bg-white hover:bg-light-blue/10 border border-gray-200",
                        )}
                        onClick={() => handleThumbnailClick(index)}
                      >
                        <div className="relative aspect-video w-32 flex-shrink-0 rounded-md overflow-hidden hover-zoom-container">
                          <Image
                            src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                            alt={video.title}
                            fill
                            className="object-cover hover-zoom"
                          />
                          {index !== activeVideoIndex && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <Play className="h-8 w-8 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-primary-navy line-clamp-2">{video.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{video.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Button className="w-full bg-secondary-red hover:bg-secondary-red/90" asChild>
                      <a
                        href="https://www.cthousegop.com/wp-content/uploads/2025/05/Download-Budget-Summary-Ledger.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="mr-2 h-4 w-4" /> Download Budget PDF
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2: Budget Comparison */}
            <div className="min-w-full w-full flex-shrink-0 snap-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-primary-navy mb-6 text-center">Budget Comparison</h3>

                {/* Budget Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Governor Card */}
                  <div className="relative overflow-hidden rounded-xl p-6 text-white shadow-lg border border-white/10 bg-primary-navy">
                    <div className="absolute inset-0 pointer-events-none bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold mb-2">Spends Less Than The Governor</h2>
                      <p className="text-4xl font-bold text-white mb-4">
                        ${budgetData.total.repVsGov.toLocaleString()}
                      </p>
                      <div className="bg-white text-primary-navy px-3 py-1 rounded-md text-center shadow-sm inline-block">
                        <span className="font-bold">2-Year Total</span>
                      </div>
                    </div>
                  </div>

                  {/* Democrats Card */}
                  <div className="relative overflow-hidden rounded-xl p-6 text-white shadow-lg border border-white/10 bg-secondary-red">
                    <div className="absolute inset-0 pointer-events-none bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold mb-2">Spends Less Than The Democrats</h2>
                      <p className="text-4xl font-bold text-white mb-4">
                        ${budgetData.total.repVsDem.toLocaleString()}
                      </p>
                      <div className="bg-white text-secondary-red px-3 py-1 rounded-md text-center shadow-sm inline-block">
                        <span className="font-bold">2-Year Total</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Budget</th>
                        <th className="border p-2 text-right">FY 26</th>
                        <th className="border p-2 text-right">FY 27</th>
                        <th className="border p-2 text-right">2-Year Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2 font-medium">Legislative Democrats</td>
                        <td className="border p-2 text-right">{formatBudgetNumber(budgetData.fy26.democrats)}</td>
                        <td className="border p-2 text-right">{formatBudgetNumber(budgetData.fy27.democrats)}</td>
                        <td className="border p-2 text-right">{formatBudgetNumber(budgetData.total.democrats)}</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border p-2 font-medium">Governor's Budget</td>
                        <td className="border p-2 text-right">{formatBudgetNumber(budgetData.fy26.governor)}</td>
                        <td className="border p-2 text-right">{formatBudgetNumber(budgetData.fy27.governor)}</td>
                        <td className="border p-2 text-right">{formatBudgetNumber(budgetData.total.governor)}</td>
                      </tr>
                      <tr className="bg-light-blue/20">
                        <td className="border p-2 font-medium">House Republicans</td>
                        <td className="border p-2 text-right">{formatBudgetNumber(budgetData.fy26.republicans)}</td>
                        <td className="border p-2 text-right">{formatBudgetNumber(budgetData.fy27.republicans)}</td>
                        <td className="border p-2 text-right">{formatBudgetNumber(budgetData.total.republicans)}</td>
                      </tr>
                      <tr className="bg-green-50">
                        <td className="border p-2 font-medium">Savings vs. Governor</td>
                        <td className="border p-2 text-right text-green-600">
                          ${budgetData.fy26.repVsGov.toLocaleString()}
                        </td>
                        <td className="border p-2 text-right text-green-600">
                          ${budgetData.fy27.repVsGov.toLocaleString()}
                        </td>
                        <td className="border p-2 text-right text-green-600">
                          ${budgetData.total.repVsGov.toLocaleString()}
                        </td>
                      </tr>
                      <tr className="bg-green-100">
                        <td className="border p-2 font-medium">Savings vs. Democrats</td>
                        <td className="border p-2 text-right text-green-700">
                          ${budgetData.fy26.repVsDem.toLocaleString()}
                        </td>
                        <td className="border p-2 text-right text-green-700">
                          ${budgetData.fy27.repVsDem.toLocaleString()}
                        </td>
                        <td className="border p-2 text-right text-green-700">
                          ${budgetData.total.repVsDem.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 text-center">
                  <Button className="bg-secondary-red hover:bg-secondary-red/90" asChild>
                    <a href="https://realitycheckct.com/" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> View Full Budget Details
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-6">
            {[0, 1].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "h-2 w-8 mx-1 rounded-full transition-colors",
                  currentSlide === index ? "bg-secondary-red" : "bg-gray-300 hover:bg-gray-400",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
