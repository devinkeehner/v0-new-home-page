"use client"

import { CheckCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

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

export function TaxReliefSection() {
  return (
    <section className="py-12 bg-[#F5F5F5]">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-primary-navy mb-6 text-center">Tax Relief for Connecticut</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Tax Relief Options */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-primary-navy mb-4">Tax Relief Options</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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

            <div className="text-center">
              <Button className="bg-secondary-red hover:bg-secondary-red/90" asChild>
                <a href="https://realitycheckct.com/#choose-your-tax-relief" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Build Your Own Tax Relief Plan
                </a>
              </Button>
            </div>
          </div>

          {/* Right Column: Benefits */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-primary-navy mb-4">How This Helps Connecticut Residents</h3>

            <div className="space-y-6">
              <div className="bg-primary-navy text-white p-4 rounded-lg">
                <h4 className="font-bold mb-3">Key Benefits</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-gold mt-1 mr-3 flex-shrink-0" />
                    <span>Provides meaningful relief to middle-class families</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-gold mt-1 mr-3 flex-shrink-0" />
                    <span>Reduces tax burden on small businesses to promote growth</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-gold mt-1 mr-3 flex-shrink-0" />
                    <span>Helps seniors by eliminating tax on pensions and social security</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-gold mt-1 mr-3 flex-shrink-0" />
                    <span>Makes Connecticut more affordable for all residents</span>
                  </li>
                </ul>
              </div>

              <div className="bg-secondary-red/10 p-4 rounded-lg">
                <h4 className="font-bold text-secondary-red mb-3">Key Facts</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary-red mt-0.5 mr-2 flex-shrink-0" />
                    <span>$320 million in total tax relief</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary-red mt-0.5 mr-2 flex-shrink-0" />
                    <span>Targets relief to those who need it most</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary-red mt-0.5 mr-2 flex-shrink-0" />
                    <span>Maintains fiscal responsibility</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary-red mt-0.5 mr-2 flex-shrink-0" />
                    <span>Part of a comprehensive budget plan</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
