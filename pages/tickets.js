import React from 'react'
import { firestoreDB } from '../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs, where, updateDoc, deleteDoc, onSnapshot, orderBy, limit, writeBatch } from 'firebase/firestore'
import GridTickets from '../components/GridTickets'
import Head from 'next/head'
import { Button } from 'flowbite-react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Tickets() {
    const [tickets, setTickets] = React.useState([])
    const [textButtonUpdateTickets48h, setTextButtonUpdateTickets48h] = React.useState("Verifica bilete 48h")
    const [textButtonUpdateActiveTickets, setTextButtonUpdateActiveTickets] = React.useState("Verifica bilete active")
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");

    const handleClickSnackbar = () => {
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    React.useEffect(() => {
        const collectionName = 'generated'
        const unsubscribe = onSnapshot(query(collection(firestoreDB, collectionName), orderBy("dateCreated", "desc")), (querySnapshot) => {
            const data = []
            querySnapshot.forEach((doc) => {
                const item = doc.data()
                // console.log(item)
                item.id = doc.id
                item.device = item.info?.device
                item.appVersion = item.info?.appVersion
                data.push(item)
            })
            // console.log(data)
            setTickets(data)
        })
        return unsubscribe
    }, [])

    const updateTicketsActive = async () => {
        setTextButtonUpdateActiveTickets("Incepe actualizarea")

        const games = await getDocs(collection(firestoreDB, 'games'))
        const gamesMap = new Map(games.docs.map(d => [d.id, d.data()]))

        const activeTickets = tickets.filter(ticket => ticket.status === "active")
        const totalTickets = activeTickets.length
        let currentTicket = 0
        let ticketsWon = 0
        let ticketsLost = 0
        let ticketsActive = 0

        for (const ticket of activeTickets) {
            setTextButtonUpdateActiveTickets(`Actualizare bilet ${currentTicket + 1}/${totalTickets}`)

            let wins = 0
            let losses = 0
            let active = 0
            let found = 0

            for (const meci of ticket.meciuri) {
                const gameData = gamesMap.get(meci)
                if (gameData) {
                    found++
                    if (gameData.status === "win") wins++
                    else if (gameData.status === "lost") losses++
                    else active++
                }
            }

            let newStatus = null
            const missing = ticket.meciuri.length - found
            if (losses > 0 || missing > 0) {
                newStatus = "lost"
                ticketsLost++
            } else if (wins === found && active === 0) {
                newStatus = "win"
                ticketsWon++
            } else {
                ticketsActive++
            }

            // Only write to DB if status actually changed
            if (newStatus && newStatus !== ticket.status) {
                await updateDoc(doc(firestoreDB, 'generated', ticket.id), {
                    status: newStatus,
                    statistics: { wins, losses, active }
                })
            }

            currentTicket++
        }

        setTextButtonUpdateActiveTickets("Actualizarea s-a terminat!")
        setSnackbarMessage(`Actualizarea s-a terminat! Câștigate: ${ticketsWon} | Pierdute: ${ticketsLost} | Active: ${ticketsActive}`)
        setSnackbarOpen(true)
        setTimeout(() => {
            setTextButtonUpdateActiveTickets("Verifica bilete active")
        }, 3000)
    }

    const updateTickets48h = async () => {
        const games = await getDocs(collection(firestoreDB, 'games'))
        let date48hAgo = new Date().getTime() - 172800000
        // totalTickets length where dateCreated > 48h
        const totalTickets = tickets.filter(ticket => ticket.dateCreated > date48hAgo).length
        let currentTicket = 0
        let ticketsWon = 0
        let ticketsLost = 0
        let ticketsActive = 0

        for (const ticket of tickets) {
            if (ticket.dateCreated > date48hAgo) {
                setTextButtonUpdateTickets48h(`Actualizare bilet ${currentTicket}/${totalTickets}`)
                // console.log(`Verifica biletul #${currentTicket}: ${ticket.id}`)
                let wins = 0
                let losses = 0
                let active = 0

                const meciPromises = ticket.meciuri.map(async (meci) => {
                    const game = games.docs.find(doc => doc.id == meci)
                    const gameData = game?.data()
                    if (gameData) {
                        if (gameData.status == "win") {
                            wins++
                        }
                        if (gameData.status == "lost") {
                            losses++
                        }
                        if (gameData.status == "active") {
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

                if (currentTicket == totalTickets - 1) {
                    setTextButtonUpdateTickets48h(`Actulizarea s-a terminat!`)
                    setSnackbarMessage(`Actulizarea s-a terminat! Castigate: ${ticketsWon} | Pierdute: ${ticketsLost} | Active: ${ticketsActive}`)
                    setSnackbarOpen(true)
                    setTimeout(() => {
                        setTextButtonUpdateTickets48h(`Verifica bilete 48h`)
                    }, 3000)
                }
                currentTicket++
            }
        }

    }

    const deleteIos = async () =>{


        try {
        const querySnapshot = await getDocs(
            query(collection(firestoreDB, 'generated'), where('info.device', '==', 'ios'))
          );
          
          querySnapshot.forEach((doc) => {
            const docRef = doc(firestoreDB, 'generated', doc.id);
            deleteDoc(docRef)
              .then(() => {
               // console.log(`Document with ID ${doc.id} deleted`);
              })
              .catch((error) => {
                console.error(`Error deleting document: ${error}`);
              });
          });
        }catch (error) {
            console.error('Error deleting documents:', error);
          }

    }


    const verifyTickets = async (method) => {
        let dots = '.'
        // animate text by adding dots every 0.5s
        const interval = setInterval(() => {
            if (method === 'active') {
                setTextButtonUpdateActiveTickets(`Actualizare in curs${dots}}`)
            } else {
                setTextButtonUpdateTickets48h(`Actualizare in curs${dots}`)
            }
            dots += '.'
            if (dots.length > 3) dots = '.' // reset dots
        }, 500)

        await fetch('/api/verifyTickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                method: method
            })
        })
            .then(res => res.json())
            .then(data => {
                clearInterval(interval)
                if (method === 'active') {
                    setTextButtonUpdateActiveTickets(`Actualizare finalizata!`)
                } else {
                    setTextButtonUpdateTickets48h(`Actualizare finalizata!`)
                }
                setSnackbarMessage(`Actulizarea s-a terminat! Castigate: ${data.ticketsWon} | Pierdute: ${data.ticketsLost} | Active: ${data.ticketsActive}`)
                setSnackbarOpen(true)
                setTimeout(() => {
                    if (method === 'active') {
                        setTextButtonUpdateActiveTickets(`Verifica bilete active`)
                    } else {
                        setTextButtonUpdateTickets48h(`Verifica bilete 48h`)
                    }
                }, 3000)
            }).catch(err => {
                clearInterval(interval)
                if (method === 'active') {
                    setTextButtonUpdateActiveTickets(`Eroare!`)
                } else {
                    setTextButtonUpdateTickets48h(`Eroare!`)
                }
                setSnackbarMessage(`Eroare la actualizare! ${err.message}}`)
                setSnackbarSeverity('error')
                setSnackbarOpen(true)
                setTimeout(() => {
                    if (method === 'active') {
                        setTextButtonUpdateActiveTickets(`Verifica bilete active`)
                    } else {
                        setTextButtonUpdateTickets48h(`Verifica bilete 48h`)
                    }
                }, 3000)
            })
    }

    const [textButtonDeleteOld, setTextButtonDeleteOld] = React.useState("Șterge bilete > 2 săptămâni")

    const deleteOldTickets = async () => {
        const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000
        const oldTicketsQuery = query(
            collection(firestoreDB, 'generated'),
            where('dateCreated', '<', twoWeeksAgo)
        )
        const snapshot = await getDocs(oldTicketsQuery)
        const total = snapshot.size
        if (total === 0) {
            setSnackbarMessage('Nu există bilete mai vechi de 2 săptămâni.')
            setSnackbarSeverity('info')
            setSnackbarOpen(true)
            return
        }
        setTextButtonDeleteOld(`Se șterg ${total} bilete...`)
        let deleted = 0
        for (const document of snapshot.docs) {
            await deleteDoc(doc(firestoreDB, 'generated', document.id))
            deleted++
            setTextButtonDeleteOld(`Șterse ${deleted}/${total}`)
        }
        setTextButtonDeleteOld('Ștergere completă!')
        setSnackbarMessage(`Au fost șterse ${deleted} bilete mai vechi de 2 săptămâni.`)
        setSnackbarSeverity('success')
        setSnackbarOpen(true)
        setTimeout(() => setTextButtonDeleteOld('Șterge bilete > 2 săptămâni'), 3000)
    }

    const [textButtonDeleteAll, setTextButtonDeleteAll] = React.useState("Șterge toate biletele")
    const [confirmDeleteAll, setConfirmDeleteAll] = React.useState(false)

    const deleteAllTickets = async () => {
        if (!confirmDeleteAll) {
            setConfirmDeleteAll(true)
            setTextButtonDeleteAll("Ești sigur? Apasă din nou")
            setTimeout(() => {
                setConfirmDeleteAll(false)
                setTextButtonDeleteAll("Șterge toate biletele")
            }, 5000)
            return
        }
        setConfirmDeleteAll(false)
        const snapshot = await getDocs(collection(firestoreDB, 'generated'))
        const total = snapshot.size
        if (total === 0) {
            setSnackbarMessage('Nu există bilete de șters.')
            setSnackbarSeverity('info')
            setSnackbarOpen(true)
            return
        }
        setTextButtonDeleteAll(`Se șterg ${total} bilete...`)
        let deleted = 0
        for (const document of snapshot.docs) {
            await deleteDoc(doc(firestoreDB, 'generated', document.id))
            deleted++
            setTextButtonDeleteAll(`Șterse ${deleted}/${total}`)
        }
        setTextButtonDeleteAll('Ștergere completă!')
        setSnackbarMessage(`Au fost șterse toate cele ${deleted} bilete.`)
        setSnackbarSeverity('success')
        setSnackbarOpen(true)
        setTimeout(() => setTextButtonDeleteAll('Șterge toate biletele'), 3000)
    }

    const [textButtonDeleteLost, setTextButtonDeleteLost] = React.useState("Șterge bilete lost")

    const deleteLostTickets = async () => {
        const snapshot = await getDocs(query(collection(firestoreDB, 'generated'), where('status', '==', 'lost')))
        const total = snapshot.size
        if (total === 0) {
            setSnackbarMessage('Nu există bilete pierdute de șters.')
            setSnackbarSeverity('info')
            setSnackbarOpen(true)
            return
        }
        setTextButtonDeleteLost(`Se șterg ${total} bilete lost...`)
        let deleted = 0
        for (const document of snapshot.docs) {
            await deleteDoc(doc(firestoreDB, 'generated', document.id))
            deleted++
            setTextButtonDeleteLost(`Șterse ${deleted}/${total}`)
        }
        setTextButtonDeleteLost('Ștergere completă!')
        setSnackbarMessage(`Au fost șterse ${deleted} bilete pierdute.`)
        setSnackbarSeverity('success')
        setSnackbarOpen(true)
        setTimeout(() => setTextButtonDeleteLost('Șterge bilete lost'), 3000)
    }

    const [textButtonBatch, setTextButtonBatch] = React.useState("Șterge batch (500)")
    const [isBatchRunning, setIsBatchRunning] = React.useState(false)

    const deleteBatch = async () => {
        if (isBatchRunning) return
        setIsBatchRunning(true)
        let totalDeleted = 0

        const runBatch = async () => {
            const snapshot = await getDocs(query(collection(firestoreDB, 'generated'), limit(500)))
            if (snapshot.empty) {
                return false
            }
            const batch = writeBatch(firestoreDB)
            snapshot.docs.forEach((document) => {
                batch.delete(doc(firestoreDB, 'generated', document.id))
            })
            await batch.commit()
            totalDeleted += snapshot.size
            return snapshot.size === 500
        }

        let hasMore = true
        while (hasMore) {
            setTextButtonBatch(`Șterse ${totalDeleted}... (în curs)`)
            hasMore = await runBatch()
        }

        setIsBatchRunning(false)
        setTextButtonBatch('Ștergere completă!')
        setSnackbarMessage(`Au fost șterse ${totalDeleted} bilete în batch-uri de 500.`)
        setSnackbarSeverity('success')
        setSnackbarOpen(true)
        setTimeout(() => setTextButtonBatch('Șterge batch (500)'), 3000)
    }

    return (
        <>
            <Head>
                <title>Bilete - Admin</title>
            </Head>
            <div className="flex flex-row gap-2">
                <Button onClick={updateTicketsActive}>{textButtonUpdateActiveTickets}</Button>
                <Button color="failure" onClick={deleteOldTickets}>{textButtonDeleteOld}</Button>
                <Button color="failure" onClick={deleteLostTickets}>{textButtonDeleteLost}</Button>
                <Button color="failure" onClick={deleteAllTickets}>{textButtonDeleteAll}</Button>
                <Button color="dark" onClick={deleteBatch}>{textButtonBatch}</Button>
            </div>

            <GridTickets tickets={tickets} />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={10000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    )
}