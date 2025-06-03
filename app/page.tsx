"use client"

import { useState, useEffect } from "react"
import { NewsCarousel } from "@/components/news-carousel"
import { PhotoGallery } from "@/components/photo-gallery"
import { getWordPressPosts } from "@/lib/api"
import SocialMediaSection from "@/components/social-media-section"

export default function Home() {
  // Fetch WordPress posts
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getWordPressPosts()
        setPosts(response.posts || [])
        console.log(`Successfully fetched ${response.posts?.length || 0} posts`)
      } catch (error) {
        console.error("Error fetching posts:", error)
      }
    }
    fetchPosts()
  }, [])

  return (
    <>
      {/* Other homepage content remains */}
      <NewsCarousel posts={posts} />
      <SocialMediaSection />
      <PhotoGallery />
    </>
  )
}
