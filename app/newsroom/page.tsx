import { getWordPressPosts } from "@/lib/api"
import NewsroomClient from "./NewsroomClient"

export const metadata = {
  title: "Newsroom | Connecticut House Republicans",
  description: "Latest news and updates from the Connecticut House Republicans",
}

export default async function NewsroomPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  // Get pagination and search parameters
  const currentPage = Number(searchParams.page) || 1
  const searchQuery = searchParams.search || ""
  const postsPerPage = 9

  // Fetch posts with pagination and search
  const { posts, totalPages, totalPosts } = await getWordPressPosts(currentPage, postsPerPage, searchQuery)

  return (
    <NewsroomClient
      currentPage={currentPage}
      searchQuery={searchQuery}
      posts={posts}
      totalPages={totalPages}
      totalPosts={totalPosts}
    />
  )
}
