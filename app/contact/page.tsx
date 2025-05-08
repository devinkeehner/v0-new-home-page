"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"
import { getCaucusMembers } from "@/lib/caucus_members_data"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    issues: [] as string[],
    representative: "To General Mailbox",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submissionDetails, setSubmissionDetails] = useState({
    date: "",
    time: "",
    reference: "",
  })
  const [representatives, setRepresentatives] = useState<string[]>(["To General Mailbox"])

  useEffect(() => {
    const loadRepresentatives = async () => {
      try {
        // Get caucus members - they are already sorted by last name in the source data
        const caucusMembers = await getCaucusMembers()

        // Format each name with "Representative" prefix, maintaining the original order
        const repNames = caucusMembers.map((member) => `Representative ${member.name}`)

        // Add "To General Mailbox" as the first option
        setRepresentatives(["To General Mailbox", ...repNames])
      } catch (error) {
        console.error("Failed to load representatives:", error)
      }
    }

    loadRepresentatives()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, representative: value }))
  }

  const handleCheckboxChange = (issue: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      issues: checked ? [...prev.issues, issue] : prev.issues.filter((i) => i !== issue),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Generate submission details
    const now = new Date()
    const date = now.toLocaleDateString()
    const time = now.toLocaleTimeString()
    const reference = `REF-${Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")}`

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      setSubmissionDetails({
        date,
        time,
        reference,
      })
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zip: "",
        issues: [],
        representative: "To General Mailbox",
        message: "",
      })
    }, 1500)
  }

  const resetForm = () => {
    setSubmitted(false)
  }

  const issues = [
    "Budget & Taxes",
    "Jobs & Economy",
    "Transportation",
    "Education",
    "Veterans",
    "Seniors",
    "Mental Health & Addiction Services",
    "Environment",
  ]

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-center text-primary-navy mb-4">Contact Us</h1>
      <Separator className="mb-8" />

      <div className="max-w-3xl mx-auto">
        <p className="mb-8">
          Use the form below to send us your ideas or concerns about issues related to state government. The House
          Republican Office can also be reached by telephone at either (800) 842-1423 or (860) 240-8700.
        </p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <Alert className="border-green-500 bg-transparent">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <AlertTitle className="text-xl font-bold text-green-700">Thank You!</AlertTitle>
              <AlertDescription className="text-green-600">
                <p className="mb-4">
                  Your message has been submitted successfully. We'll get back to you as soon as possible.
                </p>
                <div className="bg-white p-4 rounded-md border border-green-100 mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Submission Details:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <span className="font-medium">Date:</span> {submissionDetails.date}
                    </li>
                    <li>
                      <span className="font-medium">Time:</span> {submissionDetails.time}
                    </li>
                    <li>
                      <span className="font-medium">Reference Number:</span> {submissionDetails.reference}
                    </li>
                    <li>
                      <span className="font-medium">Recipient:</span> {formData.representative}
                    </li>
                  </ul>
                </div>
                <p className="text-sm">
                  Please save this reference number for your records. If you need to follow up on your message, please
                  mention this reference number.
                </p>
              </AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Button onClick={resetForm}>Send Another Message</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                />
              </div>
              <div>
                <Label htmlFor="zip">Zip Code</Label>
                <Input id="zip" name="zip" value={formData.zip} onChange={handleChange} placeholder="Zip" />
              </div>
            </div>

            <div>
              <Label htmlFor="city">Town/City</Label>
              <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Town/City" />
            </div>

            <div>
              <Label className="mb-2 block">What issues are important to you?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {issues.map((issue) => (
                  <div key={issue} className="flex items-center space-x-2">
                    <Checkbox
                      id={`issue-${issue}`}
                      checked={formData.issues.includes(issue)}
                      onCheckedChange={(checked) => handleCheckboxChange(issue, checked as boolean)}
                    />
                    <Label htmlFor={`issue-${issue}`} className="cursor-pointer">
                      {issue}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="representative" className="mb-2 block">
                Is your message for a specific representative?
              </Label>
              <Select value={formData.representative} onValueChange={handleSelectChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a representative" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {representatives.map((rep) => (
                    <SelectItem key={rep} value={rep}>
                      {rep}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message">How Can We Help?</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Please enter your message here..."
                rows={6}
                required
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
