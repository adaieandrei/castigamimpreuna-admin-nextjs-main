// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as React from 'react'
import { firestoreDB } from "../../../firebase"
import { getFirestore, collection, doc, setDoc, query, where, getDocs, getDoc } from "firebase/firestore";


export default function handler(req, res) {

  const { slug } = req.query
  console.log(slug)

  res.status(200).json({ name: slug })
}
