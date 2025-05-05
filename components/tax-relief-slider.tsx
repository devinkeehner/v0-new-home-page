"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Tax relief options
const taxReliefOptions = [
  {
    id: "income-tax",
    title: "Income Tax Reduction",
    description: "Reduce the state income tax rate for middle-class families",
    value: 85000000,
  },
  {
    id: "property-tax",
    title: "Property Tax Credit",
    description: "Increase the property tax credit for homeowners",
    value: 60000000,
  },
  {
    id: "sales-tax",
    title: "Sales Tax Holiday",
    description: "Extend the sales tax holiday for back-to-school shopping",
    value: 25000000,
  },
  {
    id: "business-tax",
    title: "Small Business Relief",
    description: "Tax relief for small businesses to promote growth",
    value: 45000000,
  },
  {
    id: "pension-tax",
    title: "Pension & Social Security",
    description: "Eliminate tax on pension and social security income",
    value: 75000000,
  },
  {
    id: "car-tax",
    title: "Car Tax Cap",
    description: "Cap the car tax to provide relief for vehicle owners",
    value: 30000000,
  },
]

// Slides for the tax relief section
const taxReliefSlides = [
  {
    id: "overview",
    title: "Tax Relief for Connecticut",
    subtitle: "Our plan provides meaningful tax relief to residents and businesses across the state.",
  },
  {
    id: "options",
    title: "Choose Your Tax Relief",
    subtitle: "Select tax relief options that align with your priorities for Connecticut residents and businesses.",
  },
  {
    id: "signup",
    title: "Stay Informed",
    subtitle: "Sign up to receive updates about our tax relief plan and how it will benefit you.",
  },
]

export function TaxReliefSlider() {
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    zipCode: "",
    firstName: "",
    lastName: "",
  })
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Success!",
      description: "Thank you for your interest in our tax relief tool.",
    })
    // Reset form
    setFormData({
      email: "",
      mobile: "",
      zipCode: "",
      firstName: "",
      lastName: "",
    })
    // Go back to first slide
    setCurrentSlide(0)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, taxReliefSlides.length - 1))
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
    <section className="py-12 px-4 bg-[#FFD700] overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-primary-navy mb-4">{taxReliefSlides[currentSlide].title}</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">{taxReliefSlides[currentSlide].subtitle}</p>
        </div>

        <div className="relative">
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
              disabled={currentSlide === taxReliefSlides.length - 1}
              className={cn(
                "rounded-full bg-white shadow-md pointer-events-auto",
                currentSlide === taxReliefSlides.length - 1 ? "opacity-50 cursor-not-allowed" : "opacity-100",
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
            {/* Slide 1: Overview */}
            <div className="min-w-full w-full flex-shrink-0 snap-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left side: Tax Relief Info */}
                <div>
                  <div className="bg-primary-navy text-white p-6 rounded-t-lg">
                    <h2 className="text-2xl font-bold mb-2">Tax Relief for Connecticut</h2>
                    <p className="text-white/80">
                      Our plan provides meaningful tax relief to residents and businesses across the state.
                    </p>
                  </div>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-primary-navy mb-4">Key Facts:</h3>
                      <ul className="space-y-3">
                        {[
                          "Provides $320 million in tax relief",
                          "Focuses on middle-class families and small businesses",
                          "Includes property tax relief, income tax reduction, and more",
                        ].map((fact, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 text-center">
                        <Button className="bg-secondary-red hover:bg-secondary-red/90" onClick={nextSlide}>
                          View Tax Relief Options
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right side: Image/Graphic */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-primary-navy mb-4 text-center">Total Tax Relief</h3>
                  <div className="flex justify-center mb-6">
                    <div className="relative h-40 w-40 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-green-100"></div>
                      <div className="relative z-10 text-center">
                        <div className="text-4xl font-bold text-green-700">$320M</div>
                        <div className="text-sm text-green-600">Total Relief</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 text-center">
                    Our tax relief plan is designed to provide meaningful relief to Connecticut residents and businesses
                    while maintaining fiscal responsibility.
                  </p>

                  <div className="text-center">
                    <Button
                      variant="outline"
                      className="border-primary-navy text-primary-navy hover:bg-primary-navy/10"
                      onClick={() => setCurrentSlide(2)}
                    >
                      Sign Up for Updates
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2: Tax Relief Options */}
            <div className="min-w-full w-full flex-shrink-0 snap-center">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-primary-navy mb-6 text-center">Tax Relief Options</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {taxReliefOptions.map((option) => (
                    <div
                      key={option.id}
                      className="border rounded-lg p-4 bg-light-blue/10 hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-bold text-primary-navy">{option.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                      <p className="text-lg font-bold text-secondary-red">${option.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-primary-navy">Total Tax Relief:</span>
                    <span className="text-xl font-bold text-green-700">$320,000,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button className="bg-secondary-red hover:bg-secondary-red/90" asChild>
                    <a
                      href="https://realitycheckct.com/#choose-your-tax-relief"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" /> Build Your Own Tax Relief Plan
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    className="border-primary-navy text-primary-navy hover:bg-primary-navy/10"
                    onClick={() => setCurrentSlide(2)}
                  >
                    Sign Up for Updates
                  </Button>
                </div>
              </div>
            </div>

            {/* Slide 3: Sign Up Form */}
            <div className="min-w-full w-full flex-shrink-0 snap-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-primary-navy mb-4">Stay Informed</h3>
                  <p className="text-gray-600 mb-6">
                    Sign up to receive updates about our tax relief plan and how it will benefit you and your family.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-white text-primary-navy"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-2 gap-4">
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
                  </form>
                </div>

                <div className="bg-primary-navy text-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Why Sign Up?</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent-gold mt-1 mr-3 flex-shrink-0" />
                      <span>Receive updates on our tax relief plan</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent-gold mt-1 mr-3 flex-shrink-0" />
                      <span>Learn how the plan will benefit you and your family</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent-gold mt-1 mr-3 flex-shrink-0" />
                      <span>Get invited to town halls and budget presentations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent-gold mt-1 mr-3 flex-shrink-0" />
                      <span>Stay informed about legislative updates</span>
                    </li>
                  </ul>

                  <div className="mt-8 p-4 bg-white/10 rounded-lg">
                    <h4 className="font-bold text-white mb-2">Contact Information</h4>
                    <p className="text-white/80">
                      Legislative Office Building, Room 4200
                      <br />
                      300 Capitol Avenue
                      <br />
                      Hartford, CT 06106
                      <br />
                      <br />
                      860-240-8700
                      <br />
                      800-842-1423
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-6">
            {taxReliefSlides.map((_, index) => (
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
