"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

// Define the slides for the hero
const heroSlides = [
  {
    id: 1,
    title: "Connecticut House Republicans",
    subtitle: "Fighting for Connecticut's families and businesses with common-sense solutions.",
    image: "/images/ct-house-gop-optimized.webp",
  },
  {
    id: 2,
    title: "Tax Relief for Connecticut",
    subtitle: "Our plan provides meaningful tax relief to residents and businesses across the state.",
    image: "/placeholder.svg?key=rc82g",
  },
  {
    id: 3,
    title: "Reality Check Budget",
    subtitle: "A responsible budget plan that spends less while delivering real tax relief for Connecticut residents.",
    image: "/placeholder.svg?key=nfn2q",
  },
  {
    id: 4,
    title: "Tell Governor Lamont: Veto HB 7259",
    subtitle:
      "The dangerous Trust Act expansion threatens public safety. Join thousands of Connecticut residents demanding a veto.",
    image: "/social/trust-act-facebook-ad.jpg",
    link: "/NoTrust",
    buttonText: "Sign the Petition",
  },
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    zipCode: "",
    firstName: "",
    lastName: "",
  })

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
            <div className="transition-opacity duration-500">
              <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="mb-6 max-w-md text-lg md:text-xl">{heroSlides[currentSlide].subtitle}</p>
              {heroSlides[currentSlide].link && (
                <Button asChild className="mb-6 bg-secondary-red hover:bg-secondary-red/90">
                  <Link href={heroSlides[currentSlide].link}>
                    {heroSlides[currentSlide].buttonText || "Learn More"}
                  </Link>
                </Button>
              )}
            </div>

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

                  {isExpanded ? (
                    <Input
                      type="text"
                      name="zipCode"
                      placeholder="Zip code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="bg-white text-primary-navy"
                    />
                  ) : (
                    <Button type="submit" className="bg-secondary-red hover:bg-secondary-red/90" onClick={handleFocus}>
                      Sign Up
                    </Button>
                  )}
                </div>

                <div
                  className={cn(
                    "grid gap-3 overflow-hidden transition-all duration-500 ease-in-out",
                    isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
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
                  </div>
                </div>
              </div>

              {isExpanded && (
                <Button type="submit" className="mt-3 w-full bg-secondary-red hover:bg-secondary-red/90">
                  Sign Up for Updates
                </Button>
              )}
            </form>
            <p className="mt-2 text-sm text-white/80">
              Stay informed with the latest news and updates from our caucus.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-white md:h-80 md:w-80">
              <Image
                src="/images/ct-house-gop-optimized.webp"
                alt="Connecticut House Republicans"
                fill
                className="object-contain"
              />
            </div>

            {/* Slider controls */}
            <div className="absolute bottom-4 right-4 flex gap-2">
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
