"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Users, Shield, Play } from "lucide-react"
import { submitPetition } from "@/app/actions/petition-action"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { QuotesSection } from "@/components/quotes-section"
import { PetitionHeroSection } from "@/components/petition-hero-section" // Import the new component

export default function NoTrustClientPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [actualSignatureCount, setActualSignatureCount] = useState<number | null>(null)
  const [displayedSignatureCount, setDisplayedSignatureCount] = useState(0)

  const animationFrameId = useRef<number | null>(null)

  const [activeTrustVideoIndex, setActiveTrustVideoIndex] = useState(0)
  const [isTrustVideoPlaying, setIsTrustVideoPlaying] = useState(false)

  const trustActVideos = [
    {
      id: "vBU1i-HJfJE",
      title: "Rep. Candelora on Dems' Trust Act Expansion and GOP Amendment",
      description:
        "House GOP Leader Candelora speaks against CT Dems' Trust Act expansion and in favor of a Republican amendment to add more serious crimes to the list of scenarios where local police are permitted to communicate with ICE.",
    },
    {
      id: "Orx5ZPgSud4",
      title: "Legislation to Allow Illegal Immigrants to Sue CT Municipalities",
      description:
        "Discussion on proposed legislation that could allow undocumented immigrants to sue Connecticut municipalities under certain Trust Act related provisions.",
    },
    {
      id: "S2gic6qXY4Y",
      title: "The Trust Act is a Failed Policy",
      description:
        "Rep. Fishbein highlights issues with the Trust Act, labeling it a failed policy and discussing its impact on public safety.",
    },
  ]

  const handleTrustThumbnailClick = (index: number) => {
    if (index === activeTrustVideoIndex && isTrustVideoPlaying) return
    setActiveTrustVideoIndex(index)
    setIsTrustVideoPlaying(false) // Reset playing state so user has to click play
  }

  const handlePlayTrustVideo = () => {
    setIsTrustVideoPlaying(true)
  }

  useEffect(() => {
    const fetchSignatureCount = async () => {
      try {
        const response = await fetch("/api/admin/petition-analytics")
        if (response.ok) {
          const data = await response.json()
          // The API now returns the unique count as totalSignatures
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

    const targetCount = actualSignatureCount + 49 // Keep the +49 offset as requested
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
    // For simplicity, we'll always animate from 0 when actualSignatureCount is first set.
    // More complex logic could animate from current displayed to new target if actualSignatureCount updates later.
    if (displayedSignatureCount === 0 && targetCount > 0) {
      // Animate only if target is > 0
      animationFrameId.current = requestAnimationFrame(animateCount)
    } else if (targetCount !== displayedSignatureCount) {
      // If actualSignatureCount updates later, we can choose to re-animate or jump
      // For now, let's make it jump to the new target if it's not the initial load
      // Or, to always animate from 0 when actualSignatureCount changes:
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
    <div className="min-h-screen bg-gray-50">
      {/* Petition Hero Section - now a component */}
      <PetitionHeroSection
        isSubmitting={isSubmitting}
        submitted={submitted}
        formError={formError}
        successMessage={successMessage}
        displayedSignatureCount={displayedSignatureCount}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />

      <QuotesSection />

      {/* The Problem Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-navy mb-4">The Trust Act: From Protection to Problem</h2>
            <p className="text-xl text-gray-600">
              What started as a policy to build trust has become a threat to public safety
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2013: Original Intent</h3>
              <p className="text-gray-600">
                Build trust between law enforcement and undocumented residents to encourage cooperation
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2019: Dangerous Shift</h3>
              <p className="text-gray-600">
                Policy revised to protect individuals who pose real threats to communities
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2024: Expansion Risk</h3>
              <p className="text-gray-600">HB 7259 would further limit cooperation and create lawsuit pathways</p>
            </div>
          </div>

          {/* New YouTube Video Section */}
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Main video player (takes 2/3 width on md screens) */}
              <div className="md:col-span-2 bg-black rounded-lg shadow-lg overflow-hidden">
                {isTrustVideoPlaying ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${trustActVideos[activeTrustVideoIndex].id}?autoplay=1&rel=0`}
                    title={trustActVideos[activeTrustVideoIndex].title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full aspect-video"
                  ></iframe>
                ) : (
                  <div className="relative aspect-video cursor-pointer group" onClick={handlePlayTrustVideo}>
                    <Image
                      src={`https://img.youtube.com/vi/${trustActVideos[activeTrustVideoIndex].id}/hqdefault.jpg`}
                      alt={trustActVideos[activeTrustVideoIndex].title}
                      fill
                      className="object-cover"
                      priority={activeTrustVideoIndex === 0} // Prioritize loading the first image
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity opacity-0 group-hover:opacity-100">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 sm:p-4 transition-transform group-hover:scale-110">
                        <Play className="h-10 w-10 sm:h-12 sm:w-12 text-white fill-white" />
                      </div>
                    </div>
                    {/* Static play button for when not hovering, if desired */}
                    <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0">
                      <div className="bg-black/30 backdrop-blur-sm rounded-full p-3 sm:p-4">
                        <Play className="h-10 w-10 sm:h-12 sm:w-12 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-4 bg-white">
                  <h4 className="font-bold text-lg text-primary-navy">{trustActVideos[activeTrustVideoIndex].title}</h4>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                    {trustActVideos[activeTrustVideoIndex].description}
                  </p>
                </div>
              </div>

              {/* Video thumbnails (takes 1/3 width on md screens) */}
              <div className="md:col-span-1">
                <h4 className="text-lg font-semibold mb-3 text-primary-navy">More Videos</h4>
                <div className="space-y-3">
                  {trustActVideos.map((video, index) => (
                    <div
                      key={video.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 flex gap-3 p-2 rounded-lg items-center",
                        index === activeTrustVideoIndex
                          ? "bg-light-blue/30 border border-primary-navy shadow-md"
                          : "bg-gray-50 hover:bg-light-blue/20 border border-gray-200",
                      )}
                      onClick={() => handleTrustThumbnailClick(index)}
                    >
                      <div className="relative aspect-video w-28 sm:w-32 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                        {index !== activeTrustVideoIndex && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm text-primary-navy line-clamp-2">{video.title}</h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Cases Section */}
      <section className="py-16 bg-red-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-navy mb-4">Real Cases, Real Consequences</h2>
            <p className="text-xl text-gray-600">
              These aren't hypothetical scenarios—they're actual cases that show the Trust Act's failures
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Case 1 */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="flex items-start mb-4">
                <div className="bg-red-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary-navy mb-2">
                    Illegal Immigrant Accused of Crimes Against Minor Roams Free
                  </h3>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                A 44-year-old Honduran national, twice deported and arrested for crimes against a child, was released by
                local officials before ICE could file a detainer. He remained at large for nearly six months.
              </p>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-800 font-medium">
                  <strong>6 months</strong> - Time the suspect remained free due to Trust Act restrictions
                </p>
              </div>
            </div>

            {/* Case 2 */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="flex items-start mb-4">
                <div className="bg-red-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary-navy mb-2">Repeat Offender Released</h3>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                A previously-deported Peruvian national with a Connecticut criminal record was accused of sexual
                assault. Released on bond before ICE could intervene, he remained free for two weeks.
              </p>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-800 font-medium">
                  <strong>2 weeks</strong> - Additional time free due to communication barriers
                </p>
              </div>
            </div>

            {/* Case 3 */}
            <div className="bg-white rounded-lg p-8 shadow-md lg:col-span-2">
              <div className="flex items-start mb-4">
                <div className="bg-red-100 rounded-full p-2 mr-4 flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary-navy mb-2">
                    Convicted Child Predator Returns After Deportation
                  </h3>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                A shocking case involving an Ecuadorian national who was deported after a conviction for sexual assault
                of a minor, then illegally reentered the U.S. He was later arrested for driving under the influence,
                demonstrating how the Trust Act's communication barriers can allow dangerous offenders to remain in our
                communities.
              </p>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-800 font-medium">
                  <strong>Critical Question:</strong> How many more deported offenders have returned and remain
                  undetected due to Trust Act restrictions?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What HB 7259 Does Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-navy mb-4">What HB 7259 Actually Does</h2>
            <p className="text-xl text-gray-600">This expansion makes a bad situation worse</p>
          </div>

          <div className="space-y-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Prohibits Additional Local Officials from Cooperating with ICE
              </h3>
              <p className="text-red-700">
                Expands the list of officials who cannot communicate with federal immigration authorities, creating more
                gaps in law enforcement coordination.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Creates Lawsuit Pathways for Convicted Illegal Immigrants
              </h3>
              <p className="text-red-700">
                Astoundingly creates a prioritized pathway for convicted illegal immigrants to sue towns for
                communicating with federal officials, including paying attorney fees and costs if they prevail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-2xl font-bold text-primary-navy mb-6">Spread the Word</h3>
          <p className="text-gray-600 mb-8">
            Share this petition with your friends, family, and neighbors. Together, we can make a difference.
          </p>

          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "Stop the Trust Act Expansion",
                    text: "Join me in urging Governor Lamont to veto HB 7259 and protect Connecticut communities.",
                    url: window.location.href,
                  })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  alert("Link copied to clipboard!")
                }
              }}
            >
              Share This Page
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const text =
                  "I just signed a petition urging @GovNedLamont to veto HB 7259 and protect Connecticut communities. Join me: " +
                  window.location.href
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank")
              }}
            >
              Share on X
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
                window.open(url, "_blank")
              }}
            >
              Share on Facebook
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
