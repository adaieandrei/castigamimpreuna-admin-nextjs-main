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
        body: { shopCode, day, hour, team1, team2, marketName, market, odd, url, flag, countryLeague, countryName },
        method,
    } = req
    if (req.method === 'POST') {
        const docData = {
            shopCode: shopCode,
            countryLeague: countryLeague,
            countryName: countryName,
            day: day,
            hour: hour,
            team1: team1,
            team2: team2,
            marketName: marketName,
            market: market,
            odd: odd,
            flag: flag,
            url: url,
            status: "active",
            timestamp: Date.now()
        }

        const newPost = doc(collection(firestoreDB, 'meciuri'))
        setDoc(newPost, docData).then(() => {
            res.json({ timestamp: Date.now(), status: "success" })
        })


        // res.json({ shopCode: shopCode, day: day, hour: hour, team1: team1, team2: team2, marketName: marketName, market: market, odd: odd, url: url })

    } else {
        res.status(200).send("Method not allowed")


    }
}