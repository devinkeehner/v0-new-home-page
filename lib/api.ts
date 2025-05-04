// Sample fallback data in case the API fails
export const fallbackPosts = [
  {
    id: 1,
    title: {
      rendered: "House GOP Leader Votes Against Re-Appointment of Committee Chairman",
    },
    excerpt: {
      rendered:
        "House Republican Leader on Wednesday released the following statement in response to his vote on the re-appointment of Chairman of the Public Utilities Regulatory Authority...",
    },
    date: "2023-04-09T10:30:00",
    link: "https://www.cthousegop.com/news/1",
  },
  {
    id: 2,
    title: {
      rendered: "The Capitol Rundown: Republicans Talk Affordability, More",
    },
    excerpt: {
      rendered:
        "House Republican Leader this week joined Deputy Leader for an episode of The Capitol Rundown. Together, the Republican lawmakers touched on an array of issues on the legislative agenda—from tax policy and affordability to business competitiveness.",
    },
    date: "2023-04-05T14:15:00",
    link: "https://www.cthousegop.com/news/2",
  },
  {
    id: 3,
    title: {
      rendered: "State Lawmakers Applaud Grant Award for Family Resource Center Expansion Effort in East Haven",
    },
    excerpt: {
      rendered:
        "State Rep. Joe Zullo, House Minority Leader, and State Sen. Paul Cicarella on Tuesday applauded the approval of a $250,000 state grant to create planning for the expansion of the East Haven Family Resource Center.",
    },
    date: "2023-03-11T09:45:00",
    link: "https://www.cthousegop.com/news/3",
  },
  {
    id: 4,
    title: {
      rendered: "House Republicans Propose Budget Amendments to Provide Tax Relief",
    },
    excerpt: {
      rendered:
        "Connecticut House Republicans today unveiled a series of budget proposals that would provide meaningful tax relief to residents and businesses across the state.",
    },
    date: "2023-05-01T11:20:00",
    link: "https://www.cthousegop.com/news/4",
  },
  {
    id: 5,
    title: {
      rendered: "GOP Leaders Call for Action on Public Safety Legislation",
    },
    excerpt: {
      rendered:
        "House Republican Leaders today called for immediate action on several public safety bills that would address rising crime rates in Connecticut communities.",
    },
    date: "2023-04-28T16:30:00",
    link: "https://www.cthousegop.com/news/5",
  },
  {
    id: 6,
    title: {
      rendered: "Connecticut House Republicans Announce Education Initiative",
    },
    excerpt: {
      rendered:
        "House Republican Leaders unveiled a comprehensive education initiative aimed at addressing learning loss and improving educational outcomes for Connecticut students.",
    },
    date: "2023-04-22T13:45:00",
    link: "https://www.cthousegop.com/news/6",
  },
]

/**
 * Extracts JSON from a mixed HTML/JSON response
 * This handles the case where the WordPress API returns HTML before the JSON data
 */
function extractJsonFromMixedResponse(text: string): any {
  try {
    // First try to parse as is - maybe it's valid JSON
    return JSON.parse(text)
  } catch (e) {
    // If that fails, try to find JSON in the text
    try {
      // Look for the first '[' character which likely indicates the start of JSON array
      const jsonStartIndex = text.indexOf("[")
      if (jsonStartIndex >= 0) {
        const jsonText = text.substring(jsonStartIndex)
        return JSON.parse(jsonText)
      }

      // If no array found, look for object start
      const objectStartIndex = text.indexOf("{")
      if (objectStartIndex >= 0) {
        const jsonText = text.substring(objectStartIndex)
        return JSON.parse(jsonText)
      }
    } catch (innerError) {
      console.error("Failed to extract JSON from mixed response:", innerError)
    }

    // If all parsing attempts fail, throw the original error
    throw new Error(`Failed to parse response as JSON: ${text.substring(0, 200)}...`)
  }
}

export async function getWordPressPosts() {
  try {
    // Use a more robust fetch with proper headers and cache control
    const response = await fetch(
      "https://www.cthousegop.com/wp-json/wp/v2/posts?status=publish&per_page=20&orderby=date&order=desc&_embed",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "no-store", // Don't cache the response to avoid stale data
        next: { revalidate: 0 }, // Disable revalidation for now
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`)
    }

    // Get the response text instead of directly parsing as JSON
    const responseText = await response.text()

    // Try to extract JSON from the potentially mixed response
    try {
      const posts = extractJsonFromMixedResponse(responseText)
      return posts
    } catch (parseError) {
      console.error("Error parsing WordPress response:", parseError)
      console.log("Response preview:", responseText.substring(0, 500))
      return fallbackPosts
    }
  } catch (error) {
    console.error("Error fetching WordPress posts:", error)
    // Return fallback data instead of empty array
    return fallbackPosts
  }
}

export function formatWordPressDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function stripHtmlTags(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, "")
}

// Simplified function to get the featured image URL directly from the source
export function getFeaturedImageUrl(post: any): string {
  // Simply get the source_url directly if available
  if (
    post._embedded &&
    post._embedded["wp:featuredmedia"] &&
    post._embedded["wp:featuredmedia"][0] &&
    post._embedded["wp:featuredmedia"][0].source_url
  ) {
    return post._embedded["wp:featuredmedia"][0].source_url
  }

  // Return a placeholder if no featured image is found
  return "/news-collage.png"
}
