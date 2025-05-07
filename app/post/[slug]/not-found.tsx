import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-20">
      <h1 className="mb-4 text-4xl font-bold text-primary-navy">Post Not Found</h1>
      <p className="mb-8 text-center text-lg text-gray-600">
        Sorry, the post you are looking for does not exist or has been removed.
      </p>
      <Button asChild className="bg-secondary-red hover:bg-secondary-red/90">
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  )
}
