"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Representative {
  name: string
  district: number
  contactUrl: string
  profileUrl: string
}

export default function CaucusMembersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const representatives: Representative[] = [
    {
      name: "Tim Ackert",
      district: 8,
      contactUrl: "https://www.cthousegop.com/Ackert/contact",
      profileUrl: "https://www.cthousegop.com/Ackert",
    },
    {
      name: "Mark Anderson",
      district: 62,
      contactUrl: "https://www.cthousegop.com/Anderson/contact",
      profileUrl: "https://www.cthousegop.com/Anderson",
    },
    {
      name: "Chris Aniskovich",
      district: 35,
      contactUrl: "https://www.cthousegop.com/Aniskovich/contact",
      profileUrl: "https://www.cthousegop.com/Aniskovich",
    },
    {
      name: "Mitch Bolinsky",
      district: 106,
      contactUrl: "https://www.cthousegop.com/Bolinsky/contact",
      profileUrl: "https://www.cthousegop.com/Bolinsky",
    },
    {
      name: "Seth Bronko",
      district: 70,
      contactUrl: "https://www.cthousegop.com/Bronko/contact",
      profileUrl: "https://www.cthousegop.com/Bronko",
    },
    {
      name: "Jason Buchsbaum",
      district: 69,
      contactUrl: "https://www.cthousegop.com/buchsbaum/contact/",
      profileUrl: "https://www.cthousegop.com/buchsbaum",
    },
    {
      name: "Bill Buckbee",
      district: 67,
      contactUrl: "https://www.cthousegop.com/Buckbee/contact",
      profileUrl: "https://www.cthousegop.com/Buckbee",
    },
    {
      name: "Patrick Callahan",
      district: 108,
      contactUrl: "https://www.cthousegop.com/Callahan/contact",
      profileUrl: "https://www.cthousegop.com/Callahan",
    },
    {
      name: "Vincent Candelora",
      district: 86,
      contactUrl: "https://www.cthousegop.com/Candelora/contact",
      profileUrl: "https://www.cthousegop.com/Candelora",
    },
    {
      name: "Joe Canino",
      district: 65,
      contactUrl: "https://www.cthousegop.com/canino/contact/",
      profileUrl: "https://www.cthousegop.com/canino",
    },
    {
      name: "Devin Carney",
      district: 23,
      contactUrl: "https://www.cthousegop.com/Carney/contact",
      profileUrl: "https://www.cthousegop.com/Carney",
    },
    {
      name: "Christie Carpino",
      district: 32,
      contactUrl: "https://www.cthousegop.com/Carpino/contact",
      profileUrl: "https://www.cthousegop.com/Carpino",
    },
    {
      name: "Jay Case",
      district: 63,
      contactUrl: "https://www.cthousegop.com/Case/contact",
      profileUrl: "https://www.cthousegop.com/Case/",
    },
    // Add all other representatives here
  ]

  const filteredRepresentatives = representatives.filter(
    (rep) => rep.name.toLowerCase().includes(searchTerm.toLowerCase()) || rep.district.toString().includes(searchTerm),
  )

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-center text-primary-navy mb-8">2025 Caucus Members</h1>

      <div className="mb-8">
        <p className="mb-4">
          The House Republican Caucus includes 53 state representatives from throughout Connecticut who serve in the
          151-seat
          <a
            href="https://www.cga.ct.gov/asp/menu/house.asp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-red hover:underline"
          >
            {" "}
            House of Representatives
          </a>
          . The caucus' members led by state Rep. Vincent Candelora, who in late 2020 was chosen by his colleagues for
          his first term as House Republican Leader. You can view the rest of the{" "}
          <a href="/leadership-team" className="text-secondary-red hover:underline">
            caucus leadership team here
          </a>
          .
        </p>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search by name or district..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md mx-auto"
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Representative</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRepresentatives.map((rep) => (
              <TableRow key={rep.name}>
                <TableCell>
                  <a
                    href={rep.profileUrl}
                    className="text-secondary-red hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {rep.name}
                  </a>
                </TableCell>
                <TableCell>{rep.district}</TableCell>
                <TableCell>
                  <a
                    href={rep.contactUrl}
                    className="text-secondary-red hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
