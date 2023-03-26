// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import NextCors from 'nextjs-cors';
import { firestoreDB } from '../../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs, where, limit } from 'firebase/firestore'
export default async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
  });
  const {
    body: { ticketsLimit, afterDateCreated, minOdd },
    method,
  } = req
  if (req.method === 'GET') {
    console.log(ticketsLimit)
    var date = new Date();
    date.setDate(date.getDate() - 4);
    // let userId = auth.currentUser.uid
    //querySnapshot where status == win and dateCreated > afterDateCreated
    const querySnapshot = await getDocs(query(collection(firestoreDB, "generate"), where("dateCreated", '>', afterDateCreated), where("status", "==", "win"), limit(ticketsLimit)))
    let bilete = [];
    let paths = []
    console.log("bilete castigate " + querySnapshot.size)
    querySnapshot.forEach(async (docData) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(docData.data())
      let bilet = docData.data()
      bilet["id"] = docData.id
      let meciuri = []
      let cota = 1
      let gamesPath = "generate/" + String(bilet.id) + "/meciuri"
      const meciuriSnapshot = await getDocs(collection(firestoreDB, gamesPath))
      meciuriSnapshot.forEach(async (item) => {
        // console.log(item.data().gameId)
        paths.push(item.data().gameId)
      })
      await Promise.all(paths.map(async (i) => {
        let replace = i.replace('meciuri/', '')
        const docRef = doc(firestoreDB, 'meciuri', replace)
        const meciSnapshot = await getDoc(docRef)
        const gameData = meciSnapshot.data()
        // console.log(gameData)
        meciuri.push(gameData)
      }))
      // console.log(meciuri)
      bilet.meciuri = meciuri
      meciuri.map(item => {
        cota = cota * new Number(item.odd)
      })
      if (cota > minOdd) {
        bilet.cota = cota
        bilet.totalMeciuri = meciuri.length

        // console.log(bilet)
        bilete.push(bilet)
      }



      // if (bilete.length == ticketsLimit) {
      //   res.json({ bilete: bilete })
      // }

    });
    // console.log(bilete)



    res.json({ bilete: bilete })
  }
  // console.log(req)
  // res.status(200).json({ name: 'John Doe' })
}
