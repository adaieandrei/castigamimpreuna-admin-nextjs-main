import React from 'react'
import { firestoreDB } from '../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs, where, updateDoc, deleteDoc, onSnapshot, orderBy } from 'firebase/firestore'
import GridUsers from '../components/GridUsers'
import Head from 'next/head'
import { Button } from 'flowbite-react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Users() {
    const [users, setUsers] = React.useState([])
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
        const unsubscribe = onSnapshot(query(collection(firestoreDB, "users")), (querySnapshot) => {
            const data = []
            querySnapshot.forEach((doc) => {
                const docData = doc.data()
                // console.log(docData)
                const item = {}
                item.id = doc.id
                item.uid = docData.uid
                item.createdAt = docData.metadata.createdAt
                item.lastSignInTime = docData.metadata.lastSignInTime
                item.displayName = docData.displayName
                item.email = docData.email
                item.phoneNumber = docData.phoneNumber
                item.username = docData.username
                item.subscriptionStart = docData.subscription?.dateStart
                item.subscriptionEnd = docData.subscription?.dateEnd
                item.subscriptionInterval = docData.subscription?.intervalCount
                item.subscriptionStatus = docData.subscription?.dateEnd ? docData.subscription?.dateEnd * 1000 > new Date().getTime() ? "activ" : "inactiv" : "undefined"
                data.push(item)
            })
            // console.log(data)
            data.sort((a, b) => {
                return b.createdAt - a.createdAt
            })
            setUsers(data)
        })
        return unsubscribe
    }, [])







    return (
        <>
            <Head>
                <title>Utilizatori - Admin</title>
            </Head>
            <div className="flex flex-row gap-2">
            </div>

            <GridUsers users={users} />
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