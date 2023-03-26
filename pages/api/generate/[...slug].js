import { useEffect,useState } from 'react';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { firestoreDB } from '../../../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs } from 'firebase/firestore'


export default async function handler(req, res) {
    const { slug } = req.query
    let randomMeciuri = []
    
    console.log(slug)

    console.log(parseInt(slug[0])+parseInt(slug[0]))

    const getDataFromDB = async () => {
      let listaMeciuri = []
      const docMeciuri = query(collection(firestoreDB, 'meciuri'))
      const docMeciuriSnapshot = await getDocs(docMeciuri)
      docMeciuriSnapshot.forEach((doc) => {
        listaMeciuri.push(doc.data())
      });


      for (var i=0;i<=parseInt(slug[0]);i++){
        var random = Math.floor(Math.random() * listaMeciuri.length)
        randomMeciuri.push(listaMeciuri[random])
      }
    
     
      res.status(200).json({ name: randomMeciuri })

    }

      getDataFromDB()

    
  }