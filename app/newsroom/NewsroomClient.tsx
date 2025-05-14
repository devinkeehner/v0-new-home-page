"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatWordPressDate, stripHtmlTags, getFeaturedImageUrl } from "@/lib/api"
import { Suspense } from "react"
import NewsroomLoading from "./loading"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import Pagination from "./pagination"
import SearchBar from "./search"

export default function NewsroomClient({
  currentPage,
  searchQuery,
  posts,
  totalPages,
  totalPosts,
}: {
  currentPage: number
  searchQuery: string
  posts: any[]
  totalPages: number
  totalPosts: number
}) {
  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold text-primary-navy">Newsroom</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Stay up to date with the latest news, press releases, and updates from the Connecticut House Republicans.
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-8 flex justify-center">
        <SearchBar initialQuery={searchQuery} />
      </div>

      <Suspense fallback={<NewsroomLoading />}>
        {posts.length > 0 ? (
          <>
            {searchQuery && (
              <p className="mb-4 text-center text-gray-600">
                Found {totalPosts} result{totalPosts !== 1 ? "s" : ""} for "{searchQuery}"
              </p>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => {
                const featuredImageUrl = getFeaturedImageUrl(post)
                const postSlug = post.slug || `${post.id}`

                return (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={featuredImageUrl || "/placeholder.svg?height=400&width=600&query=news"}
                        alt={post.title.rendered}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <Link href={`/${postSlug}`}>
                        <h2
                          className="mb-2 text-xl font-bold text-secondary-red hover:underline"
                          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                        />
                      </Link>
                      <p className="mb-2 text-sm text-gray-600">Posted on {formatWordPressDate(post.date)}</p>
                      <p className="mb-4 text-gray-700 line-clamp-3">{stripHtmlTags(post.excerpt.rendered)}</p>
                      <Button asChild className="bg-secondary-red hover:bg-secondary-red/90">
                        <Link href={`/${postSlug}`}>Read More</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} searchQuery={searchQuery} />
          </>
        ) : (
          <div className="mx-auto max-w-3xl">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Unable to load posts</AlertTitle>
              <AlertDescription className="flex flex-col gap-4">
                <p>
                  {searchQuery
                    ? `No results found for "${searchQuery}". Please try a different search term.`
                    : "Unable to load posts at this time. Please try again later."}
                </p>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = searchQuery ? `?search=${searchQuery}` : "/newsroom")}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retry
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </Suspense>
    </div>
  )
}
