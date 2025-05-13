import { Separator } from "@/components/ui/separator"
import CaucusMembersTable from "@/components/caucus-members-table"

export default function CaucusMembersPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-center text-primary-navy mb-8">2025 Caucus Members</h1>
      <Separator className="mb-8" />

      <div className="mb-8">
        <p className="mb-4">
          The House Republican Caucus includes 43 state representatives from throughout Connecticut who serve in the
          151-seat{" "}
          <a
            href="https://www.cga.ct.gov/asp/menu/house.asp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-red hover:underline"
          >
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

      <CaucusMembersTable />
    </div>
  )
}
