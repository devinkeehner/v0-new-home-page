"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface NewsArticle {
  id: number
  title: string
  excerpt: string
  date: string
  imageUrl: string
  url: string
}

export default function NewsroomPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      title:
        'CT House Republicans Unveil "Reality Check Budget" Focused on Affordability, Fiscal Discipline, and Protecting Connecticut\'s Future',
      excerpt:
        "HARTFORD — House Republicans on Thursday released their \"Reality Check Budget\" — a responsible, common-sense plan that directly addresses the fiscal challenges within household budgets and state government. In contrast to legislative Democrats' unchecked spending, the Reality Check Budget honors the fiscal guardrails and protects Connecticut's long-term fiscal health while reducing the size and cost of…",
      date: "May 1, 2025",
      imageUrl: "/placeholder.svg?height=300&width=500&query=Connecticut state capitol building",
      url: "https://www.cthousegop.com/ct-house-republicans-unveil-reality-check-budget-focused-on-affordability-fiscal-discipline-and-protecting-connecticuts-future/",
    },
    {
      id: 2,
      title: "House & Senate GOP Leaders Call for AG Tong to Investigate Possible Civil Rights Violations",
      excerpt:
        'HARTFORD—House Republican Leader Vincent Candelora and Senate Republican Leader Stephen Harding on Thursday urged Attorney General William Tong to investigate possible civil rights violations at Yale University, where pro-Palestinian protesters allegedly blocked Jewish students from accessing Beinecke Plaza and directed insults at them. "Attorney General Tong has repeatedly positioned himself as a champion of civil…',
      date: "April 25, 2025",
      imageUrl: "/placeholder.svg?height=300&width=500&query=Connecticut state flag",
      url: "https://www.cthousegop.com/house-senate-gop-leaders-call-for-ag-tong-to-investigate-possible-civil-rights-violations/",
    },
    {
      id: 3,
      title: "CT Republicans Call Out Ethical Lapses in State Government, Push for Stronger Accountability Measures",
      excerpt:
        "HARTFORD — Today, Connecticut House and Senate Republicans criticized the Lamont administration and legislative Democrats for fostering a culture of ethical lapses in state government, pointing to a troubling pattern of scandals and mismanagement. Citing controversies ranging from excessive spending in higher education to a canceled audit and misuse of government resources, Republicans called for an…",
      date: "March 27, 2025",
      imageUrl: "/placeholder.svg?height=300&width=500&query=Connecticut state government building",
      url: "https://www.cthousegop.com/corruptct/",
    },
    {
      id: 4,
      title: "PODCAST Capitol Rundown: CT House GOP Episode #3",
      excerpt:
        "Listen to our latest podcast which provides an inside look at our state government from the prospective of the CT House GOP. This week we delve in to the issue of public safety on our roads with State Rep. Greg Howard",
      date: "February 15, 2025",
      imageUrl: "/placeholder.svg?height=300&width=500&query=podcast microphone",
      url: "https://www.cthousegop.com/podcast-capitol-rundown-ct-house-gop-episode-3/",
    },
    {
      id: 5,
      title: "Testify to Remove the Public Benefits Charge from Your Electric Bill",
      excerpt:
        "Register To Testify*Registration deadline is 3:00 p.m. on Wednesday, March 5th. Submit Written Testimony Hearing Alert: Testify to Lower Your Energy Costs On Thursday, March 6th, you're invited to speak up about the high cost of energy. Earlier this year, House Republicans proposed a six-point plan aimed at reducing your utility bills, both now and…",
      date: "February 28, 2025",
      imageUrl: "/placeholder.svg?height=300&width=500&query=electric bill",
      url: "https://www.cthousegop.com/testify-to-remove-the-public-benefits-charge-from-your-electric-bill/",
    },
    // Add more news articles here
  ]

  const filteredArticles = newsArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-center text-primary-navy mb-4">Newsroom</h1>
      <Separator className="mb-8" />

      <div className="max-w-md mx-auto mb-8">
        <Input
          placeholder="Search news articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => <NewsCard key={article.id} article={article} />)
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg text-gray-500">No news articles found matching your search.</p>
          </div>
        )}
      </div>

      {filteredArticles.length > 0 && filteredArticles.length < newsArticles.length && (
        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => setSearchTerm("")}>
            Clear Search
          </Button>
        </div>
      )}
    </div>
  )
}

interface NewsCardProps {
  article: NewsArticle
}

function NewsCard({ article }: NewsCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <a href={article.url} target="_blank" rel="noopener noreferrer" className="block h-48 overflow-hidden">
        <img
          src={article.imageUrl || "/placeholder.svg"}
          alt={article.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </a>
      <CardHeader>
        <CardTitle className="text-lg">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-secondary-red transition-colors"
          >
            {article.title}
          </a>
        </CardTitle>
        <CardDescription>{article.date}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600">{article.excerpt}</p>
      </CardContent>
      <CardFooter>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary-red hover:underline text-sm font-medium"
        >
          Read More →
        </a>
      </CardFooter>
    </Card>
  )
}
