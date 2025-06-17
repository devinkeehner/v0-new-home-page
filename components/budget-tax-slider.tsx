"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, Loader2 } from "lucide-react"
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
]

export function BudgetTaxSlider() {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFocus = () => {
    if (!isExpanded) {
      setIsExpanded(true)
    }
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
        <div className="py-12 px-4 min-h-[600px] flex items-center bg-primary-navy">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-4xl md:text-4xl lg:text-5xl font-bold mb-4 font-sans text-[#FFD700] whitespace-pre-line">
                  Connecticut
                  <br />
                  House Republicans
                </h2>
                <p className="text-xl mb-6 text-white/80">
                  Fighting for Connecticut's families and businesses with common-sense solutions.
                </p>

                <div className="w-full max-w-md">
                  {formSubmitted ? (
                    <Alert className="border-green-500 bg-green-50 bg-opacity-90 text-white border-white/30">
                      <CheckCircle className="h-5 w-5 text-green-500 text-black" />
                      <AlertTitle className="text-black">Thank you for signing up!</AlertTitle>
                      <AlertDescription className="text-black/90">
                        You've been successfully added to our mailing list. We'll keep you updated with the latest news
                        and information.
                      </AlertDescription>
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="mt-2 border-white/30 text-black hover:bg-white/10 hover:text-white"
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
              </div>

              <div className="flex items-center justify-center">
                <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-white md:h-80 md:w-80">
                  <Image
                    src="https://www.cthousegop.com/wp-content/uploads/2025/04/483233292_1346994719868798_7975581270295086386_n-1.png"
                    alt="Connecticut House Republicans"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
