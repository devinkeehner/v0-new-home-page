"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { getReCaptchaSiteKey } from "@/app/actions/recaptcha-actions"

interface ReCaptchaProps {
  onVerify: (token: string) => void
  action: string
}

export default function ReCaptcha({ onVerify, action }: ReCaptchaProps) {
  const recaptchaRef = useRef<boolean>(false)
  const [siteKey, setSiteKey] = useState<string>("")

  useEffect(() => {
    // Fetch the site key from the server action
    async function fetchSiteKey() {
      try {
        const { siteKey } = await getReCaptchaSiteKey()
        setSiteKey(siteKey)
      } catch (error) {
        console.error("Failed to fetch reCAPTCHA site key:", error)
      }
    }

    fetchSiteKey()
  }, [])

  useEffect(() => {
    // Execute reCAPTCHA when the component mounts, Google reCAPTCHA script is loaded, and we have the site key
    if (typeof window !== "undefined" && window.grecaptcha && !recaptchaRef.current && siteKey) {
      executeReCaptcha()
    }
  }, [siteKey])

  const executeReCaptcha = async () => {
    if (typeof window !== "undefined" && window.grecaptcha && window.grecaptcha.execute && siteKey) {
      try {
        recaptchaRef.current = true
        const token = await window.grecaptcha.execute(siteKey, { action })
        onVerify(token)
      } catch (error) {
        console.error("reCAPTCHA execution error:", error)
      }
    }
  }

  // Handle script load
  const handleScriptLoad = () => {
    if (typeof window !== "undefined" && window.grecaptcha && siteKey) {
      window.grecaptcha.ready(() => {
        executeReCaptcha()
      })
    }
  }

  // Only render the script when we have the site key
  if (!siteKey) return null

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
        onLoad={handleScriptLoad}
        strategy="lazyOnload"
      />
      <div className="recaptcha-terms text-xs text-gray-500 mt-2">
        This site is protected by reCAPTCHA and the Google{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Privacy Policy
        </a>{" "}
        and{" "}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Terms of Service
        </a>{" "}
        apply.
      </div>
    </>
  )
}

// Add type definition for window.grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}
