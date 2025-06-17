"use client"

import { useState, useEffect } from "react"
import { getWordPressPosts } from "@/lib/api"
import { NewsCarousel } from "@/components/news-carousel"
import { PhotoGallery } from "@/components/photo-gallery"
import SocialMediaSection from "@/components/social-media-section"
import { BudgetTaxSlider } from "@/components/budget-tax-slider"

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
      <BudgetTaxSlider />
      <NewsCarousel posts={posts} />
      <SocialMediaSection />
      <PhotoGallery />
    </>
  )
}
