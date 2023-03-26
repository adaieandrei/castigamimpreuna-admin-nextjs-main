import React from 'react'
import { firestoreDB } from '../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs, where, updateDoc, deleteDoc, onSnapshot, orderBy } from 'firebase/firestore'
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
    const [textButtonUpdateTickets48h, setTextButtonUpdateTickets48h] = React.useState("ACTUALIZARE BILETE 48h")
    const [textButtonUpdateActiveTickets, setTextButtonUpdateActiveTickets] = React.useState("ACTUALIZARE BILETE ACTIVE")
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
        const collectionName = process.env.NODE_ENV === 'production' ? 'generated' : 'generated'
        const diff3daysAgo = new Date() - 3 * 24 * 60 * 60 * 1000
        const unsubscribe = onSnapshot(query(collection(firestoreDB, collectionName), orderBy("dateCreated", "desc"), where("dateCreated", ">", diff3daysAgo)), (querySnapshot) => {
            const data = []
            querySnapshot.forEach((doc) => {
                const item = doc.data()
                item.id = doc.id
                data.push(item)
            })
            // console.log(data)
            setTickets(data)
        })
        return unsubscribe
    }, [])

    const updateTicketsActive = async () => {
        setTextButtonUpdateActiveTickets("Incepe actualizarea")

        const totalTickets = tickets.length
        let currentTicket = 0
        let ticketsWon = 0
        let ticketsLost = 0
        let ticketsActive = 0

        for (const ticket of tickets) {
            if (ticket.status == "active") {
                setTextButtonUpdateTickets48h(`Actualizare bilet ${currentTicket}/${totalTickets}`)
                // console.log(`Verifica biletul #${currentTicket}: ${ticket.id}`)
                let wins = 0
                let losses = 0
                let active = 0

                for (const meci of ticket.meciuri) {
                    // console.log(`Verifica meciul ${meci}`)
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
                }

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
                        status: "won",
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
                    setTextButtonUpdateActiveTickets(`Actulizarea s-a terminat!`)
                    setSnackbarMessage(`Actulizarea s-a terminat! Castigate: ${ticketsWon} | Pierdute: ${ticketsLost} | Active: ${ticketsActive}`)
                    setSnackbarOpen(true)
                    setTimeout(() => {
                        setTextButtonUpdateActiveTickets(`ACTUALIZARE BILETE ACTIVE`)
                    }, 3000)
                }
                currentTicket++
            }
        }
    }

    const updateTickets48h = async () => {
        let date48hAgo = new Date().getTime() - 172800000
        const totalTickets = tickets.length
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

                for (const meci of ticket.meciuri) {
                    // console.log(`Verifica meciul ${meci}`)
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
                }

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
                        setTextButtonUpdateTickets48h(`ACTUALIZARE BILETE 48h`)
                    }, 3000)
                }
                currentTicket++
            }
        }

    }





    return (
        <>
            <Head>
                <title>Bilete - Admin</title>
            </Head>
            <div className="flex flex-row gap-2">
                <Button onClick={updateTicketsActive}>{textButtonUpdateActiveTickets}</Button>
                <Button onClick={updateTickets48h}>{textButtonUpdateTickets48h}</Button>
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