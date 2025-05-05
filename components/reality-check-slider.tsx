"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Play, Download, ExternalLink } from "lucide-react"

// Define the slides for the Reality Check Budget section
const budgetSlides = [
  {
    id: 1,
    title: "Reality Check Budget",
    subtitle: "A responsible budget plan that spends less while delivering real tax relief for Connecticut residents.",
    image: "/placeholder.svg?key=voctm",
    videoId: "OuHKIQiIKvU",
    buttonText: "Learn More",
    buttonLink: "https://www.cthousegop.com/budget/",
    facts: [
      "Spends $769 million less than the Governor's proposal",
      "Provides $320 million in tax relief",
      "Focuses on affordability and fiscal responsibility",
    ],
  },
  {
    id: 2,
    title: "Choose Your Tax Relief",
    subtitle: "Select tax relief options that align with your priorities for Connecticut residents and businesses.",
    image: "/placeholder.svg?key=j4onl",
    videoId: "C5eCXBRdY_Q",
    buttonText: "Build Your Plan",
    buttonLink: "https://realitycheckct.com/#choose-your-tax-relief",
    facts: [
      "Allocate $320 million in tax relief",
      "Choose from income, property, and sales tax options",
      "Make your voice heard on tax priorities",
    ],
  },
  {
    id: 3,
    title: "Budget Comparison",
    subtitle: "See how our budget compares to the Governor's and Democrats' proposals.",
    image: "/placeholder.svg?key=7jbnd",
    videoId: "fM5h3gSA5DA",
    buttonText: "View Comparison",
    buttonLink: "https://realitycheckct.com/#budget-comparison",
    facts: [
      "Saves $1.28 billion compared to Democrats' budget",
      "Reduces spending while maintaining services",
      "Provides more tax relief than other proposals",
    ],
  },
]

export function RealityCheckSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % budgetSlides.length)
      }, 8000)

      return () => clearInterval(interval)
    }
  }, [isPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % budgetSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + budgetSlides.length) % budgetSlides.length)
  }

  const handlePlayVideo = () => {
    setIsPlaying(true)
  }

  return (
    <section className="py-12 px-4 bg-[#F5F5F5]">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left side: Video/Image */}
          <div className="relative rounded-lg overflow-hidden shadow-lg bg-white">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube.com/embed/${budgetSlides[currentSlide].videoId}?autoplay=1&rel=0`}
                title={budgetSlides[currentSlide].title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video"
              ></iframe>
            ) : (
              <div className="relative aspect-video cursor-pointer" onClick={handlePlayVideo}>
                <Image
                  src={budgetSlides[currentSlide].image || "/placeholder.svg"}
                  alt={budgetSlides[currentSlide].title}
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

            {/* Slide indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {budgetSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={cn(
                    "h-2 w-8 rounded-full transition-colors",
                    index === currentSlide ? "bg-secondary-red" : "bg-white/50 hover:bg-white/70",
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right side: Content */}
          <div className="flex flex-col">
            <div className="relative h-full">
              {budgetSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={cn(
                    "transition-all duration-500 absolute inset-0",
                    index === currentSlide
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-8 pointer-events-none",
                  )}
                >
                  <div className="bg-primary-navy text-white p-6 rounded-t-lg">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-white/80">{slide.subtitle}</p>
                  </div>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-primary-navy mb-4">Key Facts:</h3>
                      <ul className="space-y-3">
                        {slide.facts.map((fact, i) => (
                          <li key={i} className="flex items-start">
                            <div className="bg-secondary-red text-white rounded-full p-1 mr-3 flex-shrink-0 mt-0.5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <Button className="bg-secondary-red hover:bg-secondary-red/90" asChild>
                          <a href={slide.buttonLink} target="_blank" rel="noopener noreferrer">
                            {slide.buttonText} <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>

                        <Button
                          variant="outline"
                          className="border-primary-navy text-primary-navy hover:bg-primary-navy/10"
                          asChild
                        >
                          <a
                            href="https://www.cthousegop.com/wp-content/uploads/2025/05/Download-Budget-Summary-Ledger.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download PDF <Download className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Slider controls */}
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
