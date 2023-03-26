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
    const clientReferenceId = req.body.data.object.client_reference_id
    if (req.method === 'POST') {

        // console.log(req.body)
        console.log(req.body)

        // res.json({ shopCode: shopCode, day: day, hour: hour, team1: team1, team2: team2, marketName: marketName, market: market, odd: odd, url: url })
        res.json({ clientReferenceId: clientReferenceId })

    } else {
        res.status(200).send("Method not allowed")


    }
}