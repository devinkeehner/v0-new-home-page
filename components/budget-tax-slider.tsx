"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Define the slides for the main slider
const slides = [
  {
    id: "budget",
    title: "Reality Check Budget",
    subtitle: "A responsible budget plan that spends less while delivering real tax relief for Connecticut residents.",
    bgColor: "bg-primary-navy",
    textColor: "text-white",
    dotIndex: 0,
  },
  {
    id: "tax-relief",
    title: "Tax Relief for Connecticut",
    subtitle: "Our plan provides meaningful tax relief to residents and businesses across the state.",
    bgColor: "bg-[#FFD700]",
    textColor: "text-primary-navy",
    dotIndex: 1,
  },
]

export function BudgetTaxSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
  })

  // Auto-advance slides
  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 8000) // 8 seconds per slide

    return () => clearInterval(interval)
  }, [autoplay])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setAutoplay(false) // Pause autoplay when manually navigating
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setAutoplay(false) // Pause autoplay when manually navigating
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Success!",
      description: "Thank you for signing up for updates.",
    })
    // Reset form
    setFormData({
      email: "",
      mobile: "",
    })
  }

  return (
    <div className="relative">
      {/* Slider */}
      <div className="relative overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn("transition-all duration-700 ease-in-out", index === currentSlide ? "block" : "hidden")}
          >
            <div className={cn("py-12 px-4", slide.bgColor)}>
              <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className={cn("text-4xl font-bold mb-4", slide.textColor)}>{slide.title}</h2>
                    <p
                      className={cn(
                        "text-xl mb-6",
                        slide.textColor === "text-white" ? "text-white/80" : "text-gray-800",
                      )}
                    >
                      {slide.subtitle}
                    </p>

                    {/* Email signup form */}
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                      <div className="relative">
                        <Input
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="bg-white text-primary-navy pr-6"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-red">*</span>
                      </div>

                      <div className="flex gap-3">
                        <Input
                          type="tel"
                          name="mobile"
                          placeholder="Mobile number"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          className="bg-white text-primary-navy"
                        />
                        <Button type="submit" className="bg-secondary-red hover:bg-secondary-red/90 whitespace-nowrap">
                          Sign Up
                        </Button>
                      </div>
                    </form>

                    <p
                      className={cn(
                        "mt-4 text-sm",
                        slide.textColor === "text-white" ? "text-white/80" : "text-gray-700",
                      )}
                    >
                      Stay informed with the latest news and updates from our caucus.
                    </p>
                  </div>

                  <div className="flex justify-center">
                    {slide.id === "budget" ? (
                      <div className="relative h-64 w-64 md:h-80 md:w-80">
                        <Image
                          src="/images/ct-house-gop-logo.jpg"
                          alt="Connecticut House Republicans"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="relative h-64 w-64 md:h-80 md:w-80">
                        <div className="absolute inset-0 rounded-full bg-white shadow-lg flex items-center justify-center">
                          <div className="text-center p-8">
                            <div className="text-5xl font-bold text-green-700">$320M</div>
                            <div className="text-xl text-green-600 mt-2">Total Tax Relief</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 flex justify-between z-20 pointer-events-none">
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          className="rounded-full bg-white/80 backdrop-blur-sm shadow-md pointer-events-auto"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          className="rounded-full bg-white/80 backdrop-blur-sm shadow-md pointer-events-auto"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center py-4">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index)
              setAutoplay(false)
            }}
            className={cn(
              "h-2 w-8 mx-1 rounded-full transition-colors",
              currentSlide === index
                ? index === 0
                  ? "bg-secondary-red"
                  : "bg-primary-navy"
                : "bg-gray-300 hover:bg-gray-400",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
