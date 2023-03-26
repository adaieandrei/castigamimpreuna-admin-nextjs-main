// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import NextCors from 'nextjs-cors';
import { firestoreDB } from '../../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs, where } from 'firebase/firestore'

export default async function handler(req, res) {
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
    });
    const {
        query: { id },
        method,
    } = req
    if (req.method === 'POST') {
        let bilete = []
        let paths = []
        let meciuri = []

        const bileteSnapshot = await getDocs(query(collection(firestoreDB, "generate")), where("status", "==", "active"))
        bileteSnapshot.forEach(async (doc) => {
            // doc.data() is never undefined for query doc snapshots
            bilete.push(doc.data())
            console.log("bilet adaugat")
        });
        let gamesPath = "generate/" + String(id) + "/meciuri"
        const meciuriSnapshot = await getDocs(collection(firestoreDB, gamesPath))
        meciuriSnapshot.forEach(async (item) => {
            paths.push(item.data().gameId.path)
            console.log("cale meci adaugata")
        })
        await Promise.all(paths.map(async (i) => {
                let replace = i.replace('meciuri/', '')
                const meciSnapshot = await getDoc(doc(firestoreDB, 'meciuri', replace))
                const gameData = meciSnapshot.data()
                meciuri.push(gameData)
                console.log("a adaugat meci")
            })
        )
        console.log("meciuri: " + meciuri)

        // res.send(String(paths[0]))
        res.json(meciuri)

        // if (paths.length) {
        // }

        // res.send(String(paths.length))



    } else {
        res.status(200).send("Method not allowed")
    }
}
