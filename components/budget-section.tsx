"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Play, Download, ExternalLink, BarChart3 } from "lucide-react"

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

export function BudgetSection() {
  const [activeTab, setActiveTab] = useState<"videos" | "comparison">("videos")
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleThumbnailClick = (index: number) => {
    if (index === activeVideoIndex && isPlaying) return
    setActiveVideoIndex(index)
    setIsPlaying(false)
  }

  const handlePlayVideo = () => {
    setIsPlaying(true)
  }

  return (
    <section className="py-12 bg-[#F5F5F5]">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-center mb-4">
          <Image
            src="https://www.cthousegop.com/wp-content/uploads/2025/04/483233292_1346994719868798_7975581270295086386_n-1.png"
            alt="CT House GOP Logo"
            width={150}
            height={150}
            className="rounded-full"
            unoptimized={true}
            loading="lazy"
          />
        </div>
        <h2 className="text-3xl font-bold text-primary-navy mb-6 text-center">Reality Check Budget</h2>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setActiveTab("videos")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeTab === "videos" ? "bg-primary-navy text-white" : "text-gray-600 hover:bg-gray-100",
              )}
            >
              <span className="flex items-center gap-2">
                <Play className="h-4 w-4" /> Budget Videos
              </span>
            </button>
            <button
              onClick={() => setActiveTab("comparison")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeTab === "comparison" ? "bg-primary-navy text-white" : "text-gray-600 hover:bg-gray-100",
              )}
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Budget Comparison
              </span>
            </button>
          </div>
        </div>

        {/* Videos Tab Content */}
        {activeTab === "videos" && (
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
                    <div className="relative aspect-video w-32 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                        alt={video.title}
                        fill
                        className="object-cover"
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
        )}

        {/* Comparison Tab Content */}
        {activeTab === "comparison" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-primary-navy mb-6 text-center">Budget Comparison</h3>

            {/* Budget Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Governor Card */}
              <div className="relative overflow-hidden rounded-xl p-6 text-white shadow-lg border border-white/10 bg-primary-navy">
                <div className="absolute inset-0 pointer-events-none bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2">Spends Less Than The Governor</h2>
                  <p className="text-4xl font-bold text-white mb-4">${budgetData.total.repVsGov.toLocaleString()}</p>
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
                  <p className="text-4xl font-bold text-white mb-4">${budgetData.total.repVsDem.toLocaleString()}</p>
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
        )}
      </div>
    </section>
  )
}
