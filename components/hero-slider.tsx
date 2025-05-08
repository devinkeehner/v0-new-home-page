"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Define the slides for the hero
const heroSlides = [
  {
    id: 1,
    title: "Connecticut House Republicans",
    subtitle: "Fighting for Connecticut's families and businesses with common-sense solutions.",
    image: "/images/ct-house-gop-optimized.webp",
    buttonText: "Learn More",
    buttonLink: "https://www.cthousegop.com/about/",
  },
  {
    id: 2,
    title: "Reality Check Budget",
    subtitle: "A responsible budget plan that spends less while delivering real tax relief for Connecticut residents.",
    image: "/placeholder.svg?key=q1s1z",
    buttonText: "View Budget",
    buttonLink: "https://www.cthousegop.com/budget/",
  },
  {
    id: 3,
    title: "Tax Relief for Connecticut",
    subtitle: "Our plan provides meaningful tax relief to residents and businesses across the state.",
    image: "/placeholder.svg?key=3oz8s",
    buttonText: "Tax Relief Details",
    buttonLink: "https://www.cthousegop.com/tax-relief/",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
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
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 7000)

    return () => clearInterval(interval)
  }, [])

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
    // Here you would typically send the data to your newsletter service
    toast({
      title: "Success!",
      description: "You've been signed up for our newsletter.",
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <section className="relative overflow-hidden bg-primary-navy py-12 md:py-16 lg:py-20">
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src={heroSlides[currentSlide].image || "/placeholder.svg"}
          alt="Background"
          fill
          className="object-cover transition-opacity duration-500"
          priority
        />
      </div>
      <div className="container relative z-10">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col justify-center text-white">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={cn(
                  "transition-opacity duration-500 absolute",
                  index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none",
                )}
              >
                {index === 0 ? (
                  <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                    <span className="block text-accent">Connecticut</span>
                    <span className="block text-accent">House Republicans</span>
                  </h1>
                ) : (
                  <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">{slide.title}</h1>
                )}
                <p className="mb-6 max-w-md text-lg md:text-xl">{slide.subtitle}</p>
                <Button className="bg-secondary-red hover:bg-secondary-red/90 mb-8" asChild>
                  <a href={slide.buttonLink} target="_blank" rel="noopener noreferrer">
                    {slide.buttonText}
                  </a>
                </Button>
              </div>
            ))}

            <form onSubmit={handleSubmit} className="w-full max-w-md mt-auto">
              <div className="space-y-3">
                {/* Row 1: Email (3/5) and Mobile (2/5) */}
                <div className="grid grid-cols-5 gap-3">
                  <div className="col-span-3 relative">
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      required
                      className="bg-white pr-6 text-primary-navy w-full"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-red">*</span>
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="tel"
                      name="mobile"
                      placeholder="Mobile number"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      className="bg-white text-primary-navy w-full"
                    />
                  </div>
                </div>

                {!isExpanded && (
                  <Button
                    type="submit"
                    className="w-full bg-secondary-red hover:bg-secondary-red/90"
                    onClick={handleFocus}
                  >
                    Sign Up
                  </Button>
                )}

                <div
                  className={cn(
                    "space-y-3 overflow-hidden transition-all duration-500 ease-in-out",
                    isExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0",
                  )}
                >
                  {/* Row 2: First name (2/5) and Last name (3/5) */}
                  <div className="grid grid-cols-5 gap-3">
                    <div className="col-span-2">
                      <Input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="bg-white text-primary-navy w-full"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="bg-white text-primary-navy w-full"
                      />
                    </div>
                  </div>

                  {/* Row 3: Zip code (1/5) and Submit button (4/5) */}
                  <div className="grid grid-cols-5 gap-3">
                    <div className="col-span-1">
                      <Input
                        type="text"
                        name="zipCode"
                        placeholder="Zip"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="bg-white text-primary-navy w-full"
                      />
                    </div>
                    <div className="col-span-4">
                      <Button type="submit" className="w-full bg-secondary-red hover:bg-secondary-red/90">
                        Sign Up for Updates
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <p className="mt-2 text-sm text-white/80">
              Stay informed with the latest news and updates from our caucus.
            </p>
          </div>
          <div className="flex items-center justify-center relative">
            <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-white md:h-80 md:w-80">
              <Image
                src="/images/ct-house-gop-optimized.webp"
                alt="Connecticut House Republicans"
                fill
                className="object-contain"
              />
            </div>

            {/* Slider controls */}
            <div className="absolute bottom-0 right-0 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </Button>
            </div>

            {/* Slide indicators */}
            <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 flex gap-2">
              {heroSlides.map((_, index) => (
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
        </div>
      </div>
    </section>
  )
}
