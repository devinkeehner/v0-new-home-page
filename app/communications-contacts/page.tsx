"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Contact {
  name: string
  title: string
  email: string
  phone: string
  representatives: string[]
}

const communicationsContacts: Contact[] = [
  {
    name: "Jillian Mauro",
    title: "Communications Director",
    email: "jillian.mauro@cga.ct.gov",
    phone: "860-240-8790",
    representatives: [
      "Ackert, Tim",
      "Bazinet, Jamison",
      "Buchsbaum, Jason",
      "Callahan, Pat",
      "Carney, Devin",
      "Carpino, Christie",
      "Case, Jay",
      "Dathan, Tom",
      "DiGiovancarlo, Mitch",
      "Dubitsky, Doug",
      "Ferraro, Charles",
      "France, Mike",
      "Hall, Carol",
      "Harding, Stephen",
      "Harrison, Brenda",
      "Hennessy, Jane",
      "Howard, Gale",
      "Hull, Carol",
      "Mastrofrancesco, Gale",
      "McGorty, Ben",
      "Nolan, Arthur",
      "O'Dea, Tom",
      "Piscopo, John",
      "Rutigliano, Dave",
      "Sanchez, Irene",
      "Vail, Kathleen",
      "Wilson, Craig",
      "Yaccarino, Dave",
      "Zawistowski, Tami",
      "Zullo, Len",
      "Zupkus, Lezlye",
    ],
  },
  {
    name: "Marc Dillon",
    title: "Press Contact",
    email: "marc.dillon@cga.ct.gov",
    phone: "860-240-8792",
    representatives: [
      "Buckbee, Harry",
      "Reddington-Hughes, Kim",
      "Jensen, Craig",
      "Aksi, Kimberly",
      "Pizzuto, Bill",
      "Polletta, Joe",
    ],
  },
  {
    name: "Amanda Foster",
    title: "Communications Specialist",
    email: "amanda.foster@cga.ct.gov",
    phone: "860-240-8791",
    representatives: [
      "Candelora, Vincent",
      "Delnicki, Bill",
      "Haines, Brenda",
      "Labriola, David",
      "Lanoue, Nicole",
      "Perillo, Jason",
      "Simmons, Caroline",
      "Tammaro, Andrew",
      "Welander, Craig",
    ],
  },
]

export default function CommunicationsContactsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter contacts based on search term
  const filteredContacts = communicationsContacts.filter((contact) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.title.toLowerCase().includes(searchLower) ||
      contact.representatives.some((rep) => rep.toLowerCase().includes(searchLower))
    )
  })

  // Create a flat list of all representative assignments for easy searching
  const allAssignments = communicationsContacts.flatMap((contact) =>
    contact.representatives.map((rep) => ({
      representative: rep,
      contact: contact,
    })),
  )

  const filteredAssignments = allAssignments.filter(
    (assignment) =>
      assignment.representative.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.contact.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-navy mb-4">Communications Contacts</h1>
        <p className="text-lg text-gray-600 mb-6">
          Find the right communications contact for each House Republican representative.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by representative or staff name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Communications Staff */}
        <div>
          <h2 className="text-2xl font-bold text-secondary-red mb-6">Communications Staff</h2>
          <div className="space-y-6">
            {filteredContacts.map((contact, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-primary-navy">{contact.name}</CardTitle>
                  <p className="text-secondary-red font-medium">{contact.title}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p>
                      <strong>Email:</strong>{" "}
                      <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                        {contact.email}
                      </a>
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                        {contact.phone}
                      </a>
                    </p>
                  </div>
                  <div>
                    <strong className="text-sm text-gray-600">Assigned Representatives:</strong>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {contact.representatives
                        .filter((rep) => !searchTerm || rep.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((rep, repIndex) => (
                          <span
                            key={repIndex}
                            className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                          >
                            {rep}
                          </span>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Representative Directory */}
        <div>
          <h2 className="text-2xl font-bold text-secondary-red mb-6">Representative Directory</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Find Your Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredAssignments
                  .sort((a, b) => a.representative.localeCompare(b.representative))
                  .map((assignment, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="font-medium text-gray-900">{assignment.representative}</span>
                      <span className="text-sm text-secondary-red">{assignment.contact.name}</span>
                    </div>
                  ))}
              </div>
              {filteredAssignments.length === 0 && searchTerm && (
                <p className="text-gray-500 text-center py-4">No representatives found matching "{searchTerm}"</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
