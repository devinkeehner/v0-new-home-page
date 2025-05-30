"use client"

import { Quote } from "lucide-react"

const quotes = [
  {
    text: "This state should not be in the business of harboring criminals who continue to commit crimes against our taxpaying citizens.",
  },
  {
    text: "We all want criminals to be stopped, and we want our communities and our country to be safe.",
  },
  {
    text: "Illegal is illegal. Please focus on the taxpayers who live and work in CT. Don't normalize criminals.",
  },
  {
    text: "I don't feel safe with criminal illegal immigrants in my town and state. Deport them all and veto the Trust Act.",
  },
  {
    text: "The Trust Act expansion will make my community less safe. Democrats were elected to serve and protect Americans, not illegal aliens.",
  },
  {
    text: "I'm tired of the Governor choosing dangerous criminal illegal immigrants over American citizens' and legal immigrants' safety in Connecticut.",
  },
]

export function QuotesSection() {
  return (
    <section className="py-12 md:py-16 bg-secondary-red/10 dark:bg-secondary-red/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-navy dark:text-white">
            Voices from Our Community
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">
            Hear what Connecticut residents are saying about the Trust Act.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {quotes.map((quote, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col border-l-4 border-secondary-red"
            >
              <Quote className="w-8 h-8 text-secondary-red dark:text-red-400 mb-4 transform rotate-180" />
              <blockquote className="text-gray-700 dark:text-gray-200 text-lg italic mb-4 flex-grow">
                "{quote.text}"
              </blockquote>
              <div className="flex justify-end">
                <Quote className="w-6 h-6 text-secondary-red/70 dark:text-red-400/70" />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10 md:mt-14">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            These are real concerns from your neighbors. Make your voice heard too.
          </p>
        </div>
      </div>
    </section>
  )
}
