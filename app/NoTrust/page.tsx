"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Users, Shield, Scale, Loader2 } from "lucide-react"
import { submitPetition } from "@/app/actions/petition-action"

export default function NoTrustPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [signatureCount, setSignatureCount] = useState(0)

  useEffect(() => {
    // Fetch the current signature count
    const fetchSignatureCount = async () => {
      try {
        const response = await fetch("/api/admin/petition-analytics")
        if (response.ok) {
          const data = await response.json()
          setSignatureCount(data.totalSignatures || 0)
        }
      } catch (error) {
        console.error("Error fetching signature count:", error)
      }
    }

    fetchSignatureCount()
    // Refresh count every 30 seconds
    const interval = setInterval(fetchSignatureCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setFormError(null)
    setSuccessMessage(null)

    try {
      const result = await submitPetition(formData)

      if (result.success) {
        setSubmitted(true)
        setSuccessMessage(result.message)
        setSignatureCount((prev) => prev + 1)
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
      {/* Hero Section with Petition Form */}
      <section className="bg-primary-navy text-white py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Tell Governor Lamont to Veto the Trust Act Expansion
              </h1>
              <p className="text-xl mb-8 text-white/90">
                The Trust Act expansion puts Connecticut communities at risk. Join us in urging Governor Lamont to veto
                this dangerous legislation.
              </p>

              {/* Signature Counter */}
              <div className="text-center mb-8">
                <div className="inline-flex flex-col items-center rounded-lg bg-white/10 p-8 backdrop-blur-sm">
                  <div className="mb-2 text-6xl font-bold text-accent-gold">
                    {(signatureCount + 49).toLocaleString()}
                  </div>
                  <div className="text-xl text-white/90">Connecticut residents have signed</div>
                  <div className="mt-1 text-sm text-white/70">Join them in opposing the Trust Act expansion</div>
                </div>
              </div>
            </div>

            {/* Right Column - Petition Form */}
            <div className="bg-white rounded-lg p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-primary-navy mb-6">Sign the Petition</h2>

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
                      <Input id="firstName" name="firstName" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-black">
                        Last Name *
                      </Label>
                      <Input id="lastName" name="lastName" required className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-black">
                      Email *
                    </Label>
                    <Input id="email" name="email" type="email" required className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="mobile" className="text-black">
                      Mobile Phone
                    </Label>
                    <Input id="mobile" name="mobile" type="tel" className="mt-1" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zip" className="text-black">
                        Zip Code *
                      </Label>
                      <Input id="zip" name="zip" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="town" className="text-black">
                        Town *
                      </Label>
                      <Input id="town" name="town" required className="mt-1" />
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
                      className="mt-1"
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

          {/* Video Placeholder */}
          <div className="bg-gray-100 rounded-lg p-12 text-center mb-8">
            <div className="text-gray-400 mb-4">
              <div className="bg-gray-200 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-600">[Video: House Republican Leaders Explain the Trust Act Problems]</p>
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
                  <h3 className="text-xl font-semibold text-primary-navy mb-2">Wethersfield Case</h3>
                  <p className="text-sm text-gray-500 mb-3">March 2024</p>
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
                  <h3 className="text-xl font-semibold text-primary-navy mb-2">Hartford Case</h3>
                  <p className="text-sm text-gray-500 mb-3">April 2024</p>
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
                  <h3 className="text-xl font-semibold text-primary-navy mb-2">Sex Trafficking Case</h3>
                  <p className="text-sm text-gray-500 mb-3">Recent</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                A shocking sex trafficking case involving Ecuadorian nationals was only resolved because federal
                authorities were involved from the start. Had local police handled it alone, the Trust Act would have
                blocked communication with immigration officials.
              </p>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-800 font-medium">
                  <strong>Critical Question:</strong> How many cases like this go unresolved due to Trust Act
                  restrictions?
                </p>
              </div>
            </div>
          </div>

          {/* Image Placeholder */}
          <div className="mt-12 bg-white rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Scale className="h-16 w-16 mx-auto mb-4" />
            </div>
            <p className="text-gray-600">[Image: Justice and Public Safety Balance]</p>
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
                communicating with federal officials, including attorney fees and costs if they prevail.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Blocks State Agencies from Cooperation</h3>
              <p className="text-red-700">
                Some legislators want to prohibit state agencies like the Department of Children and Families from
                cooperating with ICE at all—even in cases involving child trafficking.
              </p>
            </div>
          </div>

          {/* Image Placeholder */}
          <div className="mt-12 bg-gray-100 rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
            </div>
            <p className="text-gray-600">[Image: HB 7259 Impact Infographic]</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-primary-navy text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Governor Lamont: Veto HB 7259</h2>
          <p className="text-xl mb-8 text-white/90">
            Join us in calling for a bipartisan effort to reform this policy and restore the balance between compassion
            and common sense.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-gold mb-2">Safety</div>
              <p className="text-white/80">Protect Connecticut communities</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-gold mb-2">Balance</div>
              <p className="text-white/80">Compassion with common sense</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-gold mb-2">Reform</div>
              <p className="text-white/80">Bipartisan policy solutions</p>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="bg-secondary-red hover:bg-secondary-red/90 text-white px-8 py-3 text-lg"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Sign the Petition Now
            </Button>
            <p className="text-white/80">Your voice matters. Help us protect Connecticut communities.</p>
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
