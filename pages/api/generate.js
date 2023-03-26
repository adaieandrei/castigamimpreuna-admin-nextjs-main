// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import NextCors from 'nextjs-cors';
import { firestoreDB } from '../../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs, where, addDoc, add } from 'firebase/firestore'
import moment from 'moment';


export default async function handler(req, res) {

    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
    });
    const {
        body: { gamesNumber, userId, availableDays },
        method,
    } = req
    if (req.method === 'POST') {
        let meciuri = []
        let meciuriFinal = []
        let generatedInfo = {
            dateCreated: Date.now(),
            status: "active",
            userId: userId
        }
        await Promise.all(availableDays.map(async (day) => {
            if (day.isChecked) {
                const q = query(collection(firestoreDB, "meciuri"), where("status", "==", "active"), where("day", "==", day.day))
                const querySnapshot = await getDocs(q)
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    let docData = doc.data()
                    let today = moment().format('YYYY-MM-DD');
                    let hour = moment(today + " " + docData.hour, "YYYY-MM-DD HH:mm").format('YYYY-MM-DD HH:mm')
                    docData.path = "meciuri/" + doc.id
                    hour > moment().format('YYYY-MM-DD HH:mm') && meciuri.push(docData)
                });
            }
        }))

        do {
            let getMeci = meciuri[Math.floor(Math.random() * meciuri.length)]
            // if shopCode is included in meciuriFinal, then we don't add it
            if (meciuriFinal.find(x => x.shopCode === getMeci.shopCode)) {
                continue
            }
            // console.log(getMeci.shopCode)
            meciuriFinal.push(getMeci)
        }
        while (meciuriFinal.length < gamesNumber)

        const writeDBInfo = await addDoc(collection(firestoreDB, 'generate'), generatedInfo)
        if (writeDBInfo) {
            for (var i = 0; i < meciuriFinal.length; i++) {
                await addDoc(collection(firestoreDB, 'generate/' + writeDBInfo.id + "/meciuri"), { gameId: meciuriFinal[i].path })
            }
            res.json({ timestamp: Date.now(), status: "success", id: writeDBInfo.id })
        }

    } else {
        res.status(200).send("Method not allowed")
    }
}
