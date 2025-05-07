import Image from "next/image"

interface LeadershipMember {
  name: string
  position: string
  title?: string
  imageUrl: string
  profileUrl: string
}

export default function LeadershipTeamPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-center text-primary-navy mb-8">House Republican Leadership 2025–2027</h1>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Republican Leader</h2>
        <div className="flex justify-center">
          <LeaderCard
            name="Vincent Candelora"
            position="Republican Leader"
            imageUrl="/portrait-vincent-candelora.png"
            profileUrl="https://www.cthousegop.com/Candelora"
            large
          />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Deputy Republican Leaders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <LeaderCard
            name="Tom O'Dea"
            position="Deputy Republican Leader"
            imageUrl="/portrait-man.png"
            profileUrl="https://www.cthousegop.com/ODea"
          />
          <LeaderCard
            name="Dave Rutigliano"
            position="Deputy Republican Leader"
            imageUrl="/dave-rutigliano-portrait.png"
            profileUrl="https://www.cthousegop.com/Rutigliano"
          />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Deputy Republican Leaders At-Large</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <LeaderCard
            name="Tim Ackert"
            position="Deputy Republican Leader At-Large"
            imageUrl="/portrait-tim-ackert.png"
            profileUrl="https://www.cthousegop.com/Ackert"
          />
          <LeaderCard
            name="Lezlye Zupkus"
            position="Deputy Republican Leader At-Large"
            imageUrl="/portrait-lezlye-zupkus.png"
            profileUrl="https://www.cthousegop.com/Zupkus"
          />
        </div>
      </section>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-center mb-8">House Republican Caucus Chairman</h2>
            <LeaderCard
              name="Christie Carpino"
              position="House Republican Caucus Chairman"
              imageUrl="/placeholder.svg?height=250&width=250&query=portrait of Christie Carpino"
              profileUrl="https://www.cthousegop.com/Carpino"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-center mb-8">House Republican Policy Chairmen</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <LeaderCard
                name="Tami Zawistowski"
                position="Policy Chairman"
                imageUrl="/placeholder.svg?height=200&width=200&query=portrait of Tami Zawistowski"
                profileUrl="https://www.cthousegop.com/Zawistowski"
                small
              />
              <LeaderCard
                name="Devin Carney"
                position="Policy Chairman"
                imageUrl="/placeholder.svg?height=200&width=200&query=portrait of Devin Carney"
                profileUrl="https://www.cthousegop.com/Carney"
                small
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">House Republican Whips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <LeaderCard
            name="John Piscopo"
            position="Chief Whip"
            imageUrl="/placeholder.svg?height=200&width=200&query=portrait of John Piscopo"
            profileUrl="https://www.cthousegop.com/Piscopo"
            small
          />
          <LeaderCard
            name="Dave Yaccarino"
            position="Chief Whip"
            imageUrl="/placeholder.svg?height=200&width=200&query=portrait of Dave Yaccarino"
            profileUrl="https://www.cthousegop.com/Yaccarino"
            small
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
          <LeaderCard
            name="Jay Case"
            position="Whip"
            imageUrl="/placeholder.svg?height=180&width=180&query=portrait of Jay Case"
            profileUrl="https://www.cthousegop.com/Case/"
            small
          />
          <LeaderCard
            name="Nicole Klarides-Ditria"
            position="Whip"
            imageUrl="/placeholder.svg?height=180&width=180&query=portrait of Nicole Klarides-Ditria"
            profileUrl="https://www.cthousegop.com/Klarides-Ditria"
            small
          />
          <LeaderCard
            name="Cara Pavalock-D'Amato"
            position="Whip"
            imageUrl="/placeholder.svg?height=180&width=180&query=portrait of Cara Pavalock-D'Amato"
            profileUrl="https://www.cthousegop.com/pavalock"
            small
          />
          <LeaderCard
            name="Joe Polletta"
            position="Whip"
            imageUrl="/placeholder.svg?height=180&width=180&query=portrait of Joe Polletta"
            profileUrl="https://www.cthousegop.com/Polletta"
            small
          />
          <LeaderCard
            name="Kurt Vail"
            position="Whip"
            imageUrl="/placeholder.svg?height=180&width=180&query=portrait of Kurt Vail"
            profileUrl="https://www.cthousegop.com/Vail"
            small
          />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Assistant House Republican Leaders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <LeaderCard
            name="Mitch Bolinsky"
            position="Assistant Leader"
            imageUrl="/placeholder.svg?height=180&width=180&query=portrait of Mitch Bolinsky"
            profileUrl="https://www.cthousegop.com/Bolinsky"
            small
          />
          <LeaderCard
            name="Doug Dubitsky"
            position="Assistant Leader"
            imageUrl="/placeholder.svg?height=180&width=180&query=portrait of Doug Dubitsky"
            profileUrl="https://www.cthousegop.com/Dubitsky"
            small
          />
          <LeaderCard
            name="Bill Buckbee"
            position="Assistant Leader"
            imageUrl="/placeholder.svg?height=180&width=180&query=portrait of Bill Buckbee"
            profileUrl="https://www.cthousegop.com/Buckbee"
            small
          />
          <LeaderCard
            name="Irene Haines"
            position="Assistant Leader"
            imageUrl="/placeholder.svg?height=180&width=180&query=portrait of Irene Haines"
            profileUrl="https://www.cthousegop.com/Haines"
            small
          />
          <LeaderCard
            name="Anne Dauphinais"
            position="Assistant Leader"
            imageUrl="/placeholder.svg?height=180&width=180&query=portrait of Anne Dauphinais"
            profileUrl="https://www.cthousegop.com/Dauphinais"
            small
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
          <LeaderCard
            name="Carol Hall"
            position="Assistant Leader"
            imageUrl="/placeholder.svg?height=180&width=180&query=portrait of Carol Hall"
            profileUrl="https://www.cthousegop.com/Hall"
            small
          />
          <LeaderCard
            name="Tom Delnicki"
            position="Assistant Leader"
            imageUrl="/placeholder.svg?height=180&width=180&query=portrait of Tom Delnicki"
            profileUrl="https://www.cthousegop.com/Delnicki"
            small
          />
          <LeaderCard
            name="Gale Mastrofrancesco"
            position="Assistant Leader"
            imageUrl="/placeholder.svg?height=180&width=180&query=portrait of Gale Mastrofrancesco"
            profileUrl="https://www.cthousegop.com/Mastrofrancesco"
            small
          />
          <LeaderCard
            name="Ben McGorty"
            position="Assistant Leader"
            imageUrl="/placeholder.svg?height=180&width=180&query=portrait of Ben McGorty"
            profileUrl="https://www.cthousegop.com/McGorty"
            small
          />
        </div>
      </section>
    </div>
  )
}

interface LeaderCardProps {
  name: string
  position: string
  title?: string
  imageUrl: string
  profileUrl: string
  large?: boolean
  small?: boolean
}

function LeaderCard({ name, position, title, imageUrl, profileUrl, large, small }: LeaderCardProps) {
  const size = large ? "w-64 h-64" : small ? "w-40 h-40" : "w-52 h-52"

  return (
    <div className="flex flex-col items-center">
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-4 rounded-full overflow-hidden transition-transform hover:scale-105"
      >
        <div className={`relative ${size} rounded-full overflow-hidden`}>
          <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
        </div>
      </a>
      <h3 className="text-lg font-semibold text-center">
        <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-secondary-red hover:underline">
          {name}
        </a>
      </h3>
      <p className="text-sm text-gray-600 text-center">{position}</p>
      {title && <p className="text-sm text-gray-600 text-center">{title}</p>}
    </div>
  )
}
