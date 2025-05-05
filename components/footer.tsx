import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary-navy text-white">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="https://www.cthousegop.com/wp-content/uploads/2025/04/483233292_1346994719868798_7975581270295086386_n-1.png"
                alt="Connecticut House Republicans"
                width={120}
                height={120}
                className="h-auto w-auto"
                loading="lazy"
              />
            </Link>
            <p className="mt-4 max-w-xs text-white/80">
              Fighting for Connecticut's families and businesses with common-sense solutions.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link
                href="https://www.facebook.com/pages/Connecticut-House-Republicans/117202885876"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent-gold"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </Link>
              <Link
                href="https://x.com/cthousegop"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent-gold"
              >
                <span className="sr-only">X</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6L18 18" />
                </svg>
              </Link>
              <Link
                href="https://www.instagram.com/cthousegop/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent-gold"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </Link>
              <Link
                href="https://www.youtube.com/user/CTHouseRepublicans"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent-gold"
              >
                <span className="sr-only">YouTube</span>
                <Youtube className="h-6 w-6" />
              </Link>
              <Link
                href="https://www.flickr.com/photos/cthouserepublicans/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent-gold"
              >
                <span className="sr-only">Flickr</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <circle cx="8" cy="12" r="3" />
                  <circle cx="16" cy="12" r="3" />
                </svg>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Caucus Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://www.cthousegop.com/leadership-team-2025/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  Leadership Team
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.cthousegop.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  House Republicans
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.cthousegop.com/caucus-newsroom/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  Caucus Newsroom
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.cthousegop.com/communications-contacts/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  Media Inquiries
                </Link>
              </li>
            </ul>

            <h3 className="mb-4 mt-8 text-lg font-bold">Legislative Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://search.cga.state.ct.us/r/basic/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  Bill &amp; Document Search
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.cga.ct.gov/asp/CGABillInfo/CGABillInfoRequest.asp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  Bill Information Search
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.cga.ct.gov/asp/menu/cgacommittees.asp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  Legislative Committees
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Documents &amp; Surveys</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://www.cga.ct.gov/olr/Documents/year/MA/2023MA-20230620_Major%20Acts%20for%202023.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  OLR Major Public Acts 2023
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.cthousegop.com/wp-content/uploads/2024/02/2024-R-0002.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  OLR Major Issues Report 2024
                </Link>
              </li>
            </ul>

            <h3 className="mb-4 mt-8 text-lg font-bold">Government</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://portal.ct.gov/en/Government/Departments-and-Agencies/Departments-and-Agencies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  Departments &amp; Agencies
                </Link>
              </li>
              <li>
                <Link
                  href="https://portal.ct.gov/governor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  Governor's Office
                </Link>
              </li>
              <li>
                <Link
                  href="https://openbudget.ct.gov/#!/year/default"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  State Budget
                </Link>
              </li>
              <li>
                <Link
                  href="https://opencheckbook.ct.gov/#!/year/2023/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  State Checkbook
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Contact Us</h3>
            <p className="text-white/80">
              Legislative Office Building, Room 4200
              <br />
              300 Capitol Avenue
              <br />
              Hartford, CT 06106
              <br />
              <br />
              860-240-8700
              <br />
              800-842-1423
            </p>

            <h3 className="mb-4 mt-8 text-lg font-bold">Citizen Guide</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://cga.ct.gov/red"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  2021 Redistricting Project
                </Link>
              </li>
              <li>
                <Link
                  href="https://portal.ct.gov/en/About"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  About Connecticut
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.cga.ct.gov/asp/content/yourvoice.asp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  How to Testify
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
