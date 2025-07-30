const representatives = [
  { name: "McGorty, Ben", pressContact: "Jamison Bazinet" },
  { name: "Buckbee, William", pressContact: "Marc Dillon" },
  { name: "Reddington-Hughes, Karen", pressContact: "Marc Dillon" },
  { name: "Jensen, Arnie", pressContact: "Marc Dillon" },
  { name: "Polletta, Joe", pressContact: "Marc Dillon" },
  // /** rest of code here **/
]

const CommunicationsContactsPage = () => {
  return (
    <div>
      <h1>Communications Contacts</h1>
      <ul>
        {representatives.map((rep, index) => (
          <li key={index}>
            <strong>{rep.name}</strong>: {rep.pressContact}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CommunicationsContactsPage
