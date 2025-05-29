"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, ExternalLink, CheckCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { submitNewsletterForm } from "@/app/actions/form-actions"

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
    title: "Connecticut\nHouse Republicans",
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
  {
    id: "trust-act",
    title: "Tell Governor Lamont:\nVeto HB 7259",
    subtitle:
      "Join thousands of Connecticut residents urging Governor Lamont to veto the dangerous Trust Act expansion that threatens public safety.",
    bgColor: "bg-secondary-red",
    textColor: "text-white",
    dotIndex: 3,
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
    city: "", // Add city field
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Auto-advance slides
  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 8000) // 8 seconds per slide

    return () => clearInterval(interval)
  }, [autoplay])

  // Reset form submitted state when changing slides
  useEffect(() => {
    setFormSubmitted(false)
    setIsExpanded(false)
    setFormError(null)
  }, [currentSlide])

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
    // Stop autoplay when user types in form fields
    setAutoplay(false)
  }

  const handleFocus = () => {
    if (!isExpanded) {
      setIsExpanded(true)
    }
    // Stop autoplay when user interacts with form fields
    setAutoplay(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)

    try {
      // Submit form data to Gravity Forms via server action
      const result = await submitNewsletterForm(formData)

      if (result.success) {
        // Show toast notification
        toast({
          title: "Success!",
          description: "Thank you for signing up for updates.",
        })

        // Show inline confirmation
        setFormSubmitted(true)

        // Reset form after a delay
        setTimeout(() => {
          setFormData({
            email: "",
            mobile: "",
            zipCode: "",
            firstName: "",
            lastName: "",
            city: "", // Add city field
          })
        }, 500)
      } else {
        // Handle error
        setFormError(result.error || "There was a problem submitting your form. Please try again.")
        toast({
          title: "Error",
          description: result.error || "There was a problem submitting your form. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setFormError("There was a problem submitting your form. Please try again.")
      toast({
        title: "Error",
        description: "There was a problem submitting your form. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormSubmitted(false)
    setIsExpanded(false)
    setFormError(null)
    setFormData({
      email: "",
      mobile: "",
      zipCode: "",
      firstName: "",
      lastName: "",
      city: "", // Add city field
    })
  }

  return (
    <div className="relative">
      {/* Slider */}
      <div className="relative overflow-hidden">
        {/* Mobile Navigation Arrows - Top Position */}
        <div className="md:hidden flex justify-between items-center px-4 py-2 bg-white/10 backdrop-blur-sm z-20">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="rounded-full bg-white/80 backdrop-blur-sm shadow-md"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index)
                  setAutoplay(false)
                }}
                className={cn(
                  "h-2 w-6 rounded-full transition-colors",
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

          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="rounded-full bg-white/80 backdrop-blur-sm shadow-md"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn("transition-all duration-700 ease-in-out", index === currentSlide ? "block" : "hidden")}
          >
            <div className={cn("py-12 px-4 min-h-[600px] flex items-center", slide.bgColor)}>
              <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    {index === 0 ? (
                      <h2 className="text-4xl md:text-4xl lg:text-5xl font-bold mb-4 font-sans text-[#FFD700] whitespace-pre-line">
                        Connecticut
                        <br />
                        House Republicans
                      </h2>
                    ) : (
                      <h2 className={cn("text-4xl font-bold mb-4 font-sans", slide.textColor)}>{slide.title}</h2>
                    )}
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
                      <div className="w-full max-w-md">
                        {formSubmitted ? (
                          <Alert
                            className={cn(
                              "border-green-500 bg-green-50",
                              index === 0 ? "bg-opacity-90 text-white border-white/30" : "",
                            )}
                          >
                            <CheckCircle className={cn("h-5 w-5 text-green-500", index === 0 ? "text-black" : "")} />
                            <AlertTitle className={index === 0 ? "text-black" : ""}>
                              Thank you for signing up!
                            </AlertTitle>
                            <AlertDescription className={index === 0 ? "text-black/90" : ""}>
                              You've been successfully added to our mailing list. We'll keep you updated with the latest
                              news and information.
                            </AlertDescription>
                            <Button
                              onClick={resetForm}
                              variant="outline"
                              className={cn(
                                "mt-2",
                                index === 0 ? "border-white/30 text-black hover:bg-white/10 hover:text-white" : "",
                              )}
                            >
                              Sign up another email
                            </Button>
                          </Alert>
                        ) : (
                          <form onSubmit={handleSubmit} className="space-y-3">
                            {!isExpanded ? (
                              <>
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
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-red">
                                    *
                                  </span>
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
                                  <Button
                                    type="submit"
                                    className="bg-secondary-red hover:bg-secondary-red/90"
                                    onClick={handleFocus}
                                    disabled={isSubmitting}
                                  >
                                    {isSubmitting ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                      </>
                                    ) : (
                                      "Sign Up"
                                    )}
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <>
                                {/* Row 1: Email (3/5) Mobile (2/5) */}
                                <div className="grid grid-cols-5 gap-3">
                                  <Input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="col-span-3 bg-white pr-6 text-primary-navy"
                                  />
                                  <Input
                                    type="tel"
                                    name="mobile"
                                    placeholder="Mobile number"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    className="col-span-2 bg-white text-primary-navy"
                                  />
                                </div>

                                {/* Row 2: First name (2/5) Last name (3/5) */}
                                <div className="grid grid-cols-5 gap-3">
                                  <Input
                                    type="text"
                                    name="firstName"
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="col-span-2 bg-white text-primary-navy"
                                  />
                                  <Input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="col-span-3 bg-white text-primary-navy"
                                  />
                                </div>

                                {/* Add a new row for city */}
                                <div className="grid grid-cols-5 gap-3">
                                  <Input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="col-span-4 bg-white text-primary-navy"
                                  />
                                  <Input
                                    type="text"
                                    name="zipCode"
                                    placeholder="Zip"
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                    className="col-span-1 bg-white text-primary-navy"
                                  />
                                </div>

                                {/* Row 3: Submit button (full width) */}
                                <Button
                                  type="submit"
                                  className="w-full bg-secondary-red hover:bg-secondary-red/90"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Submitting...
                                    </>
                                  ) : (
                                    "Sign Up for Updates"
                                  )}
                                </Button>
                              </>
                            )}

                            {/* Display form error if any */}
                            {formError && (
                              <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
                                {formError}
                              </div>
                            )}
                          </form>
                        )}

                        {!formSubmitted && (
                          <p className="mt-2 text-sm text-white/80">
                            Stay informed with the latest news and updates from our caucus.
                          </p>
                        )}
                      </div>
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
                    {/* Fourth Slide: Trust Act Petition */}
                    {index === 3 && (
                      <div className="space-y-6">
                        <div className="flex justify-center">
                          <Button className="bg-white text-secondary-red hover:bg-gray-100 text-lg px-8 py-3" asChild>
                            <a href="/NoTrust">Sign the Petition</a>
                          </Button>
                        </div>
                        <p className="text-white/90 text-center max-w-md mx-auto">
                          Help protect Connecticut communities by urging Governor Lamont to veto this dangerous
                          legislation.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center">
                    {/* First Slide: Circular Logo */}
                    {index === 0 && (
                      <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-white md:h-80 md:w-80">
                        <Image
                          src="https://www.cthousegop.com/wp-content/uploads/2025/04/483233292_1346994719868798_7975581270295086386_n-1.png"
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
                    {/* Fourth Slide: Trust Act Image */}
                    {index === 3 && (
                      <div className="relative h-64 w-64 md:h-80 md:w-80">
                        <Image
                          src="/social/trust-act-facebook-ad.jpg"
                          alt="Tell Governor Lamont to Veto HB 7259"
                          fill
                          className="object-contain rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Navigation Arrows */}
      <div className="hidden md:flex absolute top-1/2 left-4 right-4 -translate-y-1/2 justify-between z-20 pointer-events-none">
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

      {/* Desktop Slide Indicators */}
      <div className="hidden md:flex justify-center py-4">
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
