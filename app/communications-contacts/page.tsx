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

// The contacts data from the provided table
const contactsData: ContactInfo[] = [
  { representative: "Ackert, Tim", pressContact: "Joe Coss" },
  { representative: "Anderson, Mark", pressContact: "Greg Mackinnon" },
  { representative: "Aniskovich, Chris", pressContact: "Alexa Antonaras" },
  { representative: "Bolinsky, Mitch", pressContact: "John Dooley" },
  { representative: "Bronko, Seth", pressContact: "Jon Shugarts" },
  { representative: "Buchsbaum, Jason", pressContact: "Jillian Mauro" },
  { representative: "Buckbee, William", pressContact: "Greg Mackinnon" },
  { representative: "Callahan, Patrick", pressContact: "Jillian Mauro" },
  { representative: "Candelora, Vincent", pressContact: "Bryan Sundie", phoneNumber: "860-480-3068" },
  { representative: "Canino, Joe", pressContact: "Joe Coss" },
  { representative: "Carney, Devin", pressContact: "Jason Pheasant" },
  { representative: "Carpino, Christie", pressContact: "John Dooley" },
  { representative: "Case, Jay", pressContact: "Greg Mackinnon" },
  { representative: "Courpas, Tina", pressContact: "Jon Shugarts" },
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
  { representative: "Jensen, Arnie", pressContact: "Jamison Bazinet" },
  { representative: "Kennedy, Kathy", pressContact: "Joe Coss" },
  { representative: "Klarides-Ditria, Nicole", pressContact: "Jamison Bazinet" },
  { representative: "Lanoue, Brian", pressContact: "Michael Meadows" },
  { representative: "Marra, Tracy", pressContact: "Jamison Bazinet" },
  { representative: "Mastrofrancesco, Gale", pressContact: "Jon Shugarts" },
  { representative: "McGorty, Ben", pressContact: "Alexa Antonaras" },
  { representative: "Nuccio, Tammy", pressContact: "Jon Shugarts" },
  { representative: "O'Dea, Tom", pressContact: "Andrew Tammaro" },
  { representative: "Pavalock-D'Amato, Cara", pressContact: "Jason Pheasant" },
  { representative: "Piscopo, John", pressContact: "Greg MacKinnon" },
  { representative: "Pizzuto, Bill", pressContact: "Jillian Mauro" },
  { representative: "Polletta, Joe", pressContact: "Andrew Tammaro" },
  { representative: "Reddington-Hughes, Karen", pressContact: "Greg Mackinnon" },
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
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-center text-primary-navy mb-4">Communications Contacts</h1>
      <p className="text-center mb-8 max-w-3xl mx-auto">
        This page provides contact information for press inquiries related to Connecticut House Republican
        representatives. Each representative has a designated press contact who handles media requests and
        communications.
      </p>

      {/* Media Inquiries */}
      <div className="bg-light-blue/20 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold text-primary-navy mb-4">Members of the media:</h2>
        <p className="mb-4">
          If you're interested in speaking with a member of the House Republican Caucus, please use the chart below to
          identify the appropriate contact from our communications team.
        </p>
        <p className="font-bold">Office Switchboard: 860-240-8700</p>
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
            className="pl-10"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="mb-12 overflow-x-auto rounded-lg border shadow">
        <Table>
          <TableHeader className="bg-primary-navy text-white">
            <TableRow>
              <TableHead className="text-white">Representative</TableHead>
              <TableHead className="text-white">Press Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact, index) => (
              <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <TableCell className="font-medium">{contact.representative}</TableCell>
                <TableCell>
                  {contact.pressContact}
                  {contact.phoneNumber && <span className="ml-2 text-gray-500">({contact.phoneNumber})</span>}
                </TableCell>
              </TableRow>
            ))}
            {filteredContacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-4 text-gray-500">
                  No contacts found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Contact Information */}
    </div>
  )
}
