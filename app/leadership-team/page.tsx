import LeaderCard from "@/components/LeaderCard"
import { leadershipTeam, type LeadershipMember } from "@/lib/leadership-team-data"

function groupByTitle(data: LeadershipMember[]) {
  return data.reduce(
    (acc, member) => {
      if (!acc[member.title]) acc[member.title] = []
      acc[member.title].push(member)
      return acc
    },
    {} as Record<string, LeadershipMember[]>,
  )
}

export default function LeadershipTeamPage() {
  const groupedLeadership = groupByTitle(leadershipTeam)

  return (
    <div className="container py-10 px-4 md:px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-primary-navy mb-12">HOUSE REPUBLICAN LEADERSHIP 2025–2027</h1>

      {/* Republican Leader */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-secondary-red">Republican Leader</h2>
        <div className="flex justify-center">
          {groupedLeadership["Republican Leader"]?.map((leader) => (
            <LeaderCard
              key={leader.name}
              name={leader.name}
              title={leader.title}
              imageUrl={leader.image}
              profileUrl={leader.profileUrl}
              large
            />
          ))}
        </div>
      </section>

      {/* Deputy Republican Leaders */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-secondary-red">Deputy Republican Leaders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {groupedLeadership["Deputy Republican Leader"]?.map((leader) => (
            <LeaderCard
              key={leader.name}
              name={leader.name}
              title={leader.title}
              imageUrl={leader.image}
              profileUrl={leader.profileUrl}
            />
          ))}
        </div>
      </section>

      {/* Deputy Republican Leaders At-Large */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-secondary-red">Deputy Republican Leaders At-Large</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {groupedLeadership["Deputy Republican Leader At-Large"]?.map((leader) => (
            <LeaderCard
              key={leader.name}
              name={leader.name}
              title={leader.title}
              imageUrl={leader.image}
              profileUrl={leader.profileUrl}
            />
          ))}
        </div>
      </section>

      {/* House Republican Caucus Chairman & Policy Chairmen */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-center mb-8 text-secondary-red">
              House Republican
              <br />
              Caucus
              <br />
              Chairman
            </h2>
            <div className="flex justify-center">
              {groupedLeadership["House Republican Caucus Chairman"]?.map((leader) => (
                <LeaderCard
                  key={leader.name}
                  name={leader.name}
                  title={leader.title}
                  imageUrl={leader.image}
                  profileUrl={leader.profileUrl}
                />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-center mb-8 text-secondary-red">
              House Republican
              <br />
              Policy Chairmen
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {groupedLeadership["House Republican Policy Chairmen"]?.map((leader) => (
                <LeaderCard
                  key={leader.name}
                  name={leader.name}
                  title={leader.title}
                  imageUrl={leader.image}
                  profileUrl={leader.profileUrl}
                  small
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* House Republican Whips */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-secondary-red">House Republican Whips</h2>

        {/* Chief Whips */}
        <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
          {groupedLeadership["House Republican Whips (Chief Whip)"]?.map((leader) => (
            <div key={leader.name} className="flex flex-col items-center">
              <LeaderCard
                name={leader.name}
                title="(Chief Whip)"
                imageUrl={leader.image}
                profileUrl={leader.profileUrl}
                small
              />
            </div>
          ))}
        </div>

        {/* Regular Whips */}
        <div className="grid grid-cols-5 gap-4 max-w-4xl mx-auto">
          {groupedLeadership["House Republican Whips"]?.map((leader) => (
            <LeaderCard
              key={leader.name}
              name={leader.name}
              imageUrl={leader.image}
              profileUrl={leader.profileUrl}
              xsmall
            />
          ))}
        </div>
      </section>

      {/* Assistant House Republican Leaders */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-secondary-red">Assistant House Republican Leaders</h2>

        {/* First Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
          {groupedLeadership["Assistant House Republican Leaders"]?.slice(0, 4).map((leader) => (
            <LeaderCard
              key={leader.name}
              name={leader.name}
              imageUrl={leader.image}
              profileUrl={leader.profileUrl}
              xsmall
            />
          ))}
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {groupedLeadership["Assistant House Republican Leaders"]?.slice(4, 8).map((leader) => (
            <LeaderCard
              key={leader.name}
              name={leader.name}
              imageUrl={leader.image}
              profileUrl={leader.profileUrl}
              xsmall
            />
          ))}
        </div>

        {/* Third Row (Ben McGorty) */}
        <div className="flex justify-center mt-8">
          {groupedLeadership["Assistant House Republican Leaders"]?.slice(8, 9).map((leader) => (
            <LeaderCard
              key={leader.name}
              name={leader.name}
              imageUrl={leader.image}
              profileUrl={leader.profileUrl}
              xsmall
            />
          ))}
        </div>
      </section>
    </div>
  )
}
