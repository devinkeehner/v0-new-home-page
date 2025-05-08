import Papa from "papaparse"

export interface LeadershipMember {
  Title: string
  Name: string
  "Profile URL": string
  "Image URL": string
}

export async function getLeadershipData(): Promise<LeadershipMember[]> {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CT_House_GOP_Leadership-vGkrXzPPQjwO198SSOSCEOqd34V073.csv",
      { cache: "no-store" },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch leadership data: ${response.status}`)
    }

    const csvText = await response.text()

    const { data } = Papa.parse<LeadershipMember>(csvText, {
      header: true,
      skipEmptyLines: true,
    })

    return data
  } catch (error) {
    console.error("Error fetching leadership data:", error)
    return []
  }
}

export function groupLeadershipByTitle(data: LeadershipMember[]): Record<string, LeadershipMember[]> {
  return data.reduce(
    (groups, member) => {
      const title = member.Title
      if (!groups[title]) {
        groups[title] = []
      }
      groups[title].push(member)
      return groups
    },
    {} as Record<string, LeadershipMember[]>,
  )
}
