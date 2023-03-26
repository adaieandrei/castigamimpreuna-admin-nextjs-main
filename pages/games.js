import * as React from 'react';
import Head from 'next/head';
import { Button } from 'flowbite-react';
import GridMeciuri from '../components/GridGames'
import { firestoreDB } from '../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs, where, updateDoc, deleteDoc, onSnapshot, orderBy } from 'firebase/firestore'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function Dashboard() {
  const [meciuri, setMeciuri] = React.useState([])
  const [textButtonUpdateTickets72h, setTextButtonUpdateTickets72h] = React.useState("ACTUALIZARE BILETE 72h")
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");

  const handleClickSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };


  const getDataFromDBGenerate = async () => {
    let data = {}
    data.winningTicketsCounter = 0
    data.lostTicketsCounter = 0
    await getDocs(query(collection(firestoreDB, 'generate'), where("status", "==", "active"), orderBy("dateCreated", "desc"))).then(function (querySnapshot) {
      data.generate = querySnapshot.size

      querySnapshot.forEach(async (doc) => {

        if (doc.data().status == "active") {
          let gamesPath = "generate/" + String(doc.id) + "/meciuri"
          const meciuriSnapshot = await getDocs(collection(firestoreDB, gamesPath))
          let wins = 0
          let losts = 0
          let active = 0

          meciuriSnapshot.forEach(async (item) => {
            let path = item.data().gameId
            let replaceId = path.replace('meciuri/', '')

            meciuri.map(async (meci) => {
              if (meci.id == replaceId) {
                if (meci.status == "win") {
                  wins++
                }
                else if (meci.status == "lost") {
                  losts++
                }
                else if (meci.status == "active") {
                  active++
                }
              }
            })
          })


          if (wins == meciuriSnapshot.size) {
            await updateTicketStatus(doc.id, "win")
          }
          else if (losts) {
            await updateTicketStatus(doc.id, "lost")
          }
          else if (active == meciuriSnapshot.size && active) {
            await updateTicketStatus(doc.id, "active")
          }
          else if (active) {
            await updateTicketStatus(doc.id, "active")
          }
          else if (meciuriSnapshot.size == 0 && !active && !losts && !wins) {
            await deleteDocument(doc.id)
          }
        }
      }
      );
    })
    return data
  }

  const deleteDocument = async (docId) => {
    try {
      await deleteDoc(doc(firestoreDB, 'generate', docId))
      console.log(docId + "sters")
      return true
    }
    catch (error) {
      console.log(error)
      return false
    }
  }

  const updateTicketStatus = async (id, status) => {
    try {
      await updateDoc(doc(firestoreDB, 'generate', id), {
        status: status
      }).then(() => {
        console.log(`Ticket ${id} updated with status ${status}`)
      })
      return true
    }
    catch (error) {
      console.log(error)
      return false
    }
  }


  React.useEffect(() => {
    const queryMeciuri = query(collection(firestoreDB, 'games'))
    const unsubscribe = onSnapshot(queryMeciuri, (querySnapshot) => {
      const listaMeciuri = []
      querySnapshot.forEach((doc) => {
        let docData = doc.data()
        docData["id"] = doc.id
        // console.log(docData)
        listaMeciuri.push(docData)
      });
      setMeciuri(listaMeciuri)
    })
    return () => unsubscribe()

  }, []);

  const updateActiveTickets = async () => {
    getDataFromDBGenerate().then(async (res) => {
      // await getDocs(query(collection(firestoreDB, 'generate'), where("status", "==", "win"))).then(function (querySnapshot) {
      //   console.log("Wins: " + querySnapshot.size)
      //   res.generateCastigatoare = querySnapshot.size
      // })
      // await getDocs(query(collection(firestoreDB, 'generate'), where("status", "==", "lost"))).then(function (querySnapshot) {
      //   console.log("Lost: " + querySnapshot.size)
      //   res.generatePierdute = querySnapshot.size
      // })
      // await getDocs(query(collection(firestoreDB, 'generate'), where("status", "==", "active"))).then(function (querySnapshot) {
      //   console.log("Active: " + querySnapshot.size)
      //   res.generateActive = querySnapshot.size
      // })
      const statisticsRef = doc(firestoreDB, 'statistici', 'generate')
      const statistics = {
        abonati: 773,
        bileteGenerate: 13948,
        bileteCastigatoare: 12468,
        biletePierdute: 0,
        bileteNoiCastigatoare: 0,
        bileteNoiPierdute: 0,
        bileteActive: 1458
      }
      setDoc(statisticsRef, statistics).then(() => {
        console.table(statistics)
        alert(JSON.stringify(statistics))
      })
    })


  }

  const copyGames = async () => {
    let date144hAgo = new Date().getTime() - 518400000
    await getDocs(query(collection(firestoreDB, 'meciuri'), where("timestamp", ">", date144hAgo))).then(async function (querySnapshot) {
      const totalGames = querySnapshot.size
      console.log(totalGames)
      let currentGame = 0
      await Promise.all(querySnapshot.docs.map(async (currentDoc) => {
        let docData = currentDoc.data()
        let docId = currentDoc.id
        await setDoc(doc(firestoreDB, "games", docId), docData).then(() => {
          currentGame++
          console.log(`COPIERE MECIURI (${currentGame}/${totalGames})`)
        })
      }))
    })
  }



  return (
    <>
      <Head>
        <title>Meciuri - Admin</title>
      </Head>
      <div className="flex w-full flex-col p-2">
        <div className="flex flex-row justify-between">

          <div className="flex flex-row text-right">
            {/* <Button onClick={updateActiveTickets}>ACTUALIZARE BILETE ACTIVE</Button> */}
            {/* <Button onClick={copyGames} className="ml-2">COPIEAZA MECIURI</Button> */}
          </div>
        </div>
        <div className="flex-1 w-full">
          <GridMeciuri data={meciuri} />
        </div>
      </div>
      <Snackbar open={snackbarOpen} autoHideDuration={10000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

