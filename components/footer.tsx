import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import type { FooterContent } from "@/lib/content-manager"

interface FooterProps {
  content: FooterContent
}

export function Footer({ content }: FooterProps) {
  return (
    <footer className="bg-primary-navy text-white">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/images/ct-house-gop-optimized.webp"
                alt="Connecticut House Republicans"
                width={120}
                height={120}
                className="h-auto w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-white/80">{content.tagline}</p>
            <div className="mt-6 flex space-x-4">
              <Link href="https://facebook.com" className="text-white hover:text-accent-gold">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="https://twitter.com" className="text-white hover:text-accent-gold">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="https://instagram.com" className="text-white hover:text-accent-gold">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="https://youtube.com" className="text-white hover:text-accent-gold">
                <span className="sr-only">YouTube</span>
                <Youtube className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Resources</h3>
            <ul className="space-y-2">
              {content.resources.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/80 hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2">
              {content.quickLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/80 hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Contact Us</h3>
            <ul className="space-y-2">
              {content.contactInfo.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/80 hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-8 text-center">
          <p className="text-white/60">
            © {new Date().getFullYear()} Connecticut House Republicans. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
