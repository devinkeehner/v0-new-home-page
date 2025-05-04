import Image from "next/image"
import { Facebook, Twitter, Instagram } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Sample social media posts
const socialPosts = [
  {
    id: 1,
    platform: "facebook",
    content:
      "House Republican Leader today joined Deputy Leader David Rutigliano for an episode of The Capitol Rundown. Together, they discussed tax policy and affordability issues facing Connecticut residents.",
    image: "/placeholder.svg?height=400&width=400&query=connecticut state capitol discussion",
    date: "2 days ago",
    likes: 45,
    shares: 12,
  },
  {
    id: 2,
    platform: "instagram",
    content: "Weekly Wrap: The latest updates from the Connecticut House Republicans",
    image: "/placeholder.svg?height=400&width=400&query=connecticut legislature weekly wrap",
    date: "3 days ago",
    likes: 78,
  },
  {
    id: 3,
    platform: "twitter",
    content:
      "Today I joined a rally at the Capitol to support our proposal for a more affordable Connecticut with a state budget proposal that lowers taxes, protects services, and sets the state government's finances on a sustainable course.",
    image: "/placeholder.svg?height=400&width=400&query=connecticut tax rally",
    date: "1 week ago",
    likes: 32,
    retweets: 8,
  },
  {
    id: 4,
    platform: "facebook",
    content:
      "I joined my colleagues today to unveil our plan to address the affordable housing crisis in Connecticut. Our proposal focuses on increasing housing supply while maintaining local control.",
    image: "/placeholder.svg?height=400&width=400&query=connecticut affordable housing press conference",
    date: "1 week ago",
    likes: 67,
    shares: 23,
  },
  {
    id: 5,
    platform: "instagram",
    content:
      "Proud to stand with first responders today as we introduced legislation to enhance public safety across Connecticut.",
    image: "/placeholder.svg?height=400&width=400&query=connecticut first responders ceremony",
    date: "2 weeks ago",
    likes: 124,
  },
  {
    id: 6,
    platform: "twitter",
    content:
      "Connecticut taxpayers deserve better. Our budget amendments would provide immediate relief while ensuring fiscal responsibility.",
    image: "/placeholder.svg?height=400&width=400&query=connecticut budget document",
    date: "2 weeks ago",
    likes: 56,
    retweets: 18,
  },
]

export function SocialFeed() {
  return (
    <section className="bg-light-blue/20 py-12">
      <div className="container">
        <h2 className="mb-8 text-center text-3xl font-bold text-primary-navy">Social Media</h2>

        <div className="masonry-grid">
          {socialPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              {post.image && (
                <div className="relative h-48 w-full">
                  <Image src={post.image || "/placeholder.svg"} alt="" fill className="object-cover" />
                </div>
              )}
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  {post.platform === "facebook" && <Facebook className="h-5 w-5 text-blue-600" />}
                  {post.platform === "twitter" && <Twitter className="h-5 w-5 text-sky-500" />}
                  {post.platform === "instagram" && <Instagram className="h-5 w-5 text-pink-600" />}
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                </div>
                <p className="mb-2">{post.content}</p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  {post.likes && <span>{post.likes} Likes</span>}
                  {post.shares && <span>{post.shares} Shares</span>}
                  {post.retweets && <span>{post.retweets} Retweets</span>}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 p-2">
                <Button variant="ghost" size="sm" className="w-full">
                  View on {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
