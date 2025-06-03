"use client"

import { PlayCircle, Volume2, VolumeX } from "lucide-react"
import { useState, useRef } from "react"

export function BudgetDebateBanner() {
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef<HTMLIFrameElement>(null)

  const toggleMute = () => {
    setIsMuted(!isMuted)
    // Note: Directly controlling iframe mute state from parent is complex due to cross-origin restrictions.
    // The mute state here primarily controls the icon. Autoplay with sound is browser-dependent.
    // For more robust control, you might need the YouTube IFrame Player API.
  }

  return (
    <div className="bg-gradient-to-r from-primary-navy via-blue-800 to-primary-navy text-white shadow-2xl">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="md:pr-8">
            <div className="flex items-center mb-3">
              <span className="relative flex h-3 w-3 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <p className="text-sm font-semibold uppercase tracking-wider text-secondary-red">Live Now</p>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight font-heading">
              State Budget Debate Underway
            </h1>
            <p className="text-lg lg:text-xl text-gray-300 mb-6">
              Tune in to the live proceedings from the House floor as representatives discuss and vote on the
              Connecticut state budget. Your future is being decided.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://www.youtube.com/watch?v=VT2nDrGm4hk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-navy bg-white hover:bg-gray-200 transition-colors"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Watch on YouTube
              </a>
              <button
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Autoplay with sound is subject to browser settings. You may need to unmute the video.
            </p>
          </div>
          <div className="mt-8 md:mt-0">
            <div
              className="relative w-full rounded-lg overflow-hidden shadow-xl border-4 border-white/20"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                ref={videoRef}
                src={`https://www.youtube.com/embed/VT2nDrGm4hk?autoplay=1&mute=${isMuted ? 1 : 0}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
                title="Live Budget Debate - Connecticut House Republicans"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
