"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, AlertCircle } from "lucide-react"

interface FacebookPost {
  id: string
  message?: string
  permalink_url: string
  created_time: string
  full_picture?: string
  attachments?: {
    data: Array<{
      media_type?: string
      media_url?: string
      type?: string
      url?: string
      target?: {
        url?: string
      }
    }>
  }
}

interface FacebookFeedResponse {
  data?: FacebookPost[]
  error?: string
  message?: string
  tokenExpired?: boolean
}

export default function FacebookFeedMasonry() {
  const [posts, setPosts] = useState<FacebookPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tokenExpired, setTokenExpired] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/fb-feed")
        const data: FacebookFeedResponse = await response.json()

        if (data.error) {
          console.error("Facebook API error:", data.error)
          setError(data.message || data.error)
          setTokenExpired(data.tokenExpired || false)
          setPosts([]) // Set empty posts array
        } else if (data.data) {
          setPosts(data.data)
          setError(null)
          setTokenExpired(false)
        } else {
          setPosts([])
          setError("No posts available")
        }
      } catch (err) {
        console.error("Error fetching Facebook posts:", err)
        setError("Failed to load Facebook posts")
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const truncateMessage = (message: string, maxLength = 200) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + "..."
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">Latest from Facebook</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Latest from Facebook</h2>

      {error && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {tokenExpired
              ? "Facebook feed temporarily unavailable - token needs refresh. Please check back later."
              : error}
          </AlertDescription>
        </Alert>
      )}

      {posts.length === 0 && !loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            {error ? "Unable to load Facebook posts at this time." : "No Facebook posts available."}
          </p>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Follow us on social media:</p>
            <div className="flex justify-center space-x-4">
              <a
                href="https://www.facebook.com/cthousegop"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Facebook Page
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                {post.full_picture && (
                  <div className="mb-3">
                    <img
                      src={post.full_picture || "/placeholder.svg"}
                      alt="Facebook post"
                      className="w-full h-48 object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>
                )}

                {post.message && (
                  <p className="text-gray-800 mb-3 text-sm leading-relaxed">{truncateMessage(post.message)}</p>
                )}

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{formatDate(post.created_time)}</span>
                  <a
                    href={post.permalink_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Post
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
