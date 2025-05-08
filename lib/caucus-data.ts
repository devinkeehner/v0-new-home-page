export interface CaucusMember {
  district: string
  name: string
  nameUrl: string
  contactUrl: string
}

export async function getCaucusMembers(): Promise<CaucusMember[]> {
  try {
    // Use the hardcoded data directly since the CSV parsing was causing issues
    return getHardcodedCaucusMembers()
  } catch (error) {
    console.error("Error fetching caucus data:", error)
    return []
  }
}

// Function with hardcoded data from the user's input
function getHardcodedCaucusMembers(): CaucusMember[] {
  const data = `
<a href='https://www.cthousegop.com/Ackert'>Tim Ackert</a>\t8\t<a href='https://www.cthousegop.com/Ackert/contact'>Contact</a>
<a href="https://www.cthousegop.com/Anderson">Mark Anderson</a>\t62\t<a href="https://www.cthousegop.com/Anderson/contact">Contact</a>
<a href='https://www.cthousegop.com/Aniskovich'>Chris Aniskovich</a>\t35\t<a href='https://www.cthousegop.com/Aniskovich/contact'>Contact</a>
<a href='https://www.cthousegop.com/Bolinsky'>Mitch Bolinsky</a>\t106\t<a href='https://www.cthousegop.com/Bolinsky/contact'>Contact</a>
<a href='https://www.cthousegop.com/Bronko'>Seth Bronko</a>\t70\t<a href='https://www.cthousegop.com/Bronko/contact'>Contact</a>
<a href='https://www.cthousegop.com/buchsbaum'>Jason Buchsbaum</a>\t69\t<a href='https://www.cthousegop.com/buchsbaum/contact/'>Contact</a>
<a href='https://www.cthousegop.com/Buckbee'>Bill Buckbee</a>\t67\t<a href='https://www.cthousegop.com/Buckbee/contact'>Contact</a>
<a href='https://www.cthousegop.com/Callahan'>Patrick Callahan</a>\t108\t<a href='https://www.cthousegop.com/Callahan/contact'>Contact</a>
<a href='https://www.cthousegop.com/Candelora'>Vincent Candelora</a>\t86\t<a href='https://www.cthousegop.com/Candelora/contact'>Contact</a>
<a href='https://www.cthousegop.com/canino/'>Joe Canino</a>\t65\t<a href='https://www.cthousegop.com/canino/contact/'>Contact</a>
<a href='https://www.cthousegop.com/Carney'>Devin Carney</a>\t23\t<a href='https://www.cthousegop.com/Carney/contact'>Contact</a>
<a href='https://www.cthousegop.com/Carpino'>Christie Carpino</a>\t32\t<a href='https://www.cthousegop.com/Carpino/contact'>Contact</a>
<a href="https://www.cthousegop.com/Case/">Jay Case</a>\t63\t<a href='https://www.cthousegop.com/Case/contact'>Contact</a>
<a href='https://www.cthousegop.com/courpas/'>Tina Courpas</a>\t149\t<a href='https://www.cthousegop.com/courpas/contact/'>Contact</a>
<a href='https://www.cthousegop.com/Dauphinais'>Anne Dauphinais</a>\t44\t<a href='https://www.cthousegop.com/Dauphinais/contact'>Contact</a>
<a href='https://www.cthousegop.com/DeCaprio'>Mark DeCaprio</a>\t48\t<a href='https://www.cthousegop.com/DeCaprio/contact'>Contact</a>
<a href='https://www.cthousegop.com/Delnicki'>Tom Delnicki</a>\t14\t<a href='https://www.cthousegop.com/Delnicki/contact'>Contact</a>
<a href='https://www.cthousegop.com/Dubitsky'>Doug Dubitsky</a>\t47\t<a href='https://www.cthousegop.com/Dubitsky/contact'>Contact</a>
<a href='https://www.cthousegop.com/Fishbein'>Craig Fishbein</a>\t90\t<a href='https://www.cthousegop.com/Fishbein/contact'>Contact</a>
<a href="https://www.cthousegop.com/Foncello">Martin Foncello</a>\t107\t<a href='https://www.cthousegop.com/Foncello/contact'>Contact</a>
<a href='https://www.cthousegop.com/Haines'>Irene Haines</a>\t34\t<a href='https://www.cthousegop.com/Haines/contact'>Contact</a>
<a href='https://www.cthousegop.com/Hall'>Carol Hall</a>\t59\t<a href='https://www.cthousegop.com/Hall/contact'>Contact</a>
<a href='https://www.cthousegop.com/Howard'>Greg Howard</a>\t43\t<a href='https://www.cthousegop.com/Howard/contact'>Contact</a>
<a href='https://www.cthousegop.com/Hoxha'>Joe Hoxha</a>\t78\t<a href='https://www.cthousegop.com/Hoxha/contact'>Contact</a>
<a href='https://www.cthousegop.com/jensen'>Arnold Jensen</a>\t131\t<a href='https://www.cthousegop.com/jensen/contact/'>Contact</a>
<a href='https://www.cthousegop.com/Kennedy'>Kathy Kennedy</a>\t119\t<a href='https://www.cthousegop.com/Kennedy/contact'>Contact</a>
<a href='https://www.cthousegop.com/Klarides-Ditria'>Nicole Klarides-Ditria</a>\t105\t<a href='https://www.cthousegop.com/Klarides-Ditria/contact'>Contact</a>
<a href='https://www.cthousegop.com/Lanoue'>Brian Lanoue</a>\t45\t<a href='https://www.cthousegop.com/Lanoue/contact'>Contact</a>
<a href='https://www.cthousegop.com/Marra'>Tracy Marra</a>\t141\t<a href='https://www.cthousegop.com/Marra/contact'>Contact</a>
<a href='https://www.cthousegop.com/Mastrofrancesco'>Gale Mastrofrancesco</a>\t80\t<a href='https://www.cthousegop.com/Mastrofrancesco/contact'>Contact</a>
<a href='https://www.cthousegop.com/McGorty'>Ben McGorty</a>\t122\t<a href='https://www.cthousegop.com/McGorty/contact'>Contact</a>
<a href='https://www.cthousegop.com/Nuccio'>Tammy Nuccio</a>\t53\t<a href='https://www.cthousegop.com/Nuccio/contact'>Contact</a>
<a href="https://www.cthousegop.com/ODea">Tom O'Dea</a>\t125\t<a href="https://www.cthousegop.com/ODea/contact">Contact</a>
<a href='https://www.cthousegop.com/pavalock'>Pavalock-D'Amato</a>\t77\t<a href='https://www.cthousegop.com/pavalock/contact'>Contact</a>
<a href='https://www.cthousegop.com/Piscopo'>John Piscopo</a>\t76\t<a href='https://www.cthousegop.com/Piscopo/contact'>Contact</a>
<a href='https://www.cthousegop.com/Pizzuto'>Bill Pizzuto</a>\t71\t<a href='https://www.cthousegop.com/Pizzuto/contact'>Contact</a>
<a href='https://www.cthousegop.com/Polletta'>Joe Polletta</a>\t68\t<a href='https://www.cthousegop.com/Polletta/contact'>Contact</a>
<a href="https://www.cthousegop.com/Reddington-Hughes">Karen Reddington-Hughes</a>\t66\t<a href='https://www.cthousegop.com/Reddington-Hughes/contact'>Contact</a>
<a href="https://www.cthousegop.com/romano">Amy Romano</a>\t113\t<a href="https://www.cthousegop.com/romano/contact-me/">Contact</a>
<a href='https://www.cthousegop.com/Rutigliano'>David Rutigliano</a>\t123\t<a href='https://www.cthousegop.com/Rutigliano/contact'>Contact</a>
<a href='https://www.cthousegop.com/Scott'>Tony Scott</a>\t112\t<a href='https://www.cthousegop.com/Scott/contact'>Contact</a>
<a href='https://www.cthousegop.com/stewart/'>Chris Stewart</a>\t51\t<a href='https://www.cthousegop.com/stewart/contact'>Contact</a>
<a href='https://www.cthousegop.com/Vail'>Kurt Vail</a>\t52\t<a href='https://www.cthousegop.com/Vail/contact'>Contact</a>
<a href='https://www.cthousegop.com/Veach'>Donna Veach</a>\t30\t<a href='https://www.cthousegop.com/Veach/contact'>Contact</a>
<a href='https://www.cthousegop.com/Weir'>Steve Weir</a>\t55\t<a href='https://www.cthousegop.com/Weir/contact'>Contact</a>
<a href='https://www.cthousegop.com/Yaccarino'>Dave Yaccarino</a>\t87\t<a href='https://www.cthousegop.com/Yaccarino/contact'>Contact</a>
<a href='https://www.cthousegop.com/Zawistowski'>Tami Zawistowski</a>\t61\t<a href='https://www.cthousegop.com/Zawistowski/contact'>Contact</a>
<a href='https://www.cthousegop.com/Zullo'>Joe Zullo</a>\t99\t<a href='https://www.cthousegop.com/Zullo/contact'>Contact</a>
<a href='https://www.cthousegop.com/Zupkus'>Lezlye Zupkus</a>\t89\t<a href='https://www.cthousegop.com/Zupkus/contact'>Contact</a>
  `.trim()

  const members: CaucusMember[] = []
  const rows = data.split("\n")

  for (const row of rows) {
    const columns = row.split("\t")

    if (columns.length >= 3) {
      // Extract name and URL from the HTML link
      const nameHtml = columns[0] || ""
      const nameMatch = nameHtml.match(/<a href=['"](.*?)['"]>(.*?)<\/a>/)

      // Extract district number
      const district = columns[1]?.trim() || ""

      // Extract contact URL from the HTML link
      const contactHtml = columns[2] || ""
      const contactMatch = contactHtml.match(/<a href=['"](.*?)['"]>Contact<\/a>/)

      if (nameMatch && district && contactMatch) {
        members.push({
          district,
          name: nameMatch[2],
          nameUrl: nameMatch[1],
          contactUrl: contactMatch[1],
        })
      }
    }
  }

  // Sort by district number
  return members.sort((a, b) => Number.parseInt(a.district) - Number.parseInt(b.district))
}
