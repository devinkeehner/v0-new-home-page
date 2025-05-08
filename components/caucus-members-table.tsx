"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { caucusMembers } from "@/lib/caucus_members_data"

type CaucusMember = {
  name: string
  nameUrl: string
  district: string
  contactUrl: string
}

export default function CaucusMembersTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const filteredMembers = caucusMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) || member.district.toString().includes(searchTerm),
  )

  return (
    <>
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
              <TableHead className="w-[100px]">District</TableHead>
              <TableHead className="w-[100px] text-right">Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={`${member.name}-${member.district}`}>
                <TableCell>
                  <a
                    href={member.nameUrl}
                    className="text-secondary-red hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {member.name}
                  </a>
                </TableCell>
                <TableCell className="font-medium">{member.district}</TableCell>
                <TableCell className="text-right">
                  <a
                    href={member.contactUrl}
                    className="inline-block bg-secondary-red text-white px-3 py-1 rounded-md hover:bg-secondary-red/90"
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
    </>
  )
}
