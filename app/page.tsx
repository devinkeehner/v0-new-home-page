"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { submitPetition } from "@/app/actions/petition-action"
import { NewsCarousel } from "@/components/news-carousel"
import { PhotoGallery } from "@/components/photo-gallery"
import { getWordPressPosts } from "@/lib/api"
import SocialMediaSection from "@/components/social-media-section"

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [actualSignatureCount, setActualSignatureCount] = useState<number | null>(null)
  const [displayedSignatureCount, setDisplayedSignatureCount] = useState(0)

  const animationFrameId = useRef<number | null>(null)

  // Fetch WordPress posts
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getWordPressPosts()
        setPosts(response.posts || [])
        console.log(`Successfully fetched ${response.posts?.length || 0} posts`)
      } catch (error) {
        console.error("Error fetching posts:", error)
      }
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    const fetchSignatureCount = async () => {
      try {
        const response = await fetch("/api/admin/petition-analytics")
        if (response.ok) {
          const data = await response.json()
          setActualSignatureCount(data.totalSignatures || 0)
        } else {
          setActualSignatureCount(0) // Set to 0 on error to avoid NaN issues
        }
      } catch (error) {
        console.error("Error fetching signature count:", error)
        setActualSignatureCount(0) // Set to 0 on error
      }
    }

    fetchSignatureCount()
    const interval = setInterval(fetchSignatureCount, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (actualSignatureCount === null) return

    const targetCount = actualSignatureCount + 49
    const animationDuration = 1500 // milliseconds
    const startTime = Date.now()

    const animateCount = () => {
      const elapsedTime = Date.now() - startTime
      const progress = Math.min(elapsedTime / animationDuration, 1)

      // Start from 0 for the initial animation
      const currentDisplay = Math.floor(progress * targetCount)
      setDisplayedSignatureCount(currentDisplay)

      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(animateCount)
      } else {
        setDisplayedSignatureCount(targetCount) // Ensure it ends exactly on target
      }
    }

    // Reset displayed count to 0 before starting animation if it's the initial load or a significant change
    if (displayedSignatureCount === 0 && targetCount > 0) {
      // Animate only if target is > 0
      animationFrameId.current = requestAnimationFrame(animateCount)
    } else if (targetCount !== displayedSignatureCount) {
      setDisplayedSignatureCount(0) // Reset to 0
      if (targetCount > 0) {
        animationFrameId.current = requestAnimationFrame(animateCount) // And restart animation
      } else {
        setDisplayedSignatureCount(targetCount) // If target is 0 or less, just set it
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [actualSignatureCount]) // Re-run animation when actualSignatureCount changes

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setFormError(null)
    setSuccessMessage(null)

    try {
      const result = await submitPetition(formData)

      if (result.success) {
        setSubmitted(true)
        setSuccessMessage(result.message)
        // Increment actual count locally to trigger re-animation
        setActualSignatureCount((prevCount) => (prevCount !== null ? prevCount + 1 : 1))
      } else {
        setFormError(result.message)
      }
    } catch (error) {
      console.error("Petition submission error:", error)
      setFormError("There was a problem submitting your petition. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setFormError(null)
    setSuccessMessage(null)
  }

  return (
    <>
      {/* Hero Section with Petition Form - from NoTrust page */}
      <section className="bg-primary-navy text-white py-16">
        <div className="container mx-auto max-w-6xl">
          {/* Full-width heading and subtext */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Tell Governor Lamont to Veto HB 7259</h1>
            <p className="text-xl mb-8 text-white/90 max-w-4xl">
              Connecticut House Republicans have issued a formal letter to Governor Lamont urging him to veto HB 7259,
              the dangerous Trust Act expansion. By signing this petition, you are adding your voice to protect
              Connecticut communities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* Left Column - Content */}
            <div className="flex flex-col justify-between">
              {/* Button and Counter Row */}
              <div className="mb-4">
                {/* View Letter Button */}
                <Button
                  onClick={() =>
                    window.open(
                      "https://www.cthousegop.com/wp-content/uploads/2025/05/Trust-Act_Lamont-5.28.25.pdf",
                      "_blank",
                    )
                  }
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  View the Official Letter to Governor Lamont
                </Button>
              </div>

              {/* YouTube Short Video */}
              <div className="bg-black rounded-lg shadow-xl overflow-hidden max-w-sm">
                <div className="aspect-[9/16]">
                  <iframe
                    src="https://www.youtube.com/embed/veTHr1T76Bc?autoplay=1&mute=1"
                    title="Trust Act Short Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Right Column - Petition Form */}
            <div className="bg-white rounded-lg p-8 shadow-xl h-full">
              <h2 className="text-2xl font-bold text-primary-navy mb-6">Sign the Petition</h2>

              {/* Signature Counter */}
              <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg border">
                <div className="text-4xl font-bold text-primary-navy mb-1">
                  {displayedSignatureCount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Connecticut residents have signed this petition</div>
              </div>

              {submitted ? (
                <Alert className="border-green-500 bg-green-50">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <AlertTitle className="text-green-700">Thank You!</AlertTitle>
                  <AlertDescription className="text-green-600">
                    {successMessage ||
                      "Your petition signature has been recorded. We'll keep you updated on our efforts to protect Connecticut communities."}
                  </AlertDescription>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="mt-4 border-green-500 text-green-700 hover:bg-green-50"
                  >
                    Sign Another Petition
                  </Button>
                </Alert>
              ) : (
                <form action={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-black">
                        First Name *
                      </Label>
                      <Input id="firstName" name="firstName" required className="mt-1 text-black" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-black">
                        Last Name *
                      </Label>
                      <Input id="lastName" name="lastName" required className="mt-1 text-black" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-black">
                      Email *
                    </Label>
                    <Input id="email" name="email" type="email" required className="mt-1 text-black" />
                  </div>

                  <div>
                    <Label htmlFor="mobile" className="text-black">
                      Mobile Phone
                    </Label>
                    <Input id="mobile" name="mobile" type="tel" className="mt-1 text-black" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zip" className="text-black">
                        Zip Code
                      </Label>
                      <Input id="zip" name="zip" className="mt-1 text-black" />
                    </div>
                    <div>
                      <Label htmlFor="town" className="text-black">
                        Town
                      </Label>
                      <Input id="town" name="town" className="mt-1 text-black" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="impact" className="text-black">
                      Tell us how this affects you
                    </Label>
                    <Textarea
                      id="impact"
                      name="impact"
                      placeholder="Share your concerns about the Trust Act expansion and how it impacts your community..."
                      rows={4}
                      className="mt-1 text-black"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-secondary-red hover:bg-secondary-red/90"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting Petition...
                      </>
                    ) : (
                      "Sign the Petition"
                    )}
                  </Button>

                  {formError && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}

                  <p className="text-xs text-gray-600 mt-4">
                    By signing this petition, you agree to receive updates about this issue and other Connecticut House
                    Republican initiatives.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <NewsCarousel posts={posts} />
      <SocialMediaSection />
      <PhotoGallery />
    </>
  )
}
