"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { formatWordPressDate, stripHtmlTags, getFeaturedImageUrl } from "@/lib/api"

export default function NewsroomPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const postsPerPage = 9

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)

        // Fetch posts directly from WordPress API with pagination
        const response = await fetch(
          `https://www.cthousegop.com/wp-json/wp/v2/posts?status=publish&per_page=${postsPerPage}&page=${currentPage}&orderby=date&order=desc&_embed`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            cache: "no-store",
          },
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status}`)
        }

        // Get total pages from headers
        const wpTotalPages = Number.parseInt(response.headers.get("X-WP-TotalPages") || "1", 10)
        setTotalPages(wpTotalPages)

        // Parse the response
        const responseText = await response.text()
        let fetchedPosts

        try {
          // Try to parse as JSON
          fetchedPosts = JSON.parse(responseText)
        } catch (parseError) {
          console.error("Error parsing WordPress response:", parseError)
          // Try to extract JSON from mixed response
          try {
            const jsonStartIndex = responseText.indexOf("[")
            if (jsonStartIndex >= 0) {
              const jsonText = responseText.substring(jsonStartIndex)
              fetchedPosts = JSON.parse(jsonText)
            } else {
              const objectStartIndex = responseText.indexOf("{")
              if (objectStartIndex >= 0) {
                const jsonText = responseText.substring(objectStartIndex)
                fetchedPosts = JSON.parse(jsonText)
              } else {
                throw new Error("Could not extract JSON from response")
              }
            }
          } catch (extractError) {
            console.error("Failed to extract JSON:", extractError)
            fetchedPosts = []
          }
        }

        setPosts(fetchedPosts)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [currentPage]) // Re-fetch when page changes

  // Filter posts based on search term
  const filteredPosts = posts.filter(
    (post) =>
      post.title.rendered.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stripHtmlTags(post.excerpt.rendered).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1) // Reset to first page on search
  }

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always show first page
      pageNumbers.push(1)

      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at the beginning
      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, maxVisiblePages - 1)
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - maxVisiblePages + 2)
      }

      // Add ellipsis before middle pages if needed
      if (start > 2) {
        pageNumbers.push("...")
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis after middle pages if needed
      if (end < totalPages - 1) {
        pageNumbers.push("...")
      }

      // Always show last page
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-center text-primary-navy mb-4">Newsroom</h1>
      <Separator className="mb-8" />

      <div className="max-w-md mx-auto mb-8">
        <Input
          placeholder="Search news articles..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="mb-2"
        />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-lg">Loading articles...</p>
        </div>
      ) : (
        <>
          {searchTerm ? (
            // When searching, show filtered posts
            filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <NewsCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-lg text-gray-500">No news articles found matching your search.</p>
                <Button variant="outline" onClick={() => setSearchTerm("")} className="mt-4">
                  Clear Search
                </Button>
              </div>
            )
          ) : // When not searching, show current page of posts
          posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500">No news articles available.</p>
            </div>
          )}

          {/* Pagination - only show when not searching */}
          {!searchTerm && totalPages > 1 && (
            <div className="flex justify-center items-center mt-10 gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevPage}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-1">
                {getPageNumbers().map((number, index) =>
                  typeof number === "number" ? (
                    <Button
                      key={index}
                      variant={currentPage === number ? "default" : "outline"}
                      size="sm"
                      onClick={() => paginate(number)}
                      className={currentPage === number ? "bg-secondary-red hover:bg-secondary-red/90" : ""}
                    >
                      {number}
                    </Button>
                  ) : (
                    <span key={index} className="px-2 flex items-center">
                      {number}
                    </span>
                  ),
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

interface NewsCardProps {
  post: any
}

function NewsCard({ post }: NewsCardProps) {
  const imageUrl = getFeaturedImageUrl(post)
  const postSlug = post.slug || `${post.id}`

  return (
    <Card className="h-full flex flex-col">
      <a href={`/post/${postSlug}`} className="block h-48 overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={stripHtmlTags(post.title.rendered)}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </a>
      <CardHeader>
        <CardTitle className="text-lg">
          <a
            href={`/post/${postSlug}`}
            className="hover:text-secondary-red transition-colors"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </CardTitle>
        <CardDescription>{formatWordPressDate(post.date)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">{stripHtmlTags(post.excerpt.rendered)}</p>
      </CardContent>
      <CardFooter>
        <a href={`/post/${postSlug}`} className="text-secondary-red hover:underline text-sm font-medium">
          Read More →
        </a>
      </CardFooter>
    </Card>
  )
}
