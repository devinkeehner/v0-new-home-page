"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export default function SearchBar({ initialQuery = "" }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (searchQuery) {
        params.set("search", searchQuery)
      } else {
        params.delete("search")
      }

      // Reset to page 1 when searching
      params.set("page", "1")

      router.push(`?${params.toString()}`)
    })
  }

  const clearSearch = () => {
    setSearchQuery("")

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("search")
      params.set("page", "1")
      router.push(`?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSearch} className="mb-6 flex w-full max-w-lg items-center gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search news articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
          disabled={isPending}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={isPending}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button type="submit" className="bg-secondary-red hover:bg-secondary-red/90" disabled={isPending}>
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  )
}
