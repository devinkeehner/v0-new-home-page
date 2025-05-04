"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import type { HeroContent } from "@/lib/content-manager"

interface HeroProps {
  content: HeroContent
}

export function Hero({ content }: HeroProps) {
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

  return (
    <section className="relative overflow-hidden bg-primary-navy py-12 md:py-16 lg:py-20">
      <div className="absolute inset-0 z-0 opacity-20">
        <Image src="/placeholder.svg?key=kcx3j" alt="Background" fill className="object-cover" priority />
      </div>
      <div className="container relative z-10">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col justify-center text-white">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">{content.title}</h1>
            <p className="mb-6 max-w-md text-lg md:text-xl">{content.subtitle}</p>
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
            <p className="mt-2 text-sm text-white/80">{content.newsletterText}</p>
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
          </div>
        </div>
      </div>
    </section>
  )
}
