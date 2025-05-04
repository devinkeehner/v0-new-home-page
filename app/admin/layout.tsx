import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold text-primary-navy">Admin Dashboard</h1>
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Website
            </Button>
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
