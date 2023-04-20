// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { firestoreDB } from '../../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs, where, updateDoc, deleteDoc, onSnapshot, orderBy } from 'firebase/firestore'

export default async function handler(req, res) {

  const { body: { method } } = req

  const tickets = []
  // console.log(method)
  if (method === 'active') {
    const q = query(collection(firestoreDB, 'generated'), where('status', '==', method))
    const querySnapshot = await getDocs(q)
    // console.log(querySnapshot.size)
    querySnapshot.forEach((doc) => {
      tickets.push({ id: doc.id, ...doc.data() })
    })
  } else {
    const days = parseInt(method)
    const diffdaysAgo = new Date() - days * 24 * 60 * 60 * 1000
    const q = query(collection(firestoreDB, 'generated'), where("dateCreated", ">", diffdaysAgo))
    const querySnapshot = await getDocs(q)
    // console.log(querySnapshot.size)
    querySnapshot.forEach((doc) => {
      tickets.push({ id: doc.id, ...doc.data() })
    })
  }

  const totalTickets = tickets.length
  let currentTicket = 0
  let ticketsWon = 0
  let ticketsLost = 0
  let ticketsActive = 0

  for (const ticket of tickets) {
    // console.log(`Verifica biletul #${currentTicket}: ${ticket.id}`)
    let wins = 0
    let losses = 0
    let active = 0

    const meciPromises = ticket.meciuri.map(async (meci) => {
      const docRef = doc(firestoreDB, 'games', meci)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const game = docSnap.data()
        if (game.status == "win") {
          wins++
        }
        if (game.status == "lost") {
          losses++
        }
        if (game.status == "active") {
          active++
        }
      }
    })

    await Promise.all(meciPromises)

    if (losses) {
      ticketsLost++
      // console.log(`Biletul ${ticket.id} este pierdut`)
      await updateDoc(doc(firestoreDB, 'generated', ticket.id), {
        status: "lost",
        statistics: {
          wins: wins,
          losses: losses,
          active: active
        }
      })
    } else if (wins == ticket.meciuri.length) {
      ticketsWon++
      // console.log(`Biletul ${ticket.id} este castigat`)
      await updateDoc(doc(firestoreDB, 'generated', ticket.id), {
        status: "win",
        statistics: {
          wins: wins,
          losses: losses,
          active: active
        }
      })
    } else {
      ticketsActive++
      // console.log(`Biletul ${ticket.id} este inca activ`)
      await updateDoc(doc(firestoreDB, 'generated', ticket.id), {
        status: "active",
        statistics: {
          wins: wins,
          losses: losses,
          active: active
        }
      })
    }
    currentTicket++
  }

  res.status(200).json({ totalTickets: totalTickets, ticketsWon: ticketsWon, ticketsLost: ticketsLost, ticketsActive: ticketsActive })
}
