"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

// Define props for the component
interface PetitionHeroSectionProps {
  isSubmitting: boolean
  submitted: boolean
  formError: string | null
  successMessage: string | null
  displayedSignatureCount: number
  handleSubmit: (formData: FormData) => Promise<void>
  resetForm: () => void
}

export function PetitionHeroSection({
  isSubmitting,
  submitted,
  formError,
  successMessage,
  displayedSignatureCount,
  handleSubmit,
  resetForm,
}: PetitionHeroSectionProps) {
  return (
    <section className="bg-primary-navy text-white py-16">
      <div className="container mx-auto max-w-6xl">
        {/* Full-width heading and subtext */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Tell Governor Lamont to Veto HB 7259</h1>
          <p className="text-xl mb-8 text-white/90 max-w-4xl">
            Connecticut House Republicans have issued a formal letter to Governor Lamont urging him to veto HB 7259, the
            dangerous Trust Act expansion. By signing this petition, you are adding your voice to protect Connecticut
            communities.
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
            <div className="mt-6 text-center text-primary-navy">
             
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
