import { Separator } from "@/components/ui/separator"

export default function CommitteesPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-center text-primary-navy mb-8">2025 - 2027 Committee Assignments</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <CommitteeCard
          title="Appropriations"
          rankingMember="Tammy Nuccio"
          members={[
            "Tim Ackert",
            "Mitch Bolinsky",
            "Tina Courpas",
            "Mark DeCaprio",
            "Tom Delnicki",
            "Marty Foncello",
            "Joe Hoxha",
            "Kathleen Kennedy",
            "Cara Pavalock-D'Amato",
          ]}
        />

        <CommitteeCard
          title="Finance, Revenue & Bonding"
          rankingMember="Joe Polletta"
          members={[
            "Devin Carney",
            "Irene Haines",
            "Arnie Jensen",
            "Nicole Klarides-Ditria",
            "Jason Perillo",
            "John Piscopo",
            "Dave Rutigliano",
            "Donna Veach",
            "Dave Yaccarino",
            "Tami Zawistowski",
            "Joe Zullo",
            "Lezlye Zupkus",
          ]}
          notes={[
            "*General Bonding Sub-Committee- John Piscopo- RM",
            "* Transportation Bonding Sub- Committee- Jason Perillo - RM",
          ]}
        />

        <CommitteeCard
          title="Education"
          rankingMember="Lezlye Zupkus"
          members={[
            "Mark Anderson",
            "Mitch Bolinsky",
            "Devin Carney",
            "Tina Courpas",
            "Anne Dauphinais",
            "Marty Foncello",
            "Irene Haines",
            "Greg Howard",
            "Kathleen Kennedy",
            "Karen Reddington-Hughes",
            "Chris Stewart",
          ]}
          subcommittees={[
            {
              name: "Special Education",
              rankingMember: "Tina Courpas",
              members: ["Mitch Bolinsky", "Tammy Nuccio", "Lezlye Zupkus"],
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <CommitteeCard
          title="Environment"
          rankingMember="Patrick Callahan"
          members={[
            "Mark Anderson",
            "Doug Dubitsky",
            "Carol Hall",
            "Tom O'Dea",
            "John Piscopo",
            "Joe Polletta",
            "Karen Reddington-Hughes",
            "Chris Stewart",
            "Donna Veach",
          ]}
        />

        <CommitteeCard
          title="Government Administration & Elections"
          rankingMember="Gale Mastrofrancesco"
          members={["Seth Bronko", "Christie Carpino", "Marty Foncello", "Joe Hoxha"]}
        />

        <CommitteeCard
          title="Judiciary"
          rankingMember="Craig Fishbein"
          members={[
            "Pat Callahan",
            "Mark DeCaprio",
            "Doug Dubitsky",
            "Greg Howard",
            "Tom O'Dea",
            "Cara Pavalock-D'Amato",
            "Dave Rutigliano",
            "Donna Veach",
          ]}
        />
      </div>

      {/* Additional committee sections would continue here */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <CommitteeCard
          title="Planning & Development"
          rankingMember="Joe Zullo"
          members={["Tom Delnicki", "Doug Dubitsky", "Irene Haines", "Tami Zawistowski"]}
        />

        <CommitteeCard
          title="Transportation"
          rankingMember="Kathy Kennedy"
          members={[
            "Mark Anderson",
            "Seth Bronko",
            "Pat Callahan",
            "Devin Carney",
            "Carol Hall",
            "Tracy Marra",
            "Tom O'Dea",
            "Tami Zawistowski",
          ]}
        />

        <CommitteeCard
          title="Public Health"
          rankingMember="Nicole Klarides-Ditria"
          members={[
            "Christie Carpino",
            "Anne Dauphinais",
            "Kathleen Kennedy",
            "Tracy Marra",
            "Jason Perillo",
            "Joe Polletta",
            "Karen Reddinton-Hughes",
            "Lezlye Zupkus",
          ]}
        />
      </div>

      {/* More committee sections would be added here */}
    </div>
  )
}

interface CommitteeCardProps {
  title: string
  rankingMember: string
  members: string[]
  notes?: string[]
  subcommittees?: {
    name: string
    rankingMember: string
    members: string[]
  }[]
}

function CommitteeCard({ title, rankingMember, members, notes, subcommittees }: CommitteeCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center mb-4">{title}</h2>
      <Separator className="mb-4" />

      <div className="text-center">
        <p className="font-bold mb-2">Ranking Member</p>
        <p className="font-bold mb-4">{rankingMember}</p>

        {members.map((member, index) => (
          <p key={index} className="mb-1">
            {member}
          </p>
        ))}

        {notes && notes.length > 0 && (
          <div className="mt-4 text-sm">
            {notes.map((note, index) => (
              <p key={index} className="italic">
                {note}
              </p>
            ))}
          </div>
        )}

        {subcommittees && subcommittees.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {subcommittees.map((subcommittee, index) => (
              <div key={index}>
                <p className="font-bold">{subcommittee.name}</p>
                <p className="font-bold mt-2">Ranking Member</p>
                <p className="font-bold mb-2">{subcommittee.rankingMember}</p>
                {subcommittee.members.map((member, memberIndex) => (
                  <p key={memberIndex} className="mb-1">
                    {member}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
