"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"

// Define the structure for our contacts data
interface ContactInfo {
  representative: string
  pressContact: string
  phoneNumber?: string
}

// The complete contacts data from the provided information
const contactsData: ContactInfo[] = [
  { representative: "Ackert, Tim", pressContact: "Joe Coss" },
  { representative: "Anderson, Mark", pressContact: "Greg Mackinnon" },
  { representative: "Aniskovich, Chris", pressContact: "Jon Shugarts" },
  { representative: "Bolinsky, Mitch", pressContact: "John Dooley" },
  { representative: "Bronko, Seth", pressContact: "Jon Shugarts" },
  { representative: "Buchsbaum, Jason", pressContact: "Jillian Mauro" },
  { representative: "Buckbee, William", pressContact: "Marc Dillon" },
  { representative: "Callahan, Patrick", pressContact: "Jillian Mauro" },
  { representative: "Candelora, Vincent", pressContact: "Bryan Sundie", phoneNumber: "860-480-3068" },
  { representative: "Canino, Joe", pressContact: "Joe Coss" },
  { representative: "Carney, Devin", pressContact: "Jason Pheasant" },
  { representative: "Carpino, Christie", pressContact: "John Dooley" },
  { representative: "Case, Jay", pressContact: "Greg Mackinnon" },
  { representative: "Courpas, Tina", pressContact: "Joe Coss" },
  { representative: "Dauphinais, Anne", pressContact: "Michael Meadows" },
  { representative: "DeCaprio, Mark", pressContact: "Michael Meadows" },
  { representative: "Delnicki, Tom", pressContact: "John Dooley" },
  { representative: "Dubitsky, Doug", pressContact: "Michael Meadows" },
  { representative: "Fishbein, Craig", pressContact: "Jamison Bazinet" },
  { representative: "Foncello, Marty", pressContact: "Jillian Mauro" },
  { representative: "Haines, Irene", pressContact: "Alexa Antonaras" },
  { representative: "Hall, Carol", pressContact: "Jason Pheasant" },
  { representative: "Howard, Greg", pressContact: "John Dooley" },
  { representative: "Hoxha, Joe", pressContact: "Alexa Antonaras" },
  { representative: "Jensen, Arnie", pressContact: "Marc Dillon" },
  { representative: "Kennedy, Kathy", pressContact: "Joe Coss" },
  { representative: "Klarides-Ditria, Nicole", pressContact: "Jamison Bazinet" },
  { representative: "Lanoue, Brian", pressContact: "Michael Meadows" },
  { representative: "Marra, Tracy", pressContact: "Jamison Bazinet" },
  { representative: "Mastrofrancesco, Gale", pressContact: "Jon Shugarts" },
  { representative: "McGorty, Ben", pressContact: "Jamison Bazinet" },
  { representative: "Nuccio, Tammy", pressContact: "Jon Shugarts" },
  { representative: "O'Dea, Tom", pressContact: "Andrew Tammaro" },
  { representative: "Pavalock-D'Amato, Cara", pressContact: "Jason Pheasant" },
  { representative: "Piscopo, John", pressContact: "Greg MacKinnon" },
  { representative: "Pizzuto, Bill", pressContact: "Jillian Mauro" },
  { representative: "Polletta, Joe", pressContact: "Marc Dillon" },
  { representative: "Reddington-Hughes, Karen", pressContact: "Marc Dillon" },
  { representative: "Romano, Amy", pressContact: "Andrew Tammaro" },
  { representative: "Rutigliano, Dave", pressContact: "John Dooley" },
  { representative: "Scott, Tony", pressContact: "Jillian Mauro" },
  { representative: "Stewart, Chris", pressContact: "Michael Meadows" },
  { representative: "Vail, Kurt", pressContact: "Greg Mackinnon" },
  { representative: "Veach, Donna", pressContact: "Jason Pheasant" },
  { representative: "Weir, Steve", pressContact: "Jason Pheasant" },
  { representative: "Yaccarino, Dave", pressContact: "Alexa Antonaras" },
  { representative: "Zawistowski, Tami", pressContact: "Jamison Bazinet" },
  { representative: "Zullo, Joe", pressContact: "Joe Coss" },
  { representative: "Zupkus, Lezlye", pressContact: "Jon Shugarts" },
]

export default function CommunicationsContactsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter contacts based on search term
  const filteredContacts = contactsData.filter(
    (contact) =>
      contact.representative.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.pressContact.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-center text-[#1e3a8a] mb-6">Communications Contacts</h1>

      <p className="text-center mb-8 max-w-4xl mx-auto text-gray-700 leading-relaxed">
        This page provides contact information for press inquiries related to Connecticut House Republican
        representatives. Each representative has a designated press contact who handles media requests and
        communications.
      </p>

      {/* Media Inquiries Section */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8 border-l-4 border-[#1e3a8a]">
        <h2 className="text-xl font-bold text-[#1e3a8a] mb-4">Members of the media:</h2>
        <p className="mb-4 text-gray-700">
          If you're interested in speaking with a member of the House Republican Caucus, please use the chart below to
          identify the appropriate contact from our communications team.
        </p>
        <p className="font-bold text-gray-900">Office Switchboard: 860-240-8700</p>
      </div>

      {/* Search Input */}
      <div className="mb-6 flex items-center max-w-md mx-auto">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by representative or press contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#1e3a8a] hover:bg-[#1e3a8a]">
              <TableHead className="text-white font-semibold py-4 px-6">Representative</TableHead>
              <TableHead className="text-white font-semibold py-4 px-6">Press Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact, index) => (
              <TableRow
                key={index}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}
              >
                <TableCell className="font-medium py-4 px-6 text-gray-900">{contact.representative}</TableCell>
                <TableCell className="py-4 px-6 text-gray-700">
                  {contact.pressContact}
                  {contact.phoneNumber && <span className="ml-2 text-gray-500 text-sm">({contact.phoneNumber})</span>}
                </TableCell>
              </TableRow>
            ))}
            {filteredContacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                  No contacts found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
