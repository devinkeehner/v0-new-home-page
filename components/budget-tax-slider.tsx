"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

// Define the tax relief options for the second slide
const taxReliefOptions = [
  {
    id: "income-tax",
    title: "Income Tax Reduction",
    description: "Reduce the state income tax rate for middle-class families",
  },
  {
    id: "property-tax",
    title: "Property Tax Credit",
    description: "Increase the property tax credit for homeowners",
  },
  {
    id: "pension-tax",
    title: "Pension & Social Security",
    description: "Eliminate tax on pension and social security income",
  },
]

// Define the slides for the main slider
const slides = [
  {
    id: "house-republicans",
    title: "Connecticut House Republicans",
    subtitle: "Fighting for Connecticut's families and businesses with common-sense solutions.",
    bgColor: "bg-primary-navy",
    textColor: "text-white",
    dotIndex: 0,
  },
  {
    id: "tax-relief",
    title: "Choose Your Tax Relief",
    subtitle: "Select tax relief options that align with your priorities for Connecticut residents and businesses.",
    bgColor: "bg-[#FFD700]",
    textColor: "text-primary-navy",
    dotIndex: 1,
  },
  {
    id: "signup",
    title: "Reality Check Budget",
    subtitle:
      "Sign up to receive updates about our Reality Check Budget and how it will benefit Connecticut residents.",
    bgColor: "bg-gray-50",
    textColor: "text-primary-navy",
    dotIndex: 2,
  },
]

export function BudgetTaxSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    zipCode: "",
    firstName: "",
    lastName: "",
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

  const handleFocus = () => {
    if (!isExpanded) {
      setIsExpanded(true)
    }
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
      zipCode: "",
      firstName: "",
      lastName: "",
    })
    setIsExpanded(false)
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
            <div className={cn("py-12 px-4 min-h-[600px] flex items-center", slide.bgColor)}>
              <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className={cn("text-4xl font-bold mb-4 font-sans", slide.textColor)}>{slide.title}</h2>
                    <p
                      className={cn(
                        "text-xl mb-6",
                        slide.textColor === "text-white" ? "text-white/80" : "text-gray-800",
                      )}
                    >
                      {slide.subtitle}
                    </p>

                    {/* First and Third Slide: Email signup form with expansion */}
                    {(index === 0 || index === 2) && (
                      <form onSubmit={handleSubmit} className="w-full max-w-md">
                        <div className="space-y-3">
                          <div className="relative">
                            <Input
                              type="email"
                              name="email"
                              placeholder="Enter your email"
                              value={formData.email}
                              onChange={handleInputChange}
                              onFocus={handleFocus}
                              required
                              className="bg-white pr-6 text-primary-navy"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-red">*</span>
                          </div>

                          {isExpanded ? (
                            <>
                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  type="tel"
                                  name="mobile"
                                  placeholder="Mobile number"
                                  value={formData.mobile}
                                  onChange={handleInputChange}
                                  className="bg-white text-primary-navy"
                                />
                                <Input
                                  type="text"
                                  name="zipCode"
                                  placeholder="Zip code"
                                  value={formData.zipCode}
                                  onChange={handleInputChange}
                                  className="bg-white text-primary-navy"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  type="text"
                                  name="firstName"
                                  placeholder="First name"
                                  value={formData.firstName}
                                  onChange={handleInputChange}
                                  className="bg-white text-primary-navy"
                                />
                                <Input
                                  type="text"
                                  name="lastName"
                                  placeholder="Last name"
                                  value={formData.lastName}
                                  onChange={handleInputChange}
                                  className="bg-white text-primary-navy"
                                />
                              </div>
                              <Button type="submit" className="w-full bg-secondary-red hover:bg-secondary-red/90">
                                Sign Up for Updates
                              </Button>
                            </>
                          ) : (
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                type="tel"
                                name="mobile"
                                placeholder="Mobile number"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                onFocus={handleFocus}
                                className="bg-white text-primary-navy"
                              />
                              <Button
                                type="submit"
                                className="bg-secondary-red hover:bg-secondary-red/90"
                                onClick={handleFocus}
                              >
                                Sign Up
                              </Button>
                            </div>
                          )}
                        </div>
                      </form>
                    )}

                    {/* Second Slide: Tax Relief Options */}
                    {index === 1 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {taxReliefOptions.map((option) => (
                            <div key={option.id} className="flex flex-col">
                              <a
                                href="https://realitycheckct.com/#choose-your-tax-relief"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                              >
                                <div className="bg-white rounded-lg border-2 border-primary-navy p-4 h-full hover:bg-primary-navy/5 transition-colors">
                                  <h3 className="font-bold text-primary-navy text-center mb-2">{option.title}</h3>
                                  <p className="text-sm text-gray-800 text-center">{option.description}</p>
                                </div>
                              </a>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-center">
                          <Button className="bg-secondary-red hover:bg-secondary-red/90" asChild>
                            <a
                              href="https://realitycheckct.com/#choose-your-tax-relief"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center"
                            >
                              Choose Your Own Tax Relief <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* First Slide: Additional text */}
                    {index === 0 && (
                      <p className="mt-2 text-sm text-white/80">
                        Stay informed with the latest news and updates from our caucus.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-center">
                    {/* First Slide: Circular Logo */}
                    {index === 0 && (
                      <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-white md:h-80 md:w-80">
                        <Image
                          src="/images/ct-house-gop-optimized.webp"
                          alt="Connecticut House Republicans"
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}

                    {/* Second Slide: Tax Relief Image */}
                    {index === 1 && (
                      <div className="relative h-64 w-64 md:h-80 md:w-80">
                        <div className="absolute inset-0 rounded-full bg-white shadow-lg flex items-center justify-center">
                          <div className="text-center p-8">
                            <div className="text-5xl font-bold text-green-700">$320M</div>
                            <div className="text-xl text-green-600 mt-2">Total Tax Relief</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Third Slide: Budget Website Logo */}
                    {index === 2 && (
                      <div className="flex flex-col items-center">
                        <div className="relative h-64 w-64 md:h-80 md:w-80">
                          <Image
                            src="https://www.cthousegop.com/wp-content/uploads/2025/05/BUDGET-WEBSITE-LOGO-e1746106410465.png"
                            alt="Budget Website Logo"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <Button className="mt-6 bg-secondary-red hover:bg-secondary-red/90" asChild>
                          <a href="https://realitycheckct.com/" target="_blank" rel="noopener noreferrer">
                            Learn More <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
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
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index)
              setAutoplay(false)
            }}
            className={cn(
              "h-2 w-8 mx-1 rounded-full transition-colors",
              currentSlide === index
                ? index === 1
                  ? "bg-primary-navy"
                  : "bg-secondary-red"
                : "bg-gray-300 hover:bg-gray-400",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
