"use client"

import type React from "react"

interface LeaderCardProps {
  name: string
  title?: string
  imageUrl: string
  profileUrl: string
  large?: boolean
  small?: boolean
  xsmall?: boolean
}

const LeaderCard: React.FC<LeaderCardProps> = ({ name, title, imageUrl, profileUrl, large, small, xsmall }) => {
  let size = "w-48 h-48" // Default medium size
  if (large) size = "w-64 h-64"
  else if (small) size = "w-36 h-36"
  else if (xsmall) size = "w-24 h-24"

  return (
    <div className="flex flex-col items-center">
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-2 rounded-full overflow-hidden transition-transform portrait-hover"
      >
        <div className={`relative ${size} rounded-full overflow-hidden bg-gray-200 hover-zoom-container`}>
          {imageUrl ? (
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              className="w-full h-full object-cover hover-zoom"
              onError={(e) => {
                // If the image fails to load, hide it to show the gray background
                const target = e.target as HTMLImageElement
                target.style.display = "none"
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="sr-only">{name}</span>
            </div>
          )}
        </div>
      </a>
      <h3 className={`font-semibold text-center ${xsmall ? "text-sm" : "text-base"}`}>
        <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
          {name}
        </a>
      </h3>
      {title && <p className="text-xs text-gray-600 text-center">{title}</p>}
    </div>
  )
}

export default LeaderCard
